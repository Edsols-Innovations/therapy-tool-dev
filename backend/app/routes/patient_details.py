from fastapi import APIRouter, Form, UploadFile, File, HTTPException
from typing import Optional
import os
import sqlite3
from uuid import uuid4

router = APIRouter()

DB_PATH = "patient_history.db"
UPLOAD_DIR = "uploads"

os.makedirs(UPLOAD_DIR, exist_ok=True)  # Ensure the upload directory exists

@router.post("/api/save-patient-history")
async def save_patient_history(
    firstName: str = Form(...),
    lastName: str = Form(...),
    sex: str = Form(...),
    dob: str = Form(...),
    chronologicalAge: int = Form(...),
    fatherName: str = Form(...),
    fatherOccupation: str = Form(...),
    fatherContact: str = Form(...),
    fatherEmail: str = Form(...),
    motherName: str = Form(...),
    motherOccupation: str = Form(...),
    motherContact: str = Form(...),
    motherEmail: str = Form(...),
    residence: str = Form(...),
    pedigree: Optional[str] = Form(None),
    consanguinity: Optional[str] = Form(None),
    antenatalHistory: Optional[str] = Form(None),
    perinatalHistory: Optional[str] = Form(None),
    conceptionMode: Optional[str] = Form(None),
    deliveryMode: Optional[str] = Form(None),
    term: Optional[str] = Form(None),
    criedAtBirth: Optional[str] = Form(None),
    birthWeight: Optional[float] = Form(None),
    postnatalComplications: Optional[str] = Form(None),
    breastfedUpto: Optional[str] = Form(None),
    profile_image: Optional[UploadFile] = None,
    therapist_id: int = Form(...),
    doctor_id: int = Form(...)
):
    try:
        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()

        # Save the profile image
        image_path = None
        if profile_image:
            extension = os.path.splitext(profile_image.filename)[1]
            image_name = f"{uuid4().hex}{extension}"
            image_path = os.path.join(UPLOAD_DIR, image_name)
            with open(image_path, "wb") as f:
                f.write(await profile_image.read())

        # Insert patient data
        cursor.execute(
            """
            INSERT INTO patients (
                first_name, last_name, sex, dob, chronological_age, father_name, father_occupation,
                father_contact, father_email, mother_name, mother_occupation, mother_contact, mother_email, residence,
                pedigree, consanguinity, antenatal_history, perinatal_history, conception_mode, delivery_mode,
                term, cried_at_birth, birth_weight, postnatal_complications, breastfed_upto, profile_image,
                therapist_id, doctor_id
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """,
            (
                firstName, lastName, sex, dob, chronologicalAge, fatherName, fatherOccupation,
                fatherContact, motherName, motherOccupation, motherContact, motherEmail, residence,
                pedigree, consanguinity, antenatalHistory, perinatalHistory, conceptionMode, deliveryMode,
                term, criedAtBirth, birthWeight, postnatalComplications, breastfedUpto, image_path,
                therapist_id, doctor_id
            )
        )

        conn.commit()
        patient_id = cursor.lastrowid
        conn.close()

        return {"message": "Patient history saved successfully", "patient_id": patient_id}

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An error occurred: {str(e)}")
