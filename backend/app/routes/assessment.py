from typing import List, Optional
from fastapi import APIRouter, HTTPException, Depends, Form
from db import get_db_connection
from models import AssessmentCreate, AssessmentOut
from datetime import datetime
import json

router = APIRouter()

@router.post("/save", response_model=AssessmentOut)
def create_assessment(assessment: AssessmentCreate):
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        current_date = datetime.utcnow()
        cursor.execute(
            """
            INSERT INTO assessments (patient_id, date, content, doctor_id, therapist_id)
            VALUES (?, ?, ?, ?, ?)
            """,
            (assessment.patient_id, current_date, assessment.content, assessment.doctor_id, assessment.therapist_id),
        )
        conn.commit()
        assessment_id = cursor.lastrowid

        return AssessmentOut(
            id=assessment_id,
            patient_id=assessment.patient_id,
            date=current_date, 
            content=assessment.content,
            doctor_id=assessment.doctor_id,
            therapist_id=assessment.therapist_id,
        )
    except Exception as e:
        print(f"Error details: {str(e)}")
        raise HTTPException(status_code=500, detail=f"An error occurred: {str(e)}")
    finally:
        conn.close()


@router.get("/{patient_id}", response_model=List[AssessmentOut])
def get_assessments(patient_id: int):
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        cursor.execute(
            """
            SELECT id, patient_id, date, content, doctor_id, therapist_id
            FROM assessments WHERE patient_id = ?
            """,
            (patient_id,),
        )
        rows = cursor.fetchall()
        if rows:
            assessments = []
            for row in rows:
                taken_by = None
                role = None

                # Fetch `taken_by` and `role` from doctor/therapist
                if row[4]:  # doctor_id
                    cursor.execute("SELECT doctor_name FROM doctors WHERE id = ?", (row[4],))
                    doctor = cursor.fetchone()
                    if doctor:
                        taken_by = doctor[0]
                        role = "Doctor"
                elif row[5]:  # therapist_id
                    cursor.execute("SELECT therapist_name FROM therapists WHERE id = ?", (row[5],))
                    therapist = cursor.fetchone()
                    if therapist:
                        taken_by = therapist[0]
                        role = "Therapist"

                assessments.append(
                    AssessmentOut(
                        id=row[0],
                        patient_id=row[1],
                        date=row[2],
                        content=row[3],
                        taken_by=taken_by,
                        role=role,
                    )
                )
            return assessments
        return []
    except Exception as e:
        print(f"Error details: {str(e)}")
        raise HTTPException(status_code=500, detail="Error fetching assessments")
    finally:
        conn.close()
