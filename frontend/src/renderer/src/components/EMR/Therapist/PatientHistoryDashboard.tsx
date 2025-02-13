import React, { useEffect, useState } from 'react'
import PatientHistory from './PatientHistory'
import { FaEdit, FaArrowLeft, FaSave } from 'react-icons/fa'
import profile from '../../../assets/EMR/profile.jpg'
import { handleSaveAsPDF } from './PatientProfilePrint'
const BASE_URL = 'http://127.0.0.1:8000'

interface PatientHistoryDashboardProps {
  patientId: number
  loggedInUser: { id: number; role: string }
  role: string
}

const PatientHistoryDashboard: React.FC<PatientHistoryDashboardProps> = ({
  patientId,
  loggedInUser,
  role
}) => {
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState<any | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const calculateAge = (dob) => {
    if (!dob) return 'N/A'
    const birthDate = new Date(dob)
    const today = new Date()
    let age = today.getFullYear() - birthDate.getFullYear()
    const monthDifference = today.getMonth() - birthDate.getMonth()
    const dayDifference = today.getDate() - birthDate.getDate()

    if (monthDifference < 0 || (monthDifference === 0 && dayDifference < 0)) {
      age--
    }

    return age
  }

  const fetchPatientDetails = async () => {
    try {
      setLoading(true)
      const response = await fetch(`${BASE_URL}/patients/fetch-profile/${patientId}`)
      if (!response.ok) {
        throw new Error('Failed to fetch patient details')
      }
      const data = await response.json()
      setFormData(data)
      setLoading(false)
    } catch (err: any) {
      setError(err.message)
      setLoading(false)
    }
  }

  useEffect(() => {
    if (patientId) {
      fetchPatientDetails()
    }
  }, [patientId])

  const toggleEdit = () => {
    if (isEditing) {
      // Fetch the latest data when exiting edit mode
      fetchPatientDetails()
    }
    setIsEditing(!isEditing)
  }

  const getProfileImageUrl = (filename) => {
    if (!filename) return profile
    const cleanFilename = filename.startsWith('/uploads/')
      ? filename.replace('/uploads/', '')
      : filename
    return `${BASE_URL}/patients/patient-image/${encodeURIComponent(cleanFilename)}`
  }

  return (
    <div className="min-h-screen bg-blue-200 font-sans">
      {/* Header */}
      <div className="w-full shadow-lg">
        <div className="px-6 py-4 flex items-center justify-between">
          {/* Apply Shadow to Text */}
          <h1 className="text-2xl font-semibold text-gray-800">
            {isEditing ? 'Edit Patient History' : 'Patient History'}
          </h1>

          {/* Edit/Back Button */}
          <button
            onClick={toggleEdit}
            className="flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition"
          >
            {isEditing ? (
              <>
                <FaArrowLeft className="mr-2" /> Back
              </>
            ) : (
              <>
                <FaEdit className="mr-2" /> Edit Profile
              </>
            )}
          </button>
        </div>
      </div>


      {loading ? (
        <div className="flex items-center justify-center min-h-[50vh]">
          <p className="text-lg font-semibold text-gray-700">Loading...</p>
        </div>
      ) : error ? (
        <div className="flex items-center justify-center min-h-[50vh]">
          <p className="text-lg font-semibold text-red-600">{error}</p>
        </div>
      ) : formData ? (
        isEditing ? (
          // Edit Mode
          <PatientHistory
            initialData={formData}
            loggedInUser={loggedInUser}
            onSubmit={async (updatedData) => {
              setFormData(updatedData) // Update state with the latest data
              await fetchPatientDetails() // Fetch the latest data from the server
              setIsEditing(false) // Exit edit mode
            }}
            mode="update"
            role={role}
          />
        ) : (
          // View Mode
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 p-8">
            {/* Profile Section */}
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl shadow-2xl p-8 flex flex-col justify-center items-center">
              <img
                src={getProfileImageUrl(formData.profile_image)}
                alt="Profile"
                className="w-32 h-32 rounded-full border-4 border-white shadow-lg object-cover"
              />
              <h2 className="mt-6 text-3xl font-bold text-white">
                {formData.first_name} {formData.last_name}
              </h2>
              <p className="mt-2 text-white text-opacity-90">{formData.residence}</p>
              <div className="mt-6 text-white text-opacity-90 space-y-2 text-sm">
                <p>
                  <span className="font-semibold">Phone:</span> {formData.father_contact}
                </p>
                <p>
                  <span className="font-semibold">Email:</span> {formData.father_email}
                </p>
              </div>
            </div>

            {/* Basic Information */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h3 className="text-xl font-medium text-gray-800 mb-6 border-b pb-2">
                Basic Information
              </h3>
              <div className="space-y-4 text-gray-700 text-sm">
                <div className="flex justify-between">
                  <span className="font-medium">Gender:</span>
                  <span>{formData.sex}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Date of Birth:</span>
                  <span>{new Date(formData.dob).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Age:</span>
                  <span>{calculateAge(formData.dob)} years</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Chronological Age at entry:</span>
                  <span>{formData.chronological_age} years</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Gestational Age at entry:</span>
                  <span>{formData.gestational_age}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Pedigree:</span>
                  <span>{formData.pedigree}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Consanguinity:</span>
                  <span>{formData.consanguinity}</span>
                </div>
              </div>
            </div>

            {/* Parents Information */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h3 className="text-xl font-medium text-gray-800 mb-6 border-b pb-2">
                Parents Information
              </h3>
              <div className="space-y-6">
                {/* Father's Information */}
                <div>
                  <h4 className="text-gray-700 font-semibold mb-3">Father's Information</h4>
                  <div className="space-y-2 text-gray-700 text-sm">
                    <div className="flex justify-between">
                      <span className="font-medium">Name:</span>
                      <span>{formData.father_name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Occupation:</span>
                      <span>{formData.father_occupation}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Contact:</span>
                      <span>{formData.father_contact}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Email:</span>
                      <span>{formData.father_email}</span>
                    </div>
                  </div>
                </div>
                {/* Mother's Information */}
                <div>
                  <h4 className="text-gray-700 font-semibold mb-3">Mother's Information</h4>
                  <div className="space-y-2 text-gray-700 text-sm">
                    <div className="flex justify-between">
                      <span className="font-medium">Name:</span>
                      <span>{formData.mother_name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Occupation:</span>
                      <span>{formData.mother_occupation}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Contact:</span>
                      <span>{formData.mother_contact}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Email:</span>
                      <span>{formData.mother_email}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Antenatal and Birth History */}
            <div className="bg-white rounded-2xl shadow-lg p-8 xl:col-span-3">
              <h3 className="text-xl font-medium text-gray-800 mb-6 border-b pb-2">
                Antenatal and Birth History
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-gray-700 text-sm">
                <div className="space-y-4">
                  <div>
                    <span className="font-medium">Antenatal History:</span>
                    <p className="mt-1">{formData.antenatal_history}</p>
                  </div>
                  <div>
                    <span className="font-medium">Perinatal History:</span>
                    <p className="mt-1">{formData.perinatal_history}</p>
                  </div>
                  <div>
                    <span className="font-medium">Conception Mode:</span>
                    <p className="mt-1">{formData.conception_mode}</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <span className="font-medium">Delivery Mode:</span>
                    <p className="mt-1">{formData.delivery_mode}</p>
                  </div>
                  <div>
                    <span className="font-medium">Term:</span>
                    <p className="mt-1">{formData.term}</p>
                  </div>
                  <div>
                    <span className="font-medium">Cried at Birth:</span>
                    <p className="mt-1">{formData.cried_at_birth}</p>
                  </div>
                  <div>
                    <span className="font-medium">Birth Weight:</span>
                    <p className="mt-1">{formData.birth_weight}</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <span className="font-medium">Postnatal Complications:</span>
                    <p className="mt-1">{formData.postnatal_complications}</p>
                  </div>
                  <div>
                    <span className="font-medium">Breastfed Upto:</span>
                    <p className="mt-1">{formData.breastfed_upto}</p>
                  </div>
                </div>
              </div>
            </div>
            <button
              onClick={() => handleSaveAsPDF(formData, calculateAge, getProfileImageUrl)}
              className="fixed bottom-8 right-8 bg-black text-white rounded-full w-14 h-14 flex items-center justify-center shadow-md transition-transform transform hover:scale-105"
            >
              <FaSave className="text-2xl" />
            </button>
          </div>
        )
      ) : (
        <div className="flex items-center justify-center min-h-[50vh]">
          <p className="text-lg font-semibold text-gray-700">No patient data available</p>
        </div>
      )}
    </div>
  )
}

export default PatientHistoryDashboard
