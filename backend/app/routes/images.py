from fastapi import APIRouter, HTTPException, UploadFile, File
import os
import sqlite3
import shutil

router = APIRouter()
UPLOAD_DIR_DOCTOR = "uploads/doctor/"
UPLOAD_DIR_THERAPIST = "uploads/therapist/"

os.makedirs(UPLOAD_DIR_DOCTOR, exist_ok=True)
os.makedirs(UPLOAD_DIR_THERAPIST, exist_ok=True)

DB_PATH = "emr.db"


@router.get("/profile-image/{role}/{user_id}")
def get_profile_image(role: str, user_id: int):
    if role not in ["Therapist", "Doctor"]:
        raise HTTPException(status_code=400, detail="Invalid role")

    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    try:
        table = "therapists" if role == "Therapist" else "doctors"
        cursor.execute(f"SELECT image_url FROM {table} WHERE id = ?", (user_id,))
        row = cursor.fetchone()
        if not row:
            raise HTTPException(status_code=404, detail="User not found")

        # Ensure only the relative path is returned
        return {"profile_image": row[0]}
    finally:
        conn.close()


from uuid import uuid4

@router.put("/update-profile-image/{role}/{user_id}")
async def update_profile_image(role: str, user_id: int, profile_image: UploadFile = File(...)):
    if role not in ["Therapist", "Doctor"]:
        raise HTTPException(status_code=400, detail="Invalid role")

    # Validate file type
    if not profile_image.filename.lower().endswith(('.png', '.jpg', '.jpeg')):
        raise HTTPException(status_code=400, detail="Unsupported file type")

    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    try:
        # Determine the table and directory
        table = "therapists" if role == "Therapist" else "doctors"
        directory = UPLOAD_DIR_THERAPIST if role == "Therapist" else UPLOAD_DIR_DOCTOR

        # Fetch the current image URL from the database
        cursor.execute(f"SELECT image_url FROM {table} WHERE id = ?", (user_id,))
        row = cursor.fetchone()
        if not row:
            raise HTTPException(status_code=404, detail="User not found")

        # Delete the old profile image if it exists
        old_image = row[0]
        if old_image:
            old_image_path = os.path.join(directory, os.path.basename(old_image))
            if os.path.exists(old_image_path):
                os.remove(old_image_path)

        # Generate a unique filename using UUID
        ext = os.path.splitext(profile_image.filename)[-1].lower()  # Get the file extension
        filename = f"{uuid4()}{ext}"
        file_path = os.path.join(directory, filename)

        # Save the new profile image
        with open(file_path, "wb") as f:
            shutil.copyfileobj(profile_image.file, f)

        # Update the database with the new image filename
        cursor.execute(f"UPDATE {table} SET image_url = ? WHERE id = ?", (filename, user_id))
        conn.commit()

        return {"profile_image": filename}
    finally:
        conn.close()
