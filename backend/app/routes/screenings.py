from typing import List
from fastapi import APIRouter, HTTPException, Depends
from db import get_db_connection
from models import ScreeningCreate, ScreeningOut
import json
from datetime import datetime

router = APIRouter()

@router.post("/save", response_model=ScreeningOut)
def create_screening(screening: ScreeningCreate):
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        current_date = datetime.utcnow()  
        cursor.execute("""
            INSERT INTO screenings (patient_id, date, age_group, screening_data, doctor_comment, therapist_id, doctor_id)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        """, (
            screening.patient_id,
            datetime.utcnow().isoformat(),
            screening.age_group,
            json.dumps(screening.screening_data),
            screening.doctor_comment,
            screening.therapist_id,
            screening.doctor_id
        ))
        conn.commit()
        screening_id = cursor.lastrowid
        
        # Return the complete ScreeningOut model
        return ScreeningOut(
            id=screening_id,
            patient_id=screening.patient_id,
            date=current_date,           # Use the created date
            age_group=screening.age_group,
            screening_data=screening.screening_data,
            doctor_comment=screening.doctor_comment
        )
    except Exception as e:
        print(f"Error details: {str(e)}")
        raise HTTPException(status_code=500, detail=f"An error occurred: {str(e)}")
    finally:
        conn.close()


@router.get("/{patient_id}", response_model=List[ScreeningOut])
def get_screenings(patient_id: int):
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        cursor.execute("""
            SELECT 
                s.id, s.patient_id, s.date, s.age_group, s.screening_data, 
                s.doctor_comment, s.doctor_id, s.therapist_id, 
                p.first_name, p.last_name, p.dob
            FROM 
                screenings s
            INNER JOIN 
                patients p
            ON 
                s.patient_id = p.id
            WHERE 
                s.patient_id = ?
        """, (patient_id,))
        
        rows = cursor.fetchall()
        if rows:
            return [
                ScreeningOut(
                    id=row[0],
                    patient_id=row[1],
                    date=row[2],
                    age_group=row[3],
                    screening_data=json.loads(row[4]),
                    doctor_comment=row[5],
                    doctor_id=row[6],
                    therapist_id=row[7],
                    first_name=row[8],
                    last_name=row[9],
                    dob=row[10]
                )
                for row in rows
            ]
        else:
            return []
    except Exception as e:
        print(f"Error details: {str(e)}")
        raise HTTPException(status_code=500, detail="Error fetching screenings")
    finally:
        conn.close()
