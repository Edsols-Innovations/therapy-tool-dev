# File: routes/patient.py
from datetime import datetime
from typing import List, Optional, Union
from fastapi import APIRouter, HTTPException, Body, Form, File, UploadFile
import sqlite3
import os
import shutil
import uuid
from fastapi.responses import FileResponse
router = APIRouter()

UPLOAD_DIR = "uploads/"  # Directory to save uploaded images
os.makedirs(UPLOAD_DIR, exist_ok=True)

DB_PATH = "emr.db"


@router.get("/admin", response_model=List[dict])
def fetch_patients():
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    try:
        # Query to fetch patient data
        cursor.execute("""
            SELECT
                p.id,
                (p.first_name || ' ' || p.last_name) AS name,
                t.therapist_name,
                CAST((strftime('%Y.%m%d', 'now') - strftime('%Y.%m%d', p.dob)) AS INTEGER) AS age,
                p.sex AS gender,
                p.profile_image AS profilePic
            FROM patients p
            LEFT JOIN therapists t ON p.therapist_id = t.id
            ORDER BY p.id ASC
        """)
        rows = cursor.fetchall()

        # Column names for constructing the response
        columns = [desc[0] for desc in cursor.description]
        results = [dict(zip(columns, row)) for row in rows]
        return results

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching patients: {str(e)}")

    finally:
        conn.close()


@router.delete("/admin")
def delete_patients(patient_ids: list[int] = Body(...)):
    """
    Delete multiple patients by their IDs.
    """
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    try:
        # Validate that the provided patient IDs exist
        cursor.execute("SELECT id, profile_image FROM patients WHERE id IN ({})".format(
            ",".join("?" for _ in patient_ids)
        ), patient_ids)
        rows = cursor.fetchall()

        if not rows:
            raise HTTPException(status_code=404, detail="No patients found for the given IDs.")

        # Delete the associated profile images
        for row in rows:
            patient_id, profile_image = row
            if profile_image:
                image_path = os.path.join(UPLOAD_DIR, os.path.basename(profile_image))
                if os.path.exists(image_path):
                    os.remove(image_path)

        # Delete the patients from the database
        cursor.execute("DELETE FROM patients WHERE id IN ({})".format(
            ",".join("?" for _ in patient_ids)
        ), patient_ids)

        if cursor.rowcount == 0:
            raise HTTPException(status_code=404, detail="No patients deleted. Please check the IDs.")

        conn.commit()

        return {"message": f"Deleted {cursor.rowcount} patient(s) successfully."}

    except Exception as e:
        conn.rollback()
        raise HTTPException(status_code=500, detail=f"An error occurred: {str(e)}")

    finally:
        conn.close()



# Get all therapists
@router.get("/fetch_therapists")
def get_therapists():
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute("SELECT id, therapist_name FROM therapists")
    therapists = cursor.fetchall()
    conn.close()
    return [{"id": t[0], "therapist_name": t[1]} for t in therapists]



# Get all doctors
@router.get("/fetch_doctors")
def get_doctors():
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute("SELECT id, doctor_name FROM doctors")
    doctors = cursor.fetchall()
    conn.close()
    return [{"id": d[0], "doctor_name": d[1]} for d in doctors]





@router.get("/fetch-patients", response_model=list)
def fetch_patients(user_id: int, role: str):
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()

    if role == "Therapist":
        query = """
            SELECT
                p.id, 
                (p.first_name || ' ' || p.last_name) AS name, 
                CAST((strftime('%Y.%m%d', 'now') - strftime('%Y.%m%d', p.dob)) AS INTEGER) AS age, 
                p.sex, 
                t.therapist_name, 
                d.doctor_name, 
                p.onboarded_date, 
                p.profile_image
            FROM patients p
            LEFT JOIN therapists t ON p.therapist_id = t.id
            LEFT JOIN doctors d ON p.doctor_id = d.id
            WHERE p.therapist_id IS NULL OR p.therapist_id = ?
            ORDER BY p.onboarded_date DESC
        """
        cursor.execute(query, (user_id,))
    elif role == "Doctor":
        query = """
            SELECT
                p.id, 
                (p.first_name || ' ' || p.last_name) AS name, 
                CAST((strftime('%Y.%m%d', 'now') - strftime('%Y.%m%d', p.dob)) AS INTEGER) AS age, 
                p.sex, 
                t.therapist_name, 
                d.doctor_name, 
                p.onboarded_date, 
                p.profile_image
            FROM patients p
            LEFT JOIN therapists t ON p.therapist_id = t.id
            LEFT JOIN doctors d ON p.doctor_id = d.id
            WHERE p.doctor_id IS NULL OR p.doctor_id = ?
            ORDER BY p.onboarded_date DESC
        """
        cursor.execute(query, (user_id,))
    else:
        # Admin or other roles: fetch all patients
        query = """
            SELECT
                p.id, 
                (p.first_name || ' ' || p.last_name) AS name, 
                CAST((strftime('%Y.%m%d', 'now') - strftime('%Y.%m%d', p.dob)) AS INTEGER) AS age, 
                p.sex, 
                t.therapist_name, 
                d.doctor_name, 
                p.onboarded_date,
                p.profile_image
            FROM patients p
            LEFT JOIN therapists t ON p.therapist_id = t.id
            LEFT JOIN doctors d ON p.doctor_id = d.id
            ORDER BY p.onboarded_date DESC
        """
        cursor.execute(query)

    columns = [col[0] for col in cursor.description]
    results = [dict(zip(columns, row)) for row in cursor.fetchall()]
    conn.close()
    return results



@router.get("/patient-image/{filename}")
async def get_patient_image(filename: str):
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




# Fetch patient data by ID
@router.get("/fetch-profile/{patient_id}")
def get_patient(patient_id: int):
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()

    try:
        cursor.execute(
            """
            SELECT * FROM patients WHERE id = ?
            """,
            (patient_id,),
        )
        row = cursor.fetchone()
        if not row:
            raise HTTPException(status_code=404, detail="Patient not found")

        columns = [column[0] for column in cursor.description]
        patient_data = dict(zip(columns, row))
        return patient_data

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching patient: {str(e)}")

    finally:
        conn.close()




@router.post("/save-patient-history")
def save_patient_history(
    profile_image: UploadFile = File(None),
    first_name: str = Form(...),
    last_name: str = Form(...),
    sex: str = Form(...),
    dob: str = Form(...),
    chronological_age: int = Form(...),
    gestational_age: int = Form(...),
    father_name: str = Form(...),
    father_occupation: str = Form(...),
    father_contact: str = Form(...),
    father_email: str = Form(...),
    mother_name: str = Form(...),
    mother_occupation: str = Form(...),
    mother_contact: str = Form(...),
    mother_email: str = Form(...),
    residence: str = Form(...),
    pedigree: str = Form(None),
    consanguinity: str = Form(None),
    antenatal_history: str = Form(None),
    perinatal_history: str = Form(None),
    conception_mode: str = Form(None),
    delivery_mode: str = Form(None),
    term: str = Form(None),
    cried_at_birth: str = Form(None),
    birth_weight: float = Form(None),
    postnatal_complications: str = Form(None),
    breastfed_upto: str = Form(None),
    therapist_id: Optional[int] = Form(None),
    doctor_id: Optional[int] = Form(None),
):
    try:
        # Handle image upload
        image_path = None
        if profile_image:
            filename = f"{uuid.uuid4()}_{profile_image.filename}"
            image_path = os.path.join(UPLOAD_DIR, filename)
            with open(image_path, "wb") as f:
                shutil.copyfileobj(profile_image.file, f)
            image_path = f"/uploads/{filename}"

        onboarded_date = datetime.now().strftime("%Y-%m-%d")

        # Insert data into the database
        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()
        cursor.execute(
            """
            INSERT INTO patients (
                profile_image, first_name, last_name, sex, dob, chronological_age, gestational_age,
                father_name, father_occupation, father_contact, father_email,
                mother_name, mother_occupation, mother_contact, mother_email,
                residence, pedigree, consanguinity, antenatal_history, perinatal_history,
                conception_mode, delivery_mode, term, cried_at_birth, birth_weight,
                postnatal_complications, breastfed_upto, therapist_id, doctor_id, onboarded_date
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """,
            (
                image_path, first_name, last_name, sex, dob, chronological_age, gestational_age,
                father_name, father_occupation, father_contact, father_email,
                mother_name, mother_occupation, mother_contact, mother_email,
                residence, pedigree, consanguinity, antenatal_history, perinatal_history,
                conception_mode, delivery_mode, term, cried_at_birth, birth_weight,
                postnatal_complications, breastfed_upto, therapist_id, doctor_id, onboarded_date,
            ),
        )
        patient_id = cursor.lastrowid
        conn.commit()
        return {"id": patient_id, "first_name": first_name, "last_name": last_name}
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error saving patient history: {str(e)}")
    finally:
        conn.close()



@router.put("/update/{patient_id}")
def update_patient_history(
    patient_id: int,
    first_name: str = Form(...),
    last_name: str = Form(...),
    sex: str = Form(...),
    dob: str = Form(...),
    chronological_age: int = Form(...),
    gestational_age: int = Form(...),
    father_name: str = Form(...),
    father_occupation: str = Form(...),
    father_contact: str = Form(...),
    father_email: str = Form(...),
    mother_name: str = Form(...),
    mother_occupation: str = Form(...),
    mother_contact: str = Form(...),
    mother_email: str = Form(...),
    residence: str = Form(...),
    pedigree: str = Form(None),
    consanguinity: str = Form(None),
    antenatal_history: str = Form(None),
    perinatal_history: str = Form(None),
    conception_mode: str = Form(None),
    delivery_mode: str = Form(None),
    term: str = Form(None),
    cried_at_birth: str = Form(None),
    birth_weight: float = Form(None),
    postnatal_complications: str = Form(None),
    breastfed_upto: str = Form(None),
    therapist_id: Optional[int] = Form(None),
    doctor_id: Optional[int] = Form(None),
    profile_image: Union[UploadFile, str] = Form(...)
):
    try:
        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()

        # Handle profile image if provided
        image_path = None
        if hasattr(profile_image, "file") and hasattr(profile_image, "filename"): # A new file was uploaded
            cursor.execute("SELECT profile_image FROM patients WHERE id = ?", (patient_id,))
            existing_image = cursor.fetchone()
            if existing_image and existing_image[0]:
                old_image_path = os.path.join(UPLOAD_DIR, os.path.basename(existing_image[0]))
                if os.path.exists(old_image_path):
                    os.remove(old_image_path)
            filename = f"{uuid.uuid4()}_{profile_image.filename}"
            image_path = os.path.join(UPLOAD_DIR, filename)
            with open(image_path, "wb") as f:
                shutil.copyfileobj(profile_image.file, f)
            image_path = f"/uploads/{filename}"
        elif isinstance(profile_image, str):  # The existing file path is provided
            image_path = profile_image  # Retain the existing file path
        else:
            raise HTTPException(status_code=400, detail="Invalid profile_image format.")

        # Update patient record
        cursor.execute(
            """
            UPDATE patients
            SET profile_image=?, first_name=?, last_name=?, sex=?, dob=?, chronological_age=?, gestational_age=?,
                father_name=?, father_occupation=?, father_contact=?, father_email=?,
                mother_name=?, mother_occupation=?, mother_contact=?, mother_email=?,
                residence=?, pedigree=?, consanguinity=?, antenatal_history=?, perinatal_history=?,
                conception_mode=?, delivery_mode=?, term=?, cried_at_birth=?, birth_weight=?,
                postnatal_complications=?, breastfed_upto=?, therapist_id=?, doctor_id=?
            WHERE id=?
            """,
            (
                image_path, first_name, last_name, sex, dob, chronological_age,gestational_age,
                father_name, father_occupation, father_contact, father_email,
                mother_name, mother_occupation, mother_contact, mother_email,
                residence, pedigree, consanguinity, antenatal_history, perinatal_history,
                conception_mode, delivery_mode, term, cried_at_birth, birth_weight,
                postnatal_complications, breastfed_upto, therapist_id or None, doctor_id or None, patient_id,
            ),
        )

        conn.commit()
        return {"message": "Patient history updated successfully"}
    except Exception as e:
        conn.rollback()
        print(f"Error: {str(e)}")
        raise HTTPException(status_code=400, detail=f"Error updating patient history: {str(e)}")
    finally:
        conn.close()
