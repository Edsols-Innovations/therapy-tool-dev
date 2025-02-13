from fastapi import APIRouter, HTTPException, UploadFile, Form
from models import InvestigationOut
from db import get_db_connection
from typing import List, Optional
from datetime import datetime
import os
import uuid
import sqlite3

router = APIRouter()

UPLOAD_DIR = "uploads/investigations/"
os.makedirs(UPLOAD_DIR, exist_ok=True)


@router.post("/upload/")
async def upload_multiple_investigations(
    patient_id: int = Form(...),
    files: List[UploadFile] = Form(...),
    names: List[str] = Form(...)
):
    if len(files) != len(names):
        raise HTTPException(status_code=400, detail="Mismatch between files and names.")

    uploaded_files = []
    
    try:
        for file, name in zip(files, names):
            if not file.filename.endswith(('.png', '.jpg', '.jpeg', '.pdf')):
                raise HTTPException(status_code=400, detail="Invalid file type.")
            
            unique_id = str(uuid.uuid4())
            file_extension = os.path.splitext(file.filename)[-1]
            safe_filename = f"{unique_id}{file_extension}"
            file_path = os.path.join(UPLOAD_DIR, safe_filename)

            
            # Ensure the file is properly read and written
            try:
                contents = await file.read()
                with open(file_path, "wb") as buffer:
                    buffer.write(contents)
            except Exception as e:
                raise HTTPException(status_code=500, detail=f"Error saving file {file.filename}: {str(e)}")


            # Save to database with error handling
            conn = None
            try:
                conn = get_db_connection()
                cursor = conn.cursor()
                cursor.execute("""
                    INSERT INTO investigations (patient_id, date, document_name, document_path)
                    VALUES (?, ?, ?, ?)
                """, (patient_id, datetime.now().isoformat(), name, file_path))
                conn.commit()
                uploaded_files.append({"name": name, "path": file_path})
            except sqlite3.Error as e:
                raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")
            finally:
                if conn:
                    conn.close()

        return {"message": "Files uploaded successfully!", "files": uploaded_files}
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Upload failed: {str(e)}")
    


# Fetch investigations for a specific patient
@router.get("/{patient_id}", response_model=List[InvestigationOut])
def get_investigations(patient_id: int, start_date: Optional[str] = None, end_date: Optional[str] = None):
    conn = get_db_connection()
    cursor = conn.cursor()
    print("fetching/")
    try:
        query = "SELECT id, patient_id, date, document_name, document_path FROM investigations WHERE patient_id = ?"
        params = [patient_id]

        if start_date and end_date:
            query += " AND date BETWEEN ? AND ?"
            params.extend([start_date, end_date])

        print(f"Executing query: {query} with params: {params}")
        cursor.execute(query, tuple(params))
        rows = cursor.fetchall()
        print(f"Query returned rows: {rows}")
        
        if not rows:
            raise HTTPException(status_code=404, detail="No investigations found for this patient")

        return [
            InvestigationOut(
                id=row[0],
                patient_id=row[1],
                date=datetime.fromisoformat(row[2]),
                document_name=row[3],
                document_path=row[4]
            )
            for row in rows
        ]

    except Exception as e:
        print(f"Error details: {str(e)}")
        raise HTTPException(status_code=500, detail="Error fetching investigations")
    finally:
        conn.close()


# Fetch details for a specific investigation
@router.get("/investigations/details/{investigation_id}", response_model=InvestigationOut)
def get_investigation_details(investigation_id: int):
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        cursor.execute("""
            SELECT id, patient_id, date, document_name, document_path
            FROM investigations WHERE id = ?
        """, (investigation_id,))
        row = cursor.fetchone()
        if row:
            return InvestigationOut(
                id=row[0],
                patient_id=row[1],
                date=datetime.fromisoformat(row[2]),
                document_name=row[3],
                document_path=row[4]
            )
        else:
            raise HTTPException(status_code=404, detail="Investigation not found")
    except Exception as e:
        print(f"Error details: {str(e)}")
        raise HTTPException(status_code=500, detail="Error fetching investigation details")
    finally:
        conn.close()
