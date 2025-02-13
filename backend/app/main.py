from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from db import init_db
from routes import (
    auth,
    admin,
    doctor,
    therapist,
    patients,
    screenings,
    investigations,
    assessment,
    images,
    therapyware,
    language,
)
import logging
import sys
import os
import multiprocessing
import uvicorn

# Set multiprocessing start method to "spawn" for Windows
if os.name == "nt":
    multiprocessing.set_start_method("spawn", force=True)

app = FastAPI()

# Allow CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Replace with your frontend's origin
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Add CSP headers to allow `localhost` in responses
@app.middleware("http")
async def add_csp_header(request: Request, call_next):
    response = await call_next(request)
    response.headers["Content-Security-Policy"] = (
        "default-src *; img-src 'self' data: blob:; connect-src *; script-src * 'unsafe-inline';"
    )
    return response

# Include routers
routers = [
    (auth.router, "/auth", ["Authentication"]),
    (admin.router, "/admin", ["Administrator"]),
    (doctor.router, "/api", ["Doctors"]),
    (therapist.router, "/api", ["Therapists"]),
    (patients.router, "/patients", ["Patients"]),
    (images.router, "/images", ["Image Change"]),
    (screenings.router, "/screenings", ["Screenings"]),
    (investigations.router, "/investigations", ["Investigation"]),
    (assessment.router, "/assessments", ["Assessment"]),
    (therapyware.router, "/therapyware", ["Therapyware"]),
    (language.router, "/language", ["Language"]),
]

for router, prefix, tags in routers:
    app.include_router(router, prefix=prefix, tags=tags)

# Mount uploads directory
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

# Initialize the database
@app.on_event("startup")
def startup():
    init_db()

# Safe Logging Configuration
LOGGING_CONFIG = {
    "version": 1,
    "disable_existing_loggers": False,
    "formatters": {
        "standard": {
            "format": "%(asctime)s - %(name)s - %(levelname)s - %(message)s",
        },
    },
    "handlers": {
        "console": {
            "class": "logging.StreamHandler",
            "stream": sys.stdout,
            "formatter": "standard",
        },
    },
    "loggers": {
        "uvicorn": {
            "handlers": ["console"],
            "level": "INFO",
            "propagate": False,
        },
        "uvicorn.error": {
            "handlers": ["console"],
            "level": "INFO",
            "propagate": False,
        },
        "uvicorn.access": {
            "handlers": ["console"],
            "level": "INFO",
            "propagate": False,
        },
    },
    "root": {"level": "INFO", "handlers": ["console"]},
}

# Entry point for running the application
if __name__ == "__main__":
    # Log the process ID for debugging
    print(f"Starting FastAPI application with process ID: {os.getpid()}")

    uvicorn.run(
        app,
        host="0.0.0.0",
        port=8000,
        log_config=LOGGING_CONFIG,  # Apply custom logging
        workers=1,  # Ensure only one worker is used to prevent extra processes
    )
