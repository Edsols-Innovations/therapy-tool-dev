import React, { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import profile from '../../../assets/EMR/profile.jpg'

import { CiSearch } from 'react-icons/ci'

interface Patient {
  id: number
  name: string
  age: number
  sex: string
  therapist_name: string | null
  doctor_name: string | null
  onboarded_date: string
  profile_image?: string | null
}



interface SearchBarProps {
  patients: Patient[]
  onClose: () => void
}

const SearchBar: React.FC<SearchBarProps> = ({ patients, onClose }) => {
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [filteredPatients, setFilteredPatients] = useState<Patient[]>(patients)
  const searchRef = useRef<HTMLDivElement | null>(null)
  const navigate = useNavigate()
  const BASE_URL = 'http://127.0.0.1:8000'

  // Close the search popup when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        onClose()
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [onClose])


  const getProfileImageUrl = (filename) => {
    if (!filename) return profile;  
    const cleanFilename = filename.startsWith("/uploads/") ? filename.replace("/uploads/", "") : filename;
    return `${BASE_URL}/patients/patient-image/${encodeURIComponent(cleanFilename)}`;
  };
  

  // Update filtered patients based on search query
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const query = event.target.value.toLowerCase()
    setSearchQuery(query)

    const results = patients.filter((patient) =>
      patient.name.toLowerCase().includes(query)
    )
    setFilteredPatients(results)
  }

  // Navigate to patient details on selection
  const handlePatientClick = (id: number) => {
    navigate('/patientdetails', { state: { id, mode: 'existing' } })
    onClose() // Close search popup after navigating
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-md flex items-start justify-center pt-32 z-50">
      <div
        ref={searchRef}
        className="bg-white rounded-3xl shadow-2xl w-[90%] max-w-3xl p-6 relative transition-all"
      >
        {/* Search Input */}
        <div className="relative w-full">
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            autoFocus
            placeholder="Search for patients..."
            className="w-full h-14 pl-14 pr-4 rounded-xl border border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500 text-md text-gray-800 shadow-sm"
          />
          <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500">
            <CiSearch className="w-6 h-6" />
          </span>
        </div>
  
        {/* Search Results */}
        {searchQuery && (
          <div className="mt-5 max-h-80 overflow-y-auto">
            {filteredPatients.length > 0 ? (
              filteredPatients.map((patient) => (
                <div
                  key={patient.id}
                  onClick={() => handlePatientClick(patient.id)}
                  className="flex items-center justify-between p-4 bg-gray-50 hover:bg-blue-50 rounded-xl cursor-pointer transition-all shadow-sm"
                >
                  <div className="flex items-center gap-4">
                    <img
                      src={getProfileImageUrl(patient.profile_image)}
                      alt={patient.name}
                      className="w-12 h-12 rounded-full object-cover shadow-md"
                    />
                    <div>
                      <div className="font-semibold text-gray-900 text-lg">{patient.name}</div>
                      <div className="text-sm text-gray-500">
                        {patient.age} years, {patient.sex}
                      </div>
                    </div>
                  </div>
                  <div className="text-sm text-gray-600">
                    <span className="block">Doctor: {patient.doctor_name || 'Assigned to all'}</span>
                    <span className="block">Therapist: {patient.therapist_name || 'Assigned to all'}</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center text-gray-500 mt-6">No patients found.</div>
            )}
          </div>
        )}
      </div>
    </div>
  );  
}

export default SearchBar
