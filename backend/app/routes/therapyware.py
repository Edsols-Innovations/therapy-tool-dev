from datetime import date, datetime
import tempfile
from fastapi import APIRouter, File, Query, UploadFile, Form, HTTPException
from pathlib import Path as FilePath
from fastapi.responses import JSONResponse, FileResponse
import shutil
import os
import wmi
from cryptography.hazmat.primitives.ciphers import Cipher, algorithms, modes
from cryptography.hazmat.backends import default_backend
from pydantic import BaseModel
from typing import List
from gtts import gTTS
import subprocess
import speech_recognition as sr
import Levenshtein
from pydub import AudioSegment
from models import DeleteWordsRequest, DeleteRequest, TTSRequest, TherapywareCreate, TherapywareOut
import sqlite3
from fastapi import APIRouter, HTTPException
from db import DB_PATH, get_db_connection


TEXT_FILES_DIR = FilePath("../assets/readinglab")
IMAGES_PATH          = "../assets/images"
PSE_WORDS_FILE_PATH  = "../assets/pse"
PSE_AUDIO_DIRECTORY = "../assets/audio"
TTS_DIRECTORY        = "../assets/TTS"
DB_PATH = "emr.db"

router = APIRouter()

   
        
if os.name == "nt":  # For Windows
    documents_folder = os.path.join(os.environ["USERPROFILE"], "Documents")
    print(documents_folder)
        
UPLOAD_DIRECTORY = os.path.join(documents_folder, "TherapywareRecordings")
        
# Ensure the directory is created during startup
if not os.path.exists(UPLOAD_DIRECTORY):
    os.makedirs(UPLOAD_DIRECTORY)
     
    
@router.post("/")
def save_therapyware(data: TherapywareCreate):
    conn = get_db_connection()
    cursor = conn.cursor()

    # Check if patient exists
    cursor.execute("SELECT id FROM patients WHERE id = ?", (data.patient_id,))
    patient = cursor.fetchone()
    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found")

    # Check if therapyware data exists for the patient
    cursor.execute("SELECT id FROM therapyware WHERE patient_id = ?", (data.patient_id,))
    therapyware = cursor.fetchone()

    if therapyware:
        # Update existing record
        cursor.execute("""
        UPDATE therapyware
        SET 
            visual_games = ?,
            module1_submodule1 = ?,
            module1_submodule2 = ?,
            module1_submodule3 = ?,
            module1_submodule4 = ?,
            module2_submodule1 = ?,
            module2_submodule2 = ?,
            listening_studio = ?,
            reading_lab = ?,
            pictorial_sound_exercise = ?,
            animated_flash_concepts = ?
        WHERE patient_id = ?
        """, (
            data.visual_games,
            data.module1_submodule1,
            data.module1_submodule2,
            data.module1_submodule3,
            data.module1_submodule4,
            data.module2_submodule1,
            data.module2_submodule2,
            data.listening_studio,
            data.reading_lab,
            data.pictorial_sound_exercise,
            data.animated_flash_concepts,
            data.patient_id,
        ))
    else:
        # Insert new record
        cursor.execute("""
        INSERT INTO therapyware (
            patient_id,
            visual_games,
            module1_submodule1,
            module1_submodule2,
            module1_submodule3,
            module1_submodule4,
            module2_submodule1,
            module2_submodule2,
            listening_studio,
            reading_lab,
            pictorial_sound_exercise,
            animated_flash_concepts
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            data.patient_id,
            data.visual_games,
            data.module1_submodule1,
            data.module1_submodule2,
            data.module1_submodule3,
            data.module1_submodule4,
            data.module2_submodule1,
            data.module2_submodule2,
            data.listening_studio,
            data.reading_lab,
            data.pictorial_sound_exercise,
            data.animated_flash_concepts,
        ))

    conn.commit()
    conn.close()

    return {"message": "Therapyware data saved successfully"}



@router.get("/{patient_id}", response_model=TherapywareOut)
def get_therapyware(patient_id: int):
    # Create a connection with a row factory for this specific API
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row  # Enable dictionary-like row access
    cursor = conn.cursor()

    # Fetch therapyware data for the given patient_id
    cursor.execute(
        """
        SELECT 
            patient_id,
            visual_games,
            module1_submodule1,
            module1_submodule2,
            module1_submodule3,
            module1_submodule4,
            module2_submodule1,
            module2_submodule2,
            listening_studio,
            reading_lab,
            pictorial_sound_exercise,
            animated_flash_concepts
        FROM therapyware
        WHERE patient_id = ?
        """,
        (patient_id,),
    )
    row = cursor.fetchone()
    conn.close()

    if row is None:
        raise HTTPException(status_code=404, detail="Therapyware data not found for this patient")

    # Return the row directly as a dictionary
    return dict(row)
        
@router.post("/upload/")
async def upload_file(file: UploadFile = File(...), username: str = Form(...), page: str = Form(...)):
    print("Uploading Data")
    recorded_date = datetime.now().strftime("%d%b%Y")
    user_directory = os.path.join(UPLOAD_DIRECTORY, username)
    page_directory = os.path.join(user_directory, page)
    date_directory = os.path.join(page_directory, recorded_date)

    os.makedirs(date_directory, exist_ok=True)

    file_location = os.path.join(date_directory, f"{datetime.now().strftime('%Y%m%d%H%M%S')}-{username}.mp3")
    with open(file_location, "wb+") as file_object:
        shutil.copyfileobj(file.file, file_object)

    return JSONResponse(content={"filename": file_location})


@router.post("/rating/")
async def rate_audio(file: UploadFile = File(...), username: str = Form(...), current_word: str = Form(...), page: str = Form(...)):
    print(f"Rating audio file for {username} on page {page} for word {current_word}")

    # Function to get phonemes using espeak-ng with Indian English accent
    def get_phonemes(word):
        try:
            result = subprocess.run(
                ['espeak-ng', '--ipa', '-v', 'en-in', '-q', word],
                capture_output=True,
                text=True,
                encoding='utf-8'
            )
            if result.returncode != 0:
                raise Exception(f"espeak-ng failed with return code {result.returncode}")
            return result.stdout.strip()
        except Exception as e:
            print(f"Error generating phonemes: {e}")
            return None

    # Function to compare phonemes using Levenshtein distance
    def compare_phonemes(spoken_phonemes, correct_phonemes):
        try:
            distance = Levenshtein.distance(spoken_phonemes, correct_phonemes)
            max_len = max(len(spoken_phonemes), len(correct_phonemes))
            rating = max(0, 10 - (distance / max_len * 10)) if max_len > 0 else 0
            return round(rating, 2)
        except Exception as e:
            print(f"Error comparing phonemes: {e}")
            return 0

    # Function to recognize speech using SpeechRecognition and return text
    async def recognize_speech(wav_file_path):
        recognizer = sr.Recognizer()
        try:
            with sr.AudioFile(wav_file_path) as source:
                print("Processing audio file...")
                audio = recognizer.record(source)
                print("Recognizing speech...")
                recognized_text = recognizer.recognize_google(audio, language="en-IN")
                print(f"Recognized Text: {recognized_text}")
                return recognized_text
        except sr.UnknownValueError:
            print("Could not understand the audio")
            return None
        except sr.RequestError as e:
            print(f"Speech recognition service error: {e}")
            return None
        except Exception as e:
            print(f"Error processing the file for recognition: {e}")
            return None

    # Validate the uploaded file content
    try:
        content = await file.read()
        if not content:
            return JSONResponse(content={"error": "Uploaded audio file is empty."}, status_code=400)
        print(f"Content Length: {len(content)} bytes")
    except Exception as e:
        print(f"Error reading uploaded file: {e}")
        return JSONResponse(content={"error": "Failed to read the uploaded file."}, status_code=500)

    # Use a temporary directory for file handling
    try:
        with tempfile.NamedTemporaryFile(delete=False, suffix=".wav") as temp_file:
            temp_file_path = temp_file.name
            temp_file.write(content)

        # Convert uploaded file to WAV format
        try:
            audio = AudioSegment.from_file(temp_file_path)
            converted_wav_path = temp_file_path.replace('.wav', '_converted.wav')
            audio.export(converted_wav_path, format='wav')
            print("WAV file saved successfully.")
        except FileNotFoundError:
            print("FFmpeg not found. Please ensure FFmpeg is installed and in PATH.")
            return JSONResponse(content={"error": "FFmpeg is not installed or not in PATH."}, status_code=500)
        except Exception as e:
            print(f"Error converting audio file to WAV format: {e}")
            return JSONResponse(content={"error": "Failed to convert the audio file to WAV format."}, status_code=500)

        # Recognize the spoken word from the converted audio file
        try:
            spoken_text = await recognize_speech(converted_wav_path)
            if not spoken_text:
                print("No speech detected.")
                return JSONResponse(content={"error": "No speech detected in the audio file."}, status_code=500)

            # Get phonemes for correct word and spoken word
            correct_phonemes = get_phonemes(current_word)
            spoken_phonemes = get_phonemes(spoken_text)

            if not correct_phonemes or not spoken_phonemes:
                print("Could not generate phonemes for one or both words.")
                return JSONResponse(content={"error": "Failed to generate phonemes for the words."}, status_code=500)

            # Compare phonemes and calculate rating
            rating = compare_phonemes(spoken_phonemes, correct_phonemes)
            print(f"Pronunciation Rating: {rating}/10")
            return JSONResponse(content={"rating": rating})

        except Exception as e:
            print(f"Unexpected error during rating process: {e}")
            return JSONResponse(content={"error": "An error occurred while processing the rating."}, status_code=500)

    except Exception as e:
        print(f"General error handling files: {e}")
        return JSONResponse(content={"error": "An unexpected error occurred while handling files."}, status_code=500)
    finally:
        # Clean up temporary files
        if os.path.exists(temp_file_path):
            os.remove(temp_file_path)
        if os.path.exists(converted_wav_path):
            os.remove(converted_wav_path)



@router.post("/upload-pse/")
async def upload_pse_file(file: UploadFile = File(...), word: str = Form(...)):
    os.makedirs(PSE_AUDIO_DIRECTORY, exist_ok=True)
    safe_word = "".join(c for c in word if c.isalnum() or c in (' ', '-', '_')).rstrip()
    file_location = os.path.join(PSE_AUDIO_DIRECTORY, f"{safe_word}.mp3")
    with open(file_location, "wb+") as file_object:
        shutil.copyfileobj(file.file, file_object)

    return JSONResponse(content={"filename": file_location})


@router.get("/fetch/{file_name}")
async def fetch_file(file_name: str):
    file_path = os.path.join(TEXT_FILES_DIR, file_name)
    if not os.path.isfile(file_path):
        raise HTTPException(status_code=404, detail="File not found")
    with open(file_path, "r") as file:
        content = file.read()
    return {"content": content}

@router.get("/fetchpse/{file_name}")
async def fetch_file(file_name: str):
    file_path = os.path.join(PSE_WORDS_FILE_PATH, file_name)
    if not os.path.isfile(file_path):
        raise HTTPException(status_code=404, detail="File not found")
    with open(file_path, "r") as file:
        content = file.read()
    return {"content": content}


@router.post("/append/{filename}")
async def append_text(filename: str, file: UploadFile = File(...)):
    file_path = os.path.join(TEXT_FILES_DIR, filename)
    if not os.path.exists(file_path):
        return {"message": "Text appended successfully"}
        open(file_path, "w").close()

    content = await file.read()
    content = content.decode("utf-8")
    with open(file_path, "a") as f:
        f.write(content + "\n")

    return {"message": "Text appended successfully"}

@router.post("/appendpse/{filename}")
async def append_text(filename: str, file: UploadFile = File(...)):
    file_path = os.path.join(PSE_WORDS_FILE_PATH, filename)
    if not os.path.exists(file_path):
        return {"message": "Text appended successfully"}
        open(file_path, "w").close()

    content = await file.read()
    content = content.decode("utf-8")
    with open(file_path, "a") as f:
        f.write(content + "\n")

    return {"message": "Text appended successfully"}


@router.post("/delete")
async def delete_selected_text(request: DeleteRequest):
    selected_text_lines = request.selected_text.splitlines()
    print(f"Received text to delete: {selected_text_lines}")  # Debug log

    try:
        # Iterate over all text files in the directory
        for filename in os.listdir(TEXT_FILES_DIR):
            file_path = os.path.join(TEXT_FILES_DIR, filename)
            if not os.path.exists(file_path):
                raise HTTPException(status_code=404, detail=f"File {filename} not found")

            # Read the current content
            with open(file_path, "r") as f:
                content = f.read().splitlines()

            # Remove selected lines
            updated_lines = [line for line in content if line.strip() not in selected_text_lines]

            # Write back the updated content
            with open(file_path, "w") as f:
                f.writelines(line + "\n" for line in updated_lines)

        return {"message": "Selected text deleted from the specified files"}
    except Exception as e:
        print(f"Error during deletion: {e}")
        raise HTTPException(status_code=500, detail=f"Error deleting text: {str(e)}")

@router.get("/words/")
async def get_words():
    try:
        with open(PSE_WORDS_FILE_PATH, "r") as file:
            words = file.read().splitlines()
        words = sorted([word.strip() for word in words if word.strip()])
        return JSONResponse(content=words)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error reading file: {str(e)}")

@router.post("/save-word/")
async def save_word(
    word: str = Form(...),
    category: str = Form(...),
    image: UploadFile = File(...)
):
    try:
        # Capitalize the word
        word = word.capitalize()

        # Sanitize category to prevent directory traversal
        category = os.path.basename(category)
        category_file_path = os.path.join(PSE_WORDS_FILE_PATH, category)

        # Check if the category file exists
        if not os.path.exists(category_file_path):
            raise HTTPException(status_code=404, detail=f"Category file {category} does not exist.")

        # Read existing words from the file
        existing_words = set()
        with open(category_file_path, "r") as file:
            existing_words = set(file.read().splitlines())

        # Add the word to the file if not already present
        if word not in existing_words:
            with open(category_file_path, "a") as f:
                f.write(f"{word}\n")

        # Save the image in the centralized IMAGES_PATH directory
        if not os.path.exists(IMAGES_PATH):
            os.makedirs(IMAGES_PATH)
        image_filename = f"{word}.png"
        image_path = os.path.join(IMAGES_PATH, image_filename)
        try:
            with open(image_path, "wb") as buffer:
                shutil.copyfileobj(image.file, buffer)
        except Exception as e:
            print(f"Error saving image: {e}")
            raise HTTPException(status_code=500, detail=f"Error saving image: {str(e)}")

        return JSONResponse(content={"message": "Word and image saved successfully"}, status_code=200)

    except Exception as e:
        print(f"Error: {e}")
        raise HTTPException(status_code=500, detail="An error occurred while saving the word and image.")

@router.post("/delete-words/")
async def delete_words(request: DeleteWordsRequest):
    # Sanitize and log the received category
    category = os.path.basename(request.category)
    print(f"Received category: {category}")
    category_file_path = os.path.join(PSE_WORDS_FILE_PATH, category)

    # Check if the category file exists
    if not os.path.exists(category_file_path):
        raise HTTPException(status_code=404, detail=f"Category file '{request.category}' not found")

    try:
        # Read the existing words from the file
        with open(category_file_path, "r") as file:
            existing_words = file.read().splitlines()

        # Filter out the words to delete
        updated_words = [word for word in existing_words if word not in request.words]

        # Write the updated words back to the file atomically
        temp_file_path = f"{category_file_path}.tmp"
        with open(temp_file_path, "w") as temp_file:
            temp_file.write("\n".join(updated_words) + "\n")
        os.replace(temp_file_path, category_file_path)

        # Delete associated files (images, audio, etc.)
        for word in request.words:
            # Delete image
            image_path = os.path.join(IMAGES_PATH, f"{word}.png")
            if os.path.exists(image_path):
                os.remove(image_path)

            # Delete PSE audio
            audio_path = os.path.join(PSE_AUDIO_DIRECTORY, f"{word}.mp3")
            if os.path.exists(audio_path):
                os.remove(audio_path)

            # Delete TTS audio
            tts_audio_path = os.path.join(TTS_DIRECTORY, f"{word}.mp3")
            if os.path.exists(tts_audio_path):
                os.remove(tts_audio_path)

        return {"message": "Words and associated files deleted successfully"}
    except Exception as e:
        # Log the error for debugging purposes
        print(f"Error deleting words: {e}")
        raise HTTPException(status_code=500, detail=f"Error deleting words: {str(e)}") 

@router.get("/pseimage/{filename}")
def get_image(filename: str):
    file_path = os.path.join(IMAGES_PATH, filename)
    if os.path.exists(file_path):
        return FileResponse(file_path, headers={"Cache-Control": "no-store, no-cache, must-revalidate, max-age=0"})
    else:
        raise HTTPException(status_code=404, detail="File not found")


@router.post("/pseaudio/")
async def get_pse_audio(word: str = Query(...)):
    file_path = os.path.join(PSE_AUDIO_DIRECTORY, f"{word}.mp3")
    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="Audio file not found")
    return FileResponse(file_path, media_type='audio/mpeg', filename=f"{word}.mp3")


@router.post("/generateTTS/")
async def generate_tts(request: TTSRequest):
    word = request.word
    file_path = os.path.join(TTS_DIRECTORY, f"{word}.mp3")
    if not os.path.exists(TTS_DIRECTORY):
        os.makedirs(TTS_DIRECTORY)
    if not os.path.exists(file_path):
        try:
            tts = gTTS(text=word, lang='en')
            tts.save(file_path)
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Failed to generate TTS audio: {str(e)}")
    return FileResponse(file_path, media_type='audio/mpeg', filename=f"{word}.mp3")