# File: routes/auth.py
from fastapi import APIRouter, HTTPException, Depends
from models import AdminLogin, TherapistLogin, DoctorLogin
from db import get_db_connection

router = APIRouter()

# Admin Login
@router.post("/admin/signin")
def admin_signin(credentials: AdminLogin):
    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute("""
    SELECT * FROM administrators WHERE username = ? AND password = ?
    """, (credentials.username, credentials.password))
    admin = cursor.fetchone()

    conn.close()

    if admin:
        return {"message": "Admin login successful", "username": admin[1]}
    else:
        raise HTTPException(status_code=401, detail="Invalid admin credentials")


# Therapist Login
@router.post("/therapist/signin")
def therapist_signin(credentials: TherapistLogin):
    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute("""
    SELECT * FROM therapists WHERE username = ? AND password = ?
    """, (credentials.username, credentials.password))
    therapist = cursor.fetchone()

    conn.close()

    if therapist:
         return {
            "id": therapist[0],
            "name": therapist[1],  # Therapist's name
            "username": therapist[2],
            "message": "Therapist login successful"
        }
    else:
        raise HTTPException(status_code=401, detail="Invalid therapist credentials")


# Doctor Login
@router.post("/doctor/signin")
def doctor_signin(credentials: DoctorLogin):
    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute("""
    SELECT * FROM doctors WHERE username = ? AND password = ?
    """, (credentials.username, credentials.password))
    doctor = cursor.fetchone()

    conn.close()

    if doctor:
         return {
            "id": doctor[0],
            "name": doctor[1],  # Therapist's name
            "username": doctor[2],
            "message": "Doctor login successful"
        }
    else:
        raise HTTPException(status_code=401, detail="Invalid doctor credentials")
