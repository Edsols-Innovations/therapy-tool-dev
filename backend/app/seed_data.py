from models import execute_query

def seed_data():
    # Add more seed data as needed
    execute_query("INSERT OR IGNORE INTO administrators (username, password) VALUES (?, ?)", ("admin", "adminpass"))
    execute_query("INSERT OR IGNORE INTO therapists (username, password, specialization) VALUES (?, ?, ?)", ("therapist1", "therapistpass", "Speech Therapy"))
    execute_query("INSERT OR IGNORE INTO doctors (username, password, specialization) VALUES (?, ?, ?)", ("doctor1", "doctorpass", "Pediatrics"))

    print("Seed data added.")

if __name__ == "__main__":
    seed_data()
