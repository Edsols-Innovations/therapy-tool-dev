from fastapi import APIRouter, HTTPException, UploadFile, Form
from fastapi.responses import FileResponse
from pydantic import BaseModel
from db import get_db_connection
import os
import bcrypt
import logging

logging.basicConfig(level=logging.DEBUG)

router = APIRouter()

UPLOAD_DIR = "uploads/admin/"
os.makedirs(UPLOAD_DIR, exist_ok=True)


@router.get("/logo")
def get_admin_logo():
    """
    Fetch the logo path for the admin from the database.
    """
    conn = get_db_connection()
    cursor = conn.cursor()

    try:
        # Query the database for the admin logo path
        cursor.execute("SELECT logo_path FROM administrators")
        row = cursor.fetchone()

        if not row or not row[0]:
            raise HTTPException(status_code=404, detail="Logo not found")

        # Return the logo path as a JSON response
        return {"logo_path": row[0]}
    except Exception as e:
        print(f"Error fetching admin logo: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")
    finally:
        conn.close()


@router.get("/settings")
def get_admin_settings():
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute(
        """
        SELECT hospital_name, hospital_address, contact_number, email, logo_path
        FROM administrators
        """
    )
    row = cursor.fetchone()
    conn.close()

    if not row:
        return {"error": "Settings not found"}

    return {
        "hospital_name": row[0],
        "hospital_address": row[1],
        "contact_number": row[2],
        "email": row[3],
        "logo_path": row[4],
    }


# Update admin settings
@router.put("/settings")
def update_admin_settings(
    hospital_name: str = Form(...),
    hospital_address: str = Form(...),
    contact_number: str = Form(...),
    email: str = Form(...),
    logo: UploadFile = None,
):
    conn = get_db_connection()
    cursor = conn.cursor()

    logo_filename = None
    logo_path = None

    try:
        # Fetch the current logo path from the database
        cursor.execute("SELECT logo_path FROM administrators LIMIT 1")
        current_logo = cursor.fetchone()
        current_logo_path = current_logo[0] if current_logo else None

        # Handle new logo upload
        if logo:
            file_extension = os.path.splitext(logo.filename)[-1]
            logo_filename = f"logo{file_extension}"
            logo_path = os.path.join(UPLOAD_DIR, logo_filename)

            # Remove the old image file if it exists
            if current_logo_path:
                if os.path.exists(current_logo_path):
                    os.remove(current_logo_path)
                else:
                    print(f"Old logo file does not exist: {current_logo_path}")

            # Save the new logo
            with open(logo_path, "wb") as f:
                f.write(logo.file.read())

        # Update the database (assuming only one row in the table)
        cursor.execute(
            """
            UPDATE administrators
            SET hospital_name = ?, hospital_address = ?, contact_number = ?, email = ?, logo_path = ?
            """,
            (hospital_name, hospital_address, contact_number, email, logo_path),
        )
        conn.commit()

        if cursor.rowcount == 0:
            raise HTTPException(
                status_code=500,
                detail="No rows were updated. Please ensure the administrators table is initialized properly.",
            )

        return {"message": "Settings updated successfully."}

    except Exception as e:
        conn.rollback()
        print(f"Database update error: {e}")
        raise HTTPException(status_code=500, detail="Failed to update settings.")
    finally:
        conn.close()



# Change admin password
@router.put("/settings/password")
def change_admin_password(
    current_password: str = Form(...),
    new_password: str = Form(...),
    confirm_password: str = Form(...),
):
    # Validate password inputs
    if not current_password or not new_password or not confirm_password:
        raise HTTPException(status_code=400, detail="All password fields are required.")

    if new_password != confirm_password:
        raise HTTPException(status_code=400, detail="Passwords do not match.")

    conn = get_db_connection()
    cursor = conn.cursor()

    try:
        cursor.execute("SELECT password FROM administrators WHERE username = 'admin'")
        row = cursor.fetchone()
        if not row:
            raise HTTPException(status_code=404, detail="Admin user not found.")

        stored_password = row[0]

        # Verify current password
        if current_password != stored_password:
            raise HTTPException(status_code=400, detail="Incorrect current password.")

        # Update the password in the database
        cursor.execute(
            "UPDATE administrators SET password = ? WHERE username = 'admin'",
            (new_password,),
        )
        conn.commit()
        return {"message": "Password changed successfully."}
    except Exception as e:
        raise HTTPException(status_code=500, detail="An error occurred while changing the password.")
    finally:
        conn.close()
