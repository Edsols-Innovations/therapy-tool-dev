from fastapi import APIRouter, HTTPException
from models import LanguageCreate, LanguageOut
from db import get_db_connection
import json
from datetime import datetime
from typing import Dict, List  # Import List for type hinting


router = APIRouter()

@router.post("/save", response_model=LanguageOut)
def create_language(language: LanguageCreate):
    print("Received payload:", language.dict())  # Log the payload
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        current_date = datetime.utcnow()
        cursor.execute("""
            INSERT INTO language (patient_id, date, age, language_data, development_age, doctor_id, therapist_id)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        """, (
            language.patient_id,
            current_date.isoformat(),
            language.age or "unknown",
            json.dumps(language.language_data),
            language.development_age,
            language.doctor_id,
            language.therapist_id
        ))
        conn.commit()
        language_id = cursor.lastrowid

        return LanguageOut(
        id=language_id,
        patient_id=language.patient_id,
        date=current_date.isoformat(),  # Serialize to ISO 8601 string
        age=language.age,
        language_data=language.language_data,
        development_age=language.development_age
    )
    except Exception as e:
        print(f"Error details: {str(e)}")
        raise HTTPException(status_code=500, detail=f"An error occurred: {str(e)}")
    finally:
        conn.close()
@router.get("/{patient_id}", response_model=List[LanguageOut])
def get_language_records(patient_id: int):
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        cursor.execute("""
            SELECT 
                l.id, l.patient_id, l.date, l.age, l.language_data, l.development_age,
                p.first_name, p.last_name, p.dob,
                l.doctor_id, l.therapist_id
            FROM 
                language l
            JOIN 
                patients p 
            ON 
                l.patient_id = p.id
            WHERE 
                l.patient_id = ?
        """, (patient_id,))
        
        rows = cursor.fetchall()
        if rows:
            return [
                LanguageOut(
                    id=row[0],
                    patient_id=row[1],
                    date=row[2].isoformat() if isinstance(row[2], datetime) else row[2],
                    age=row[3],
                    language_data=json.loads(row[4]),
                    development_age=row[5],
                    first_name=row[6] or "",
                    last_name=row[7] or "",
                    dob=row[8].isoformat() if isinstance(row[8], datetime) else row[8] or "",
                    doctor_id=row[9],
                    therapist_id=row[10]
                )
                for row in rows
            ]
        else:
            return []
    except Exception as e:
        print(f"Error details: {str(e)}")
        raise HTTPException(status_code=500, detail="Error fetching language records")
    finally:
        conn.close()

# **Fetch Latest Language Record and Generate Therapy Recommendations**
@router.get("/recommend/{patient_id}", response_model=Dict)
def get_recommended_therapy(patient_id: int):
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        # **Fetch the latest language assessment for the given patient**
        cursor.execute("""
            SELECT 
                l.id, l.patient_id, l.date, l.age, l.language_data, l.development_age,
                p.first_name, p.last_name, p.dob,
                l.doctor_id, l.therapist_id
            FROM 
                language l
            JOIN 
                patients p 
            ON 
                l.patient_id = p.id
            WHERE 
                l.patient_id = ?
            ORDER BY 
                l.date DESC
            LIMIT 1
        """, (patient_id,))
        
        row = cursor.fetchone()
        if not row:
            raise HTTPException(status_code=404, detail="No language assessment found for the given patient")

        # **Parse the latest assessment record**
        assessment_data = {
            "id": row[0],
            "patient_id": row[1],
            "date": row[2].isoformat() if isinstance(row[2], datetime) else row[2],
            "age": row[3],
            "language_data": json.loads(row[4]),
            "development_age": row[5],
            "first_name": row[6] or "",
            "last_name": row[7] or "",
            "dob": row[8].isoformat() if isinstance(row[8], datetime) else row[8] or "",
            "doctor_id": row[9],
            "therapist_id": row[10]
        }

        # **Apply Rule-Based Therapy Recommendations**
        recommendations = generate_recommendations(assessment_data["language_data"])

        return {
            "assessment_data": assessment_data,
            "recommendations": recommendations
        }

    except Exception as e:
        print(f"Error details: {str(e)}")
        raise HTTPException(status_code=500, detail="Error fetching latest language record")
    finally:
        conn.close()

# **Rule-Based Therapy Recommendation Function**
def generate_recommendations(language_data: Dict[str, Dict[str, str]]) -> List[str]:
    recommendations = set()

    for age_range, questions in language_data.items():
        for question, answer in questions.items():
            if answer.lower() == "no":
                print(f"Unmet Milestone: {question}")  # Debugging Output

                # **🔹 VISUAL GAMES** (Speech & Vocalization Issues)
                if question in [
                    "Does the child vocalize when spoken or sung to?",
                    "Does the child vocalize rhythmic syllable chains?",
                    "Does the child form syllable repetitions (e.g., 'ba-ba' or 'da-da')?",
                    "Does the child produce distinct double syllables?",
                    "Does the child use appropriate intonation in jargon speech (babbling with intonation)?",
                    "Has the child spoken their first word?",
                    "Does the child make throaty noises?",
                    "Does the child say 'mama' or 'dada' (even if not contextually correct)?",
                    "Does the child say 'mama' or 'dada' correctly (contextually appropriate)?"
                ]:
                    recommendations.add("Visual Games")

                # **🔹 LISTENING STUDIO** (Hearing & Sound Awareness Issues)
                if question in [
                    "Does the child move their limbs, eyes, or head in response to voices or noise?",
                    "Does the child turn their head in the direction of voices and sounds?",
                    "Does the child respond to a bell laterally?",
                    "Does the child respond to a bell by looking downwards?",
                    "Does the child respond to a bell diagonally?",
                    "Does the child listen to stories when read to?"
                ]:
                    recommendations.add("Listening Studio")

                # **🔹 READING LAB & VISUAL GAMES MODULE 2** (Sentence Formation & Verbal Expression)
                if question in [
                    "Does the child express 'I want' or communicate similar needs verbally?",
                    "Does the child form simple two-word sentences (e.g., 'Want toy')?",
                    "Does the child use 20 words correctly?",
                    "Does the child repeat words they hear while adults are talking?",
                    "Can the child express at least two wants (e.g., 'Want milk' and 'Want ball')?",
                    "Can the child combine three words to form sentences (e.g., 'I want cookie')?",
                    "Does the child use plurals correctly (e.g., 'cats,' 'dogs')?",
                    "Can the child narrate simple experiences (e.g., 'I went park')?"
                ]:
                    recommendations.add("Reading Lab & Visual Games - Module 2")

                # **🔹 PICTORIAL SOUND EXERCISE** (Object Recognition & Word Association)
                if question in [
                    "Can the child name 10 common objects (e.g., ball, cup, fan)?",
                    "Does the child identify objects by name when asked?",
                    "Can the child point to objects described by their use (e.g., 'Show me what you drink from')?",
                    "Can the child point to 5 body parts on themselves or a doll?",
                    "Does the child point to a desired object to indicate their interest?",
                    "Can the child point to major body parts or clothing items when asked?"
                ]:
                    recommendations.add("Pictorial Sound Exercise")

                # **🔹 ANIMATED FLASH CONCEPTS** (Understanding Commands & Social Interaction)
                if question in [
                    "Does the child respond to simple questions (e.g., looking or smiling)?",
                    "Does the child respond to one-step commands with a gesture (e.g., pointing or waving)?",
                    "Does the child respond to one-step commands without the need for a gesture?",
                    "Does the child respond to two-step commands without gestures (e.g., 'Pick up the toy and put it on the table')?",
                    "Does the child initiate gesture-based games (e.g., peek-a-boo)?",
                    "Does the child inhibit their actions when told 'NO'?",
                    "Does the child understand at least two prepositions (e.g., 'in,' 'on')?",
                    "Can the child use 10 action words (e.g., run, jump, eat)?"
                ]:
                    recommendations.add("Animated Flash Concepts")

    return list(recommendations)