import { useEffect, useState } from 'react'
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa'
import { Upload, Trash } from 'lucide-react'

interface PatientHistoryProps {
  initialData?: any
  loggedInUser: { id: number; role: string }
  role: string
  mode: 'add' | 'update'
  onSubmit: (updatedData: any) => void // Add onSubmit prop
}

interface Doctor {
  id: number
  doctor_name: string
}

interface Therapist {
  id: number
  therapist_name: string
}

interface Field {
  name: string
  label: string
  type: 'text' | 'number' | 'date' | 'email' | 'select' | 'radio' | 'textarea'
  placeholder?: string
  options?: string[]
  fullWidth?: boolean
}

const sections = [
  { id: 'profile', label: 'Profile' },
  { id: 'birth-history', label: 'Birth History' }
]

const profileFields: Field[] = [
  { name: 'first_name', label: 'First Name', type: 'text', placeholder: 'Enter first name' },
  { name: 'last_name', label: 'Last Name', type: 'text', placeholder: 'Enter last name' },
  { name: 'sex', label: 'Sex', type: 'select', options: ['Male', 'Female', 'Other'] },
  { name: 'dob', label: 'Date of Birth', type: 'date' },
  {
    name: 'chronological_age',
    label: 'Chronological Age',
    type: 'number',
    placeholder: 'Enter Chronological age'
  },
  {
    name: 'gestational_age',
    label: 'Gestational Age',
    type: 'number',
    placeholder: 'Enter Gestational age'
  },
  { name: 'father_name', label: "Father's Name", type: 'text', placeholder: "Enter father's name" },
  {
    name: 'father_occupation',
    label: "Father's Occupation",
    type: 'text',
    placeholder: "Enter father's occupation"
  },
  {
    name: 'father_contact',
    label: "Father's Contact Number",
    type: 'text',
    placeholder: "Enter father's contact number"
  },
  {
    name: 'father_email',
    label: "Father's Email ID",
    type: 'email',
    placeholder: "Enter father's email ID"
  },
  { name: 'mother_name', label: "Mother's Name", type: 'text', placeholder: "Enter mother's name" },
  {
    name: 'mother_occupation',
    label: "Mother's Occupation",
    type: 'text',
    placeholder: "Enter mother's occupation"
  },
  {
    name: 'mother_contact',
    label: "Mother's Contact Number",
    type: 'text',
    placeholder: "Enter mother's contact number"
  },
  {
    name: 'mother_email',
    label: "Mother's Email ID",
    type: 'email',
    placeholder: "Enter mother's email ID"
  },
  {
    name: 'residence',
    label: 'Residence',
    type: 'textarea',
    placeholder: 'Enter residence',
    fullWidth: true
  }
]

const birthHistoryFields: Field[] = [
  {
    name: 'pedigree',
    label: 'Pedigree (1st/2nd child)',
    type: 'text',
    placeholder: 'Enter pedigree'
  },
  {
    name: 'consanguinity',
    label: 'Consanguinity',
    type: 'text',
    placeholder: 'Enter consanguinity'
  },
  {
    name: 'antenatal_history',
    label: 'Antenatal History',
    type: 'textarea',
    placeholder: 'Enter antenatal history'
  },
  {
    name: 'perinatal_history',
    label: 'Perinatal History',
    type: 'textarea',
    placeholder: 'Enter perinatal history'
  },
  {
    name: 'conception_mode',
    label: 'Mode of Conception',
    type: 'radio',
    options: ['Natural', 'Assisted']
  },
  {
    name: 'delivery_mode',
    label: 'Mode of Delivery',
    type: 'radio',
    options: ['NVD', 'Assisted', 'LSCS']
  },
  { name: 'term', label: 'Delivered Term or Preterm', type: 'radio', options: ['Term', 'Preterm'] },
  { name: 'cried_at_birth', label: 'Cried at Birth', type: 'radio', options: ['Yes', 'No'] },
  {
    name: 'birth_weight',
    label: 'Birth Weight',
    type: 'number',
    placeholder: 'Enter birth weight'
  },
  {
    name: 'postnatal_complications',
    label: 'Postnatal History (Complications)',
    type: 'textarea',
    placeholder: 'Describe postnatal complications'
  },
  {
    name: 'breastfed_upto',
    label: 'Breastfed Upto',
    type: 'text',
    placeholder: 'Enter duration of breastfeeding'
  }
]

const BASE_URL = 'http://127.0.0.1:8000'

const PatientHistory: React.FC<PatientHistoryProps> = ({
  initialData = {},
  loggedInUser,
  role,
  mode,
  onSubmit
}) => {
  const [page, setPage] = useState(0)
  const [formData, setFormData] = useState({
    ...initialData,
    doctor_id: null,
    therapist_id: null,
    profile_image: null as File | null
  })
  const [, setImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [message] = useState<string | null>(null)
  const [therapists, setTherapists] = useState<Therapist[]>([])
  const [doctors, setDoctors] = useState<Doctor[]>([])
  const [selectedTherapist, setSelectedTherapist] = useState('')
  const [selectedDoctor, setSelectedDoctor] = useState('')
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({})
  const [successMessage, setSuccessMessage] = useState<string | null>(null);


  useEffect(() => {
    if (mode === 'update' && initialData) {
      const { onboarded_date, ...filteredData } = initialData // Exclude onboarded_date
      setFormData({
        ...filteredData,
        doctor_id: initialData.doctor_id || null,
        therapist_id: initialData.therapist_id || null
      })
      setSelectedDoctor(initialData.doctor_id ? initialData.doctor_id.toString() : '')
      setSelectedTherapist(initialData.therapist_id ? initialData.therapist_id.toString() : '')
    }
  }, [mode, initialData])

  useEffect(() => {
    const fetchTherapistsAndDoctors = async () => {
      try {
        const [therapistResponse, doctorResponse] = await Promise.all([
          fetch(`${BASE_URL}/patients/fetch_therapists`),
          fetch(`${BASE_URL}/patients/fetch_doctors`)
        ])

        setTherapists(await therapistResponse.json())
        setDoctors(await doctorResponse.json())
      } catch (error) {
        console.error('Error fetching therapists/doctors:', error)
      }
    }

    fetchTherapistsAndDoctors()
  }, [loggedInUser, role])

  const handleDoctorChange = (e) => {
    const selectedId = e.target.value
    setSelectedDoctor(selectedId) // Set for the dropdown UI
    setFormData((prev) => ({
      ...prev,
      doctor_id: selectedId === '' ? null : parseInt(selectedId, 10)
    }))
  }

  const handleTherapistChange = (e) => {
    const selectedId = e.target.value
    setSelectedTherapist(selectedId) // Set for the dropdown UI
    setFormData((prev) => ({
      ...prev,
      therapist_id: selectedId === '' ? null : parseInt(selectedId, 10)
    }))
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0]
      setFormData((prev) => ({ ...prev, profile_image: file }))

      // Create preview URL
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const ImageUploadSection = () => (
    <div className="mb-8">
          <label className="block text-sm font-medium text-gray-700 py-2">Patient Image:</label>
          <div className="relative border-2 border-dashed border-gray-300 rounded-lg p-6 text-center flex flex-col items-center justify-center bg-gray-50 hover:bg-gray-100 transition">
            <Upload className="w-10 h-10 text-gray-400 mb-2" />
            <p className="text-sm text-gray-600">Click or Drag & Drop an image here</p>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
          </div>

          {imagePreview && (
            <div className="flex items-center space-x-4 mt-4 p-3 bg-white shadow-md rounded-lg">
              <img src={imagePreview} alt="Doctor" className="h-24 w-24 object-cover rounded-lg shadow-sm" />
              <button
                onClick={() => {
                  setImage(null)
                  setImagePreview(null)
                }}
                className="flex items-center space-x-2 text-sm text-red-600 hover:text-red-700 transition"
              >
                <Trash className="w-4 h-4" />
                <span>Remove Image</span>
              </button>
            </div>
          )}
        </div>
  )

  const validateFields = () => {
    const errors: Record<string, string> = {}
    const fields = page === 0 ? profileFields : birthHistoryFields
    fields.forEach((field) => {
      if (!formData[field.name] || formData[field.name].toString().trim() === '') {
        errors[field.name] = `${field.label} is required`
      }
    })

    setValidationErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmitAll = async () => {
    if (!validateFields()) {
      return;
    }
  
    const form = new FormData();
  
    // Append valid form data fields
    Object.entries(formData).forEach(([key, value]) => {
      if (key !== 'onboarded_date' && value !== null && value !== undefined) {
        if (key === 'profile_image' && value instanceof File) {
          form.append(key, value);
        } else if (value !== '') {
          form.append(key, value.toString());
        }
      }
    });
  
    console.log('Submitting FormData:', Array.from(form.entries()));
  
    try {
      const url =
        mode === 'add'
          ? `${BASE_URL}/patients/save-patient-history`
          : `${BASE_URL}/patients/update/${initialData.id}`;
      const method = mode === 'add' ? 'POST' : 'PUT';
  
      const response = await fetch(url, {
        method,
        body: form
      });
  
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Error saving patient history');
      }
  
      const savedPatient = await response.json();
      onSubmit({
        id: savedPatient.id,
        first_name: savedPatient.first_name,
        last_name: savedPatient.last_name
      });
  
      // ✅ Reset form fields after successful submission
      setFormData({
        first_name: '',
        last_name: '',
        age: '',
        sex: '',
        profile_image: null // Ensure file input is cleared
      });
  
      setSuccessMessage('Successfully submitted!');
      setTimeout(() => setSuccessMessage(null), 3000);
      
      console.log('Patient history saved successfully!', savedPatient);
    } catch (err) {
      console.error('Error submitting form:', err);
    }
  }; 

  const renderField = (field) => {
    const value = formData[field.name] || ''
    switch (field.type) {
      case 'text':
      case 'number':
      case 'date':
      case 'email':
        return (
          <div>
            <input
              type={field.type}
              value={value}
              placeholder={field.placeholder}
              className="mt-1 w-full border ${validationErrors[field.name] ? 'border-red-500' : 'border-gray-300'} rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
              onChange={(e) => setFormData({ ...formData, [field.name]: e.target.value })}
            />
            {validationErrors[field.name] && (
              <p className="text-red-500 text-sm mt-1">{validationErrors[field.name]}</p>
            )}
          </div>
        )
      case 'select':
        return (
          <select
            value={value}
            className="mt-1 w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
            onChange={(e) => setFormData({ ...formData, [field.name]: e.target.value })}
          >
            <option value="" disabled>
              Select {field.label.toLowerCase()}
            </option>
            {field.options.map((option) => (
              <option value={option} key={option}>
                {option}
              </option>
            ))}
          </select>
        )
      case 'radio':
        return (
          <div className="flex space-x-4 mt-1">
            {field.options.map((option) => (
              <label key={option} className="flex items-center space-x-2">
                <input
                  type="radio"
                  name={field.name}
                  value={option}
                  checked={value === option}
                  onChange={() => setFormData({ ...formData, [field.name]: option })}
                  className="form-radio text-indigo-600"
                />
                <span>{option}</span>
              </label>
            ))}
            {validationErrors[field.name] && (
              <p className="text-red-500 text-sm mt-1">{validationErrors[field.name]}</p>
            )}
          </div>
        )
      case 'textarea':
        return (
          <div>
            <textarea
              value={value}
              placeholder={field.placeholder}
              className="mt-1 w-full border border-gray-300 rounded-md px-4 py-2 h-24 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
              onChange={(e) => setFormData({ ...formData, [field.name]: e.target.value })}
            />
            {validationErrors[field.name] && (
              <p className="text-red-500 text-sm mt-1">{validationErrors[field.name]}</p>
            )}
          </div>
        )
      default:
        return null
    }
  }

  return (
    <div className="relative flex flex-col md:flex-row w-full min-h-screen p-6 bg-blue-200 font-sans">
      {successMessage && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-green-500 text-white py-2 px-4 rounded shadow-lg z-50">
          {successMessage}
        </div>
      )}
      <div className="md:w-1/4 w-full bg-white rounded-xl shadow-md p-6 h-max">
        <div className="space-y-2">
          {sections.map((section, index) => (
            <button
              key={section.id}
              onClick={() => setPage(index)}
              className={`w-full text-left px-4 py-2 rounded-md transition ${
                index === page
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {section.label}
            </button>
          ))}
        </div>
      </div>
      <div className="flex-1 bg-white rounded-xl shadow-md md:ml-8 flex flex-col">
        <div className="flex-1 overflow-y-auto p-6">
          {page === 0 && (
            <div className="flex items-center space-x-4 mb-8">
              <ImageUploadSection />
            </div>
          )}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {page === 0 &&
              profileFields.map((field) => (
                <div
                  key={field.name}
                  className={`${field.fullWidth ? 'col-span-2' : 'col-span-1'}`}
                >
                  <label className="block text-sm font-medium text-gray-700">{field.label}</label>
                  {renderField(field)}
                </div>
              ))}
            {page === 1 &&
              birthHistoryFields.map((field) => (
                <div
                  key={field.name}
                  className={`${field.fullWidth ? 'col-span-2' : 'col-span-1'}`}
                >
                  <label className="block text-sm font-medium text-gray-700">{field.label}</label>
                  {renderField(field)}
                </div>
              ))}
          </div>
          {page === 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">Assign Therapist</label>
                <select
                  value={selectedTherapist}
                  onChange={handleTherapistChange}
                  className="mt-1 w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                >
                  <option value="">All</option>
                  {therapists.map((t) => (
                    <option value={t.id} key={t.id}>
                      {t.therapist_name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Assign Doctor</label>
                <select
                  value={selectedDoctor}
                  onChange={handleDoctorChange}
                  className="mt-1 w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                >
                  <option value="">All</option>
                  {doctors.map((d) => (
                    <option value={d.id} key={d.id}>
                      {d.doctor_name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}
        </div>
        {message && (
          <p className="mt-4 text-center text-sm font-semibold text-red-600">{message}</p>
        )}
        <div className="mt-6 flex justify-between items-center px-6 py-4 border-t">
          <button
            onClick={() => setPage((prevPage) => Math.max(prevPage - 1, 0))}
            disabled={page === 0}
            className="px-6 py-2 bg-gray-300 text-gray-700 font-semibold rounded-md hover:bg-gray-400 transition disabled:opacity-50"
          >
            <FaArrowLeft className="inline mr-2" />
            Previous
          </button>
          {page < sections.length - 1 ? (
            <button
              onClick={() => setPage((prevPage) => Math.min(prevPage + 1, sections.length - 1))}
              className="px-6 py-2 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700 transition"
            >
              Next
              <FaArrowRight className="inline ml-2" />
            </button>
          ) : (
            <button
              onClick={handleSubmitAll}
              className="px-6 py-2 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700 transition"
            >
              {mode === 'add' ? 'Submit All Data' : 'Save Changes'}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default PatientHistory
