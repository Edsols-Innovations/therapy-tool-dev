import sqlite3

DB_PATH = "emr.db"

def get_db_connection():
    return sqlite3.connect(DB_PATH)


def init_db():
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()

    # cursor.execute("DROP TABLE IF EXISTS administrators")
    # cursor.execute("DROP TABLE IF EXISTS therapists")
    # cursor.execute("DROP TABLE IF EXISTS patients")
    # cursor.execute("DELETE FROM administrators")
    # cursor.execute("DELETE FROM screenings")
    # cursor.execute("DELETE FROM assessments")

    # Create Administrator table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS administrators (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        hospital_name TEXT,
        hospital_address TEXT,
        contact_number TEXT,
        email TEXT,
        logo_path TEXT
    )
    """)


    cursor.execute("""
    INSERT OR IGNORE INTO administrators (username, password)
    VALUES ('admin', 'adminpass')  -- Replace 'adminpass' with a secure hashed password in production
    """)

    # Create Therapists table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS therapists (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        therapist_name TEXT NOT NULL,
        specialization TEXT NOT NULL,
        username TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        image_url TEXT 
    )
    """)

     # Create Doctors Table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS doctors (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        doctor_name TEXT NOT NULL,
        specialization TEXT NOT NULL,
        username TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        image_url TEXT 
    )
    """)

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS patients (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        first_name TEXT NOT NULL,
        last_name TEXT NOT NULL,
        sex TEXT ,
        dob TEXT NOT NULL,
        chronological_age INTEGER ,
        gestational_age INTEGER ,
        father_name TEXT NOT NULL,
        father_occupation TEXT ,
        father_contact TEXT ,
        father_email TEXT ,
        mother_name TEXT NOT NULL,
        mother_occupation TEXT ,
        mother_contact TEXT ,
        mother_email TEXT ,
        residence TEXT ,
        pedigree TEXT,
        consanguinity TEXT,
        antenatal_history TEXT,
        perinatal_history TEXT,
        conception_mode TEXT,
        delivery_mode TEXT,
        term TEXT,
        cried_at_birth TEXT,
        birth_weight REAL,
        postnatal_complications TEXT,
        breastfed_upto TEXT,
        therapist_id INTEGER,
        doctor_id INTEGER,
        profile_image TEXT,
        onboarded_date TEXT NOT NULL,   
        FOREIGN KEY (therapist_id) REFERENCES therapists (id),
        FOREIGN KEY (doctor_id) REFERENCES doctors (id)
    )
    """)


 
    # cursor.execute("DROP TABLE IF EXISTS screenings_new")

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS screenings (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        patient_id INTEGER NOT NULL,
        date TEXT NOT NULL,
        age_group TEXT NOT NULL,
        screening_data TEXT NOT NULL,
        doctor_comment TEXT,
        doctor_id INTEGER,
        therapist_id INTEGER,
        FOREIGN KEY (patient_id) REFERENCES patients (id),
        FOREIGN KEY (doctor_id) REFERENCES doctors (id),
        FOREIGN KEY (therapist_id) REFERENCES therapists (id)
    )
    """)

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS language (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        patient_id INTEGER NOT NULL,
        date TEXT NOT NULL,
        age TEXT NOT NULL,
        language_data TEXT NOT NULL,
        development_age TEXT NOT NULL,
        doctor_id INTEGER,
        therapist_id INTEGER,
        FOREIGN KEY (patient_id) REFERENCES patients (id),
        FOREIGN KEY (doctor_id) REFERENCES doctors (id),
        FOREIGN KEY (therapist_id) REFERENCES therapists (id)
    )
    """)



    cursor.execute("""
    CREATE TABLE IF NOT EXISTS investigations (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        patient_id INTEGER NOT NULL,
        date TEXT NOT NULL,
        document_name TEXT NOT NULL,
        document_path TEXT NOT NULL,
        FOREIGN KEY (patient_id) REFERENCES patients (id)
    )
    """)

    cursor.execute("""
        CREATE TABLE IF NOT EXISTS assessments (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            patient_id INTEGER NOT NULL,
            date TEXT NOT NULL,
            content TEXT NOT NULL,
            doctor_id INTEGER,
            therapist_id INTEGER,
            FOREIGN KEY (patient_id) REFERENCES patients (id),
            FOREIGN KEY (doctor_id) REFERENCES doctors (id),
            FOREIGN KEY (therapist_id) REFERENCES therapists (id)
        )
    """)

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS therapyware (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        patient_id INTEGER NOT NULL,
        visual_games BOOLEAN NOT NULL,
        module1_submodule1 BOOLEAN NOT NULL,
        module1_submodule2 BOOLEAN NOT NULL,
        module1_submodule3 BOOLEAN NOT NULL,
        module1_submodule4 BOOLEAN NOT NULL,
        module2_submodule1 BOOLEAN NOT NULL,
        module2_submodule2 BOOLEAN NOT NULL,
        listening_studio BOOLEAN NOT NULL,
        reading_lab BOOLEAN NOT NULL,
        pictorial_sound_exercise BOOLEAN NOT NULL,
        animated_flash_concepts BOOLEAN NOT NULL,
        FOREIGN KEY (patient_id) REFERENCES patients (id)
    )
    """)

    conn.commit()
    conn.close()
    print("Database initialized successfully.")
