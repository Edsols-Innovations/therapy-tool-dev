import os
import shutil
import uuid
from fastapi import APIRouter, File, Form, HTTPException, UploadFile
import sqlite3
from typing import List,Optional

from fastapi.responses import FileResponse
from models import TherapistCreate, TherapistOut

DB_PATH = "emr.db"
UPLOAD_DIR = "uploads/therapist/"  
os.makedirs(UPLOAD_DIR, exist_ok=True)  


router = APIRouter()

# Fetch all therapists (Exclude passwords)
@router.get("/therapists", response_model=List[TherapistOut])  # type: ignore
def get_all_therapists():
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    params = ()  # No parameters for this query
    cursor.execute("SELECT id, therapist_name, specialization, username FROM therapists", params)
    therapists = cursor.fetchall()
    conn.close()
    return [
        {"id": therapist[0], "therapist_name": therapist[1], "specialization": therapist[2], "username": therapist[3]}
        for therapist in therapists
    ]


@router.get("/therapist-image/{filename}")
async def get_doctor_image(filename: str):
    # Construct the full path to the image
    image_path = os.path.join(UPLOAD_DIR, filename)
    # Debugging log for the constructed path
    print(f"Looking for image at: {image_path}")
    
    # Check if the image exists
    if not os.path.exists(image_path):
        print(f"Image not found for filename: {filename}")  # Debugging log
        raise HTTPException(status_code=404, detail=f"Image not found: {filename}")
    
    # Return the image file
    return FileResponse(image_path)



@router.post("/therapists", response_model=TherapistOut)
async def create_therapist(
    therapist_name: str = Form(...),
    specialization: str = Form(...),
    username: str = Form(...),
    password: str = Form(...),
    file: Optional[UploadFile] = File(None)  # ✅ Make file optional
):
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()

    try:
        # 🔍 Check if username already exists
        cursor.execute("SELECT COUNT(*) FROM therapists WHERE username = ?", (username,))
        if cursor.fetchone()[0] > 0:
            raise HTTPException(status_code=400, detail="Username already exists")

        # 📷 Handle optional file upload
        image_url = None
        if file:
            file_extension = os.path.splitext(file.filename)[1]  # Get the file extension
            unique_filename = f"{uuid.uuid4()}{file_extension}"
            file_path = os.path.join(UPLOAD_DIR, unique_filename)

            # Save file to uploads directory
            with open(file_path, "wb") as buffer:
                shutil.copyfileobj(file.file, buffer)

            image_url = file_path  # Save image path

        # 🏥 Insert into database (image_url can be NULL)
        cursor.execute(
            """
            INSERT INTO therapists (therapist_name, specialization, username, password, image_url)
            VALUES (?, ?, ?, ?, ?)
            """,
            (therapist_name, specialization, username, password, image_url if image_url else None),
        )
        therapist_id = cursor.lastrowid
        conn.commit()

    except Exception as e:
        conn.rollback()
        raise HTTPException(status_code=500, detail=f"An error occurred: {str(e)}")
    finally:
        conn.close()

    return {
        "id": therapist_id,
        "therapist_name": therapist_name,
        "specialization": specialization,
        "username": username,
        "image_url": image_url,  # ✅ Returns None if no image was uploaded
    }


@router.get("/therapists/check-username")
async def check_username_availability(username: str):
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute("SELECT COUNT(*) FROM therapists WHERE username = ?", (username,))
    count = cursor.fetchone()[0]
    conn.close()
    return {"available": count == 0}


# Update an existing therapist
@router.put("/therapists/{therapist_id}", response_model=TherapistOut)
async def update_therapist(
    therapist_id: int,
    therapist_name: str = Form(...),
    specialization: str = Form(...),
    username: str = Form(...),
    password: str = Form(...),
    file: UploadFile = File(None),  # File is optional for updates
):
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    try:
        # Fetch the existing therapist to get the old image path
        cursor.execute("SELECT image_url FROM therapists WHERE id = ?", (therapist_id,))
        existing_therapist = cursor.fetchone()
        if not existing_therapist:
            raise HTTPException(status_code=404, detail="therapist not found")

        old_image_path = existing_therapist[0]
        new_image_path = old_image_path  # Default to the old image if no new file is uploaded

        # If a new file is provided, save it and update the image path
        if file:
            # Generate a unique filename for the new image
            file_extension = os.path.splitext(file.filename)[1]
            unique_filename = f"{uuid.uuid4()}{file_extension}"
            new_image_path = os.path.join(UPLOAD_DIR, unique_filename)

            # Save the new image
            with open(new_image_path, "wb") as buffer:
                shutil.copyfileobj(file.file, buffer)

            # Delete the old image if it exists
            if os.path.exists(old_image_path):
                os.remove(old_image_path)

        # Update the therapist's details in the database
        params = (
            therapist_name,
            specialization,
            username,
            password,
            new_image_path,
            therapist_id,
        )
        cursor.execute(
            "UPDATE therapists SET therapist_name = ?, specialization = ?, username = ?, password = ?, image_url = ? WHERE id = ?",
            params,
        )
        if cursor.rowcount == 0:
            raise HTTPException(status_code=404, detail="therapist not found")

        conn.commit()
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An error occurred: {str(e)}")
    finally:
        conn.close()

    return {
        "id": therapist_id,
        "therapist_name": therapist_name,
        "specialization": specialization,
        "username": username,
        "image_url": new_image_path,
    }


# Fetch a single therapist by ID
@router.get("/therapists/{therapist_id}", response_model=TherapistOut)
def get_therapist(therapist_id: int):
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    params = (therapist_id,)
    cursor.execute("SELECT id, therapist_name, specialization FROM therapists WHERE id = ?", params)
    therapist = cursor.fetchone()
    conn.close()
    if not therapist:
        raise HTTPException(status_code=404, detail="Therapist not found")
    return {"id": therapist[0], "therapist_name": therapist[1], "specialization": therapist[2]}


# Delete a therapist by ID
@router.delete("/therapists/{therapist_id}")
def delete_therapist(therapist_id: int):
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    try:
        # Fetch the therapist's image URL
        cursor.execute("SELECT image_url FROM therapists WHERE id = ?", (therapist_id,))
        therapist = cursor.fetchone()
        if not therapist:
            raise HTTPException(status_code=404, detail="therapist not found")

        image_path = therapist[0]

        # Delete the therapist from the database
        cursor.execute("DELETE FROM therapists WHERE id = ?", (therapist_id,))
        if cursor.rowcount == 0:
            raise HTTPException(status_code=404, detail="therapist not found")

        # Commit the transaction
        conn.commit()

        # Remove the associated image file if it exists
        if os.path.exists(image_path):
            os.remove(image_path)

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An error occurred: {str(e)}")
    finally:
        conn.close()

    return {"message": "therapist deleted successfully"}
