import shutil
import uuid
from fastapi import APIRouter, File, Form, HTTPException, UploadFile
import sqlite3
from typing import List
from typing import Optional

from fastapi.responses import FileResponse
from models import DoctorCreate, DoctorOut
import os

DB_PATH = "emr.db"
UPLOAD_DIR = "uploads/doctor/"  
os.makedirs(UPLOAD_DIR, exist_ok=True)  


router = APIRouter()

# Fetch all doctors (Exclude passwords)
@router.get("/doctors", response_model=List[DoctorOut])  # type: ignore
def get_all_doctors():
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    params = ()  # No parameters for this query
    cursor.execute("SELECT id, doctor_name, specialization, username FROM doctors", params)
    doctors = cursor.fetchall()
    conn.close()
    return [
        {"id": doctor[0], "doctor_name": doctor[1], "specialization": doctor[2], "username": doctor[3]}
        for doctor in doctors
    ]


@router.get("/doctor-image/{filename}")
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



@router.post("/doctors", response_model=DoctorOut)
async def create_doctor(
    doctor_name: str = Form(...),
    specialization: str = Form(...),
    username: str = Form(...),
    password: str = Form(...),
    file: Optional[UploadFile] = File(None)  # ✅ Make file optional
):
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()

    try:
        # 🔍 Check if username already exists
        cursor.execute("SELECT COUNT(*) FROM doctors WHERE username = ?", (username,))
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
            INSERT INTO doctors (doctor_name, specialization, username, password, image_url)
            VALUES (?, ?, ?, ?, ?)
            """,
            (doctor_name, specialization, username, password, image_url),
        )
        doctor_id = cursor.lastrowid
        conn.commit()

    except Exception as e:
        conn.rollback()
        raise HTTPException(status_code=500, detail=f"An error occurred: {str(e)}")
    finally:
        conn.close()

    return {
        "id": doctor_id,
        "doctor_name": doctor_name,
        "specialization": specialization,
        "username": username,
        "image_url": image_url,  # ✅ Returns None if no image was uploaded
    }

@router.put("/doctors/{doctor_id}", response_model=DoctorOut)
async def update_doctor(
    doctor_id: int,
    doctor_name: str = Form(...),
    specialization: str = Form(...),
    username: str = Form(...),
    password: str = Form(...),
    file: UploadFile = File(None),  # File is optional for updates
):
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    try:
        # Fetch the existing doctor to get the old image path
        cursor.execute("SELECT image_url FROM doctors WHERE id = ?", (doctor_id,))
        existing_doctor = cursor.fetchone()
        if not existing_doctor:
            raise HTTPException(status_code=404, detail="Doctor not found")

        old_image_path = existing_doctor[0]
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

        # Update the doctor's details in the database
        params = (
            doctor_name,
            specialization,
            username,
            password,
            new_image_path,
            doctor_id,
        )
        cursor.execute(
            "UPDATE doctors SET doctor_name = ?, specialization = ?, username = ?, password = ?, image_url = ? WHERE id = ?",
            params,
        )
        if cursor.rowcount == 0:
            raise HTTPException(status_code=404, detail="Doctor not found")

        conn.commit()
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An error occurred: {str(e)}")
    finally:
        conn.close()

    return {
        "id": doctor_id,
        "doctor_name": doctor_name,
        "specialization": specialization,
        "username": username,
        "image_url": new_image_path,
    }


@router.get("/doctors/check-username")
async def check_username_availability(username: str):
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute("SELECT COUNT(*) FROM doctors WHERE username = ?", (username,))
    count = cursor.fetchone()[0]
    conn.close()
    return {"available": count == 0}



# Fetch a single doctor by ID
@router.get("/doctors/{doctor_id}", response_model=DoctorOut)
def get_doctor(doctor_id: int):
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    params = (doctor_id,)
    cursor.execute("SELECT id, doctor_name, specialization FROM doctors WHERE id = ?", params)
    doctor = cursor.fetchone()
    conn.close()
    if not doctor:
        raise HTTPException(status_code=404, detail="Doctor not found")
    return {"id": doctor[0], "doctor_name": doctor[1], "specialization": doctor[2]}



@router.delete("/doctors/{doctor_id}")
def delete_doctor(doctor_id: int):
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    try:
        # Fetch the doctor's image URL
        cursor.execute("SELECT image_url FROM doctors WHERE id = ?", (doctor_id,))
        doctor = cursor.fetchone()
        if not doctor:
            raise HTTPException(status_code=404, detail="Doctor not found")

        image_path = doctor[0]

        # Delete the doctor from the database
        cursor.execute("DELETE FROM doctors WHERE id = ?", (doctor_id,))
        if cursor.rowcount == 0:
            raise HTTPException(status_code=404, detail="Doctor not found")

        # Commit the transaction
        conn.commit()

        # Remove the associated image file if it exists
        if os.path.exists(image_path):
            os.remove(image_path)

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An error occurred: {str(e)}")
    finally:
        conn.close()

    return {"message": "Doctor deleted successfully"}
