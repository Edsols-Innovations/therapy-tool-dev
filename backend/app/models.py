from pydantic import BaseModel, EmailStr
from typing import Optional, List, Dict
from datetime import datetime, date

class AdminLogin(BaseModel):
    username: str
    password: str

class HospitalSettingsUpdate(BaseModel):
    name: str
    address: str
    contact: str

class PasswordUpdate(BaseModel):
    current_password: str
    new_password: str
    confirm_password: str


# Therapist Login Model
class TherapistLogin(BaseModel):
    username: str
    password: str


# Doctor Login Model
class DoctorLogin(BaseModel):
    username: str
    password: str


# Doctor Models
class DoctorBase(BaseModel):
    doctor_name: str
    specialization: str
    username: str
    password: str  # Add password field
    image_url: Optional[str] = None  # Add optional image field

class DoctorCreate(DoctorBase):
    pass

class DoctorOut(BaseModel):  # Exclude password from output
    id: int
    doctor_name: str
    specialization: str
    username: Optional[str] = None
    image_url: Optional[str] = None  # Include image field in output

    class Config:
        orm_mode = True



# Doctor Models
class TherapistBase(BaseModel):
    therapist_name: str
    specialization: str
    username: str
    password: str  # Add password field
    image_url: Optional[str] = None  # Add optional image field

class TherapistCreate(TherapistBase):
    pass

class TherapistOut(BaseModel):
    id: int
    therapist_name: str
    specialization: str
    username: Optional[str] = None  
    image_url: Optional[str] = None  # Include image field in output

    class Config:
        orm_mode = True


class PatientBase(BaseModel):
    name: str
    age: int
    sex: str
    therapist_id: int
    onboarded_date: date


class PatientOut(PatientBase):
    id: int

    class Config:
        orm_mode = True


# Patient Profile Schema
class PatientProfileBase(BaseModel):
    profile_image: Optional[str] = None  
    onboarded_date: str
    first_name: str
    last_name: str
    sex: Optional[str] = None
    dob: str
    chronological_age: Optional[str] = None
    gestational_age: Optional[str] = None
    father_name: str 
    father_occupation: Optional[str] = None
    father_contact: Optional[str] = None
    father_email: Optional[EmailStr] = None
    mother_name: str 
    mother_occupation: Optional[str] = None
    mother_contact: Optional[str] = None
    mother_email: Optional[EmailStr] = None
    residence: Optional[str] = None
    therapist_id: Optional[int] = None
    doctor_id: Optional[int] = None

    # Optional fields
    pedigree: Optional[str] = None
    consanguinity: Optional[str] = None
    antenatal_history: Optional[str] = None
    perinatal_history: Optional[str] = None
    conception_mode: Optional[str] = None
    delivery_mode: Optional[str] = None
    term: Optional[str] = None
    cried_at_birth: Optional[str] = None
    birth_weight: Optional[float] = None
    postnatal_complications: Optional[str] = None
    breastfed_upto: Optional[str] = None


class PatientProfileCreate(PatientProfileBase):
    pass


class PatientProfileOut(PatientProfileBase):
    id: int
    onboarded_date: datetime

    class Config:
        orm_mode = True


# Screening Schema
class ScreeningCreate(BaseModel):
    patient_id: int
    age_group: str
    screening_data: Dict[str, Dict[str, str]]
    doctor_comment: Optional[str] = None
    therapist_id: Optional[int] = None
    doctor_id: Optional[int] = None

class ScreeningOut(BaseModel):
    id: int
    patient_id: int
    date: datetime
    age_group: str
    screening_data: Dict[str, Dict[str, str]]
    doctor_comment: Optional[str] = None

    class Config:
        orm_mode = True


class LanguageCreate(BaseModel):
    patient_id: int
    age: Optional[str] = "unknown"  # Default to "unknown" if not provided
    language_data: Dict[str, Dict[str, str]]
    development_age: str
    doctor_id: Optional[int] = None
    therapist_id: Optional[int] = None


class LanguageOut(BaseModel):
    id: int
    patient_id: int
    date: str
    age: str
    language_data: Dict[str, Dict[str, str]]
    development_age: str
    first_name: Optional[str] = None  # Make optional
    last_name: Optional[str] = None   # Make optional
    dob: Optional[str] = None         # Make optional


class InvestigationBase(BaseModel):
    patient_id: int
    date: datetime
    document_name: str
    document_path: str


class InvestigationCreate(InvestigationBase):
    pass


class InvestigationOut(InvestigationBase):
    id: int

    class Config:
        orm_mode = True


# Assessment Schema
class AssessmentCreate(BaseModel):
    patient_id: int
    content: str
    doctor_id: Optional[int] = None
    therapist_id: Optional[int] = None

class AssessmentOut(BaseModel):
    id: int
    patient_id: int
    date: datetime
    content: str
    doctor_id: Optional[int] = None
    therapist_id: Optional[int] = None
    taken_by: Optional[str] = None  # Name of doctor or therapist
    role: Optional[str] = None  # Role ("Doctor" or "Therapist")



    class Config:
        orm_mode = True




# Therapyware Schema
class TherapywareCreate(BaseModel):
    patient_id: int
    visual_games: bool
    module1_submodule1: bool
    module1_submodule2: bool
    module1_submodule3: bool
    module1_submodule4: bool
    module2_submodule1: bool
    module2_submodule2: bool
    listening_studio: bool
    reading_lab: bool
    pictorial_sound_exercise: bool
    animated_flash_concepts: bool



class TherapywareOut(BaseModel):
    patient_id: int
    visual_games: bool
    module1_submodule1: bool
    module1_submodule2: bool
    module1_submodule3: bool
    module1_submodule4: bool
    module2_submodule1: bool
    module2_submodule2: bool
    listening_studio: bool
    reading_lab: bool
    pictorial_sound_exercise: bool
    animated_flash_concepts: bool

    class Config:
        orm_mode = True
        
class DeleteWordsRequest(BaseModel):
    category: str
    words: list[str]
    
class DeleteRequest(BaseModel):
    selected_text: str

class TTSRequest(BaseModel):
    word: str