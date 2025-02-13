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
  const handlePatientClick = (patient: Patient) => {
    const userState = JSON.parse(localStorage.getItem('userState') || '{}');
    const role = userState?.role || 'Therapist'; // Fallback to "Therapist" if role is missing
  
    localStorage.setItem(
      'patientState',
      JSON.stringify({
        mode: 'existing',
        id: patient.id,
        role: role,
        name: patient.name,
        age: patient.age
      })
    );
  
    navigate('/patientdetails', { state: { id: patient.id, mode: 'existing', role: role } });
    onClose(); // Close search popup after navigating
    
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-md flex items-start justify-center pt-32 z-50">
      <div
        ref={searchRef}
        className="bg-white rounded-3xl shadow-lg w-[90%] max-w-3xl p-6 relative"
      >
        {/* Search Input */}
        <div className="relative w-full">
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            autoFocus
            placeholder="Search for patients..."
            className="w-full h-12 pl-14 pr-4 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 text-sm text-gray-700 shadow-sm"
          />
          <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500">
            <CiSearch className="w-5 h-5" />
          </span>
        </div>

        {/* Search Results */}
        {searchQuery && (
          <div className="mt-4 max-h-80 overflow-y-auto">
            {filteredPatients.length > 0 ? (
              filteredPatients.map((patient) => (
                <div
                  key={patient.id}
                  onClick={() => handlePatientClick(patient)}
                  className="flex items-center justify-between p-3 hover:bg-gray-100 rounded-lg cursor-pointer transition"
                >
                  <div className="flex items-center gap-4">
                    <img
                      src={getProfileImageUrl(patient.profile_image)}
                      alt={patient.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div>
                      <div className="font-semibold">{patient.name}</div>
                      <div className="text-sm text-gray-500">
                        {patient.age} years, {patient.sex}
                      </div>
                    </div>
                  </div>
                  <div className="text-sm text-gray-600">
                    Therapist: {patient.therapist_name || 'Assigned to all'}
                    <br />
                    Doctor: {patient.doctor_name || 'Assigned to all'}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center text-gray-500 mt-4">No patients found.</div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default SearchBar
