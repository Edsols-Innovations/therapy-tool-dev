from fastapi import APIRouter, HTTPException, UploadFile, Form
from db import get_db_connection
from typing import List
from datetime import datetime
import os
import sqlite3

router = APIRouter()

UPLOAD_DIR = "uploads/investigations"
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
            if not file.filename.endswith(('.png', '.jpg', '.jpeg', '.mp4', '.pdf')):
                raise HTTPException(status_code=400, detail="Invalid file type.")
            
            timestamp = datetime.now().timestamp()
            safe_filename = f"{timestamp}_{file.filename.replace(' ', '_')}"
            file_path = os.path.join(UPLOAD_DIR, safe_filename)
            
            # Ensure the file is properly read and written
            contents = await file.read()
            with open(file_path, "wb") as buffer:
                buffer.write(contents)

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