import React, { useEffect, useRef, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { HiOutlineChevronDown } from 'react-icons/hi'
import { CiSearch } from 'react-icons/ci'
import { DateRangePicker } from 'react-date-range'
import 'react-date-range/dist/styles.css' // Main CSS file for date range picker
import 'react-date-range/dist/theme/default.css' // Theme CSS file
import edsols from '../../assets/EMR/edsols.png'
import profile from '../../assets/EMR/profile.jpg'
import { LogOut } from 'lucide-react';
import SearchBar from './Therapist/SearchBar'
import { FiPlus } from 'react-icons/fi'
import { GiBrain } from "react-icons/gi"; // Therapy icon


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

const PatientList = () => {
  const [menuOpen, setMenuOpen] = useState(false)
  const [isPopupOpen, setIsPopupOpen] = useState(false)
  const [selectedPicture, setSelectedPicture] = useState(profile)
  const [invalidDateMessage, setInvalidDateMessage] = useState<string | null>(null)
  const [companyLogo, setCompanyLogo] = useState<string | null>(null)

  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [patients, setPatients] = useState<Patient[]>([])
  const [filteredPatients, setFilteredPatients] = useState<Patient[]>([])
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [dateRange, setDateRange] = useState({
    selection: {
      startDate: null as Date | null,
      endDate: null as Date | null,
      key: 'selection'
    }
  })
  const [isAdvanced, setIsAdvanced] = useState(false)
  const dropdownRef = useRef<HTMLDivElement | null>(null)

  const location = useLocation()
  const navigate = useNavigate();
  const userState = JSON.parse(localStorage.getItem('userState') || '{}')
  const roleId = userState?.id || location.state?.id
  const name = userState?.name || location.state?.name
  const role = userState?.role || location.state?.role || 'Therapist'

  const BASE_URL = 'http://127.0.0.1:8000'

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const response = await fetch(
          `${BASE_URL}/patients/fetch-patients?user_id=${roleId}&role=${role}`
        )
        if (!response.ok) {
          throw new Error('Failed to fetch patients')
        }
        const data = await response.json()
        const sortedPatients = data.sort(
          (a: Patient, b: Patient) =>
            new Date(b.onboarded_date).getTime() - new Date(a.onboarded_date).getTime()
        )
        setPatients(sortedPatients)
        setFilteredPatients(sortedPatients) 
      } catch (error) {
        console.error('Error fetching patients:', error)
      }
    }

    if (roleId && role) {
      fetchPatients()
    }
  }, [roleId, role])

  const getPatientProfileImageUrl = (filename) => {
    if (!filename) return profile
    const cleanFilename = filename.startsWith('/uploads/')
      ? filename.replace('/uploads/', '')
      : filename
    return `${BASE_URL}/patients/patient-image/${encodeURIComponent(cleanFilename)}`
  }

  const getProfileImageUrl = (filename, role) => {
    if (!filename) return profile // Fallback to default profile picture
    const cleanFilename = filename.split('/').pop() // Extract only the filename

    // Use the appropriate endpoint based on the role
    const endpoint = role === 'Therapist' ? 'therapist-image' : 'doctor-image'
    return `${BASE_URL}/api/${endpoint}/${encodeURIComponent(cleanFilename)}`
  }

  const toggleMenu = (e: React.MouseEvent) => {
    e.stopPropagation()
    setMenuOpen((prev) => !prev)
  }

  const fetchLogo = async () => {
    try {
      const response = await fetch(`${BASE_URL}/admin/logo`)
      if (!response.ok) throw new Error('Failed to fetch logo')
      const data = await response.json()
      if (data.logo_path) {
        setCompanyLogo(`${BASE_URL}/${data.logo_path}`)
      }
    } catch (error) {
      console.error('Error fetching logo:', error)
    }
  }

  useEffect(() => {
    fetchLogo();
  });

  const handleLogout = () => {
    localStorage.removeItem('userState')
    navigate('/')
  }


  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = new Date(e.target.value)
    setSelectedDate(selected)

    // Filter patients by the selected date
    const filtered = patients.filter((patient) => {
      const patientDate = new Date(patient.onboarded_date).toDateString()
      return patientDate === selected.toDateString()
    })

    setFilteredPatients(filtered)
  }

  useEffect(() => {
    const fetchProfileImage = async () => {
      try {
        const response = await fetch(`${BASE_URL}/images/profile-image/${role}/${roleId}`)
        if (!response.ok) {
          throw new Error('Failed to fetch profile image')
        }
        const data = await response.json()
        console.log(data.profile_image)
        if (data.profile_image) {
          setSelectedPicture(`${data.profile_image}`)
        }
      } catch (error) {
        console.error('Error fetching profile image:', error)
      }
    }

    if (roleId && role) {
      fetchProfileImage()
    }
  }, [roleId, role])

  const handleChangePicture = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return

    const file = e.target.files[0]
    const formData = new FormData()
    formData.append('profile_image', file)

    try {
      const response = await fetch(`${BASE_URL}/images/update-profile-image/${role}/${roleId}`, {
        method: 'PUT',
        body: formData
      })

      if (response.ok) {
        const data = await response.json()
        setSelectedPicture(
          `${role === 'Therapist' ? 'uploads/therapist/' : 'uploads/doctor/'}${data.profile_image}`
        )
      } else {
        console.error('Failed to update profile image')
      }
    } catch (error) {
      console.error('Error updating profile image:', error)
    }
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setMenuOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  
  return (
    <div className="flex flex-col w-screen h-screen bg-blue-200">
      {/* Navbar */}
      <div className="flex justify-between w-full bg-blue-200 shadow-lg min-h-[10%] items-center px-8 py-4">
        {/* Logos */}
        <div className="flex items-center gap-5">
          {companyLogo ? (
            <img src={companyLogo} alt="Company Logo" className="h-10 object-contain" />
          ) : (
            <div className="h-10 w-10 bg-gray-100 rounded-lg flex items-center justify-center">
              <span className="text-gray-400 text-sm">Logo</span>
            </div>
          )}
          <div className="w-[1px] h-10 bg-gray-200"></div>
          <img src={edsols} alt="Edsols Logo" className="h-10 object-contain" />
        </div>

        {/* Search Patients */}
        <div className="flex items-center justify-center w-1/3">
        <button
          onClick={() => setIsSearchOpen(true)}
          className="flex items-center gap-3 px-14 py-3 bg-gray-50 text-gray-700 rounded-xl shadow-md hover:shadow-lg transition-all border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none hover:bg-gray-50"
        >
          <CiSearch className="w-5 h-5 text-blue-500" />
          <span className="text-lg font-semibold">Search Patients</span>
        </button>
      </div>

        {isSearchOpen && <SearchBar patients={patients} onClose={() => setIsSearchOpen(false)} />}

        {/* Profile Section */}
        <div className="relative flex items-center gap-4" ref={dropdownRef}>
          {/* Profile Image */}
          <div className="relative">
            <img
              src={getProfileImageUrl(selectedPicture, role)}
              alt="Profile"
              className="w-10 h-10 rounded-full cursor-pointer object-cover border-2 border-white hover:border-blue-500 transition-all"
              onClick={() => setIsPopupOpen(true)}
            />
          </div>

          {/* Profile Popup */}
          {isPopupOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-xl shadow-2xl p-8 w-[90%] max-w-md relative">
                <button
                  className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 transition text-2xl"
                  onClick={() => setIsPopupOpen(false)}
                >
                  &#x2715;
                </button>
                <div className="flex flex-col items-center justify-center gap-6">
                  <img
                    src={getProfileImageUrl(selectedPicture, role)}
                    alt="Profile Full"
                    className="w-32 h-32 rounded-full object-cover border-4 border-gray-100 shadow-md"
                  />
                  <label
                    htmlFor="upload"
                    className="px-6 py-2.5 bg-gray-50 hover:bg-gray-100 text-gray-700 font-medium rounded-lg cursor-pointer transition-all border border-gray-200"
                  >
                    Change Picture
                    <input
                      type="file"
                      id="upload"
                      className="hidden"
                      onChange={handleChangePicture}
                    />
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* Profile Info */}
          <div className="hidden md:flex flex-col">
            <span className="text-lg font-semibold text-gray-800">{name}</span>
            <span className="text-sm text-gray-500">{role}</span>
          </div>

          {/* Dropdown Toggle */}
          <button
            className="flex items-center p-2 bg-blue-100 hover:bg-blue-300 rounded-lg transition-all border border-gray-200"
            onClick={toggleMenu}
          >
            <HiOutlineChevronDown
              className={`text-xl text-gray-600 transition-transform ${
                menuOpen ? 'rotate-180' : ''
              }`}
            />
          </button>

          {/* Dropdown Menu */}
          {menuOpen && (
            <div
              className="absolute right-0 top-full mt-2 w-56 bg-blue-100 border border-gray-200 rounded-lg shadow-lg p-4 z-50"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="mb-4">
                <label htmlFor="language" className="text-sm text-gray-600 block mb-2">
                  Choose Language
                </label>
                <select
                  id="language"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
                >
                  <option value="en">English</option>
                  <option value="es">Spanish</option>
                  <option value="fr">French</option>
                  <option value="de">German</option>
                  <option value="zh">Chinese</option>
                </select>
              </div>
              <button
                className="flex items-center gap-3 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-all"
                onClick={handleLogout}
              >
                <LogOut/>Logout
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Filter Section */}
      <div className="flex flex-col px-8 mt-6 p-1 space-y-6 min-h-max">
        <h1 className="text-3xl font-bold">Assigned Patients</h1>
        <div className="bg-gray-50 p-4 rounded-lg">
        <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-800">Filter by Date</h2>
            <button
              onClick={() => setIsAdvanced(!isAdvanced)}
              className="text-blue-600 hover:text-blue-700 font-medium transition-colors"
            >
              {isAdvanced ? 'Switch to Simple' : 'Switch to Advanced'}
            </button>
          </div>

          {/* Simple Date Picker */}
          {!isAdvanced ? (
            <div className="flex items-center gap-4">
              <input
                type="date"
                value={selectedDate ? selectedDate.toISOString().split('T')[0] : ''}
                onChange={handleDateChange}
                className="border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={() => {
                  setSelectedDate(null)
                  setFilteredPatients(patients) // Reset to show all patients
                }}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
              >
                Clear Date
              </button>
            </div>
          ) : (
            // Advanced Date Range Picker
            <div>
              <DateRangePicker
                ranges={[dateRange.selection]}
                onChange={(item) => {
                  const { startDate, endDate } = item.selection

                  // Filter the patient dates to validate the selected range
                  const validStartDate = patients.some(
                    (patient) =>
                      new Date(patient.onboarded_date).toISOString().split('T')[0] ===
                      new Date(startDate).toISOString().split('T')[0]
                  )
                  const validEndDate = patients.some(
                    (patient) =>
                      new Date(patient.onboarded_date).toISOString().split('T')[0] ===
                      new Date(endDate).toISOString().split('T')[0]
                  )

                  if (validStartDate && validEndDate) {
                    setDateRange(item)
                    setInvalidDateMessage(null) // Clear the message if the range is valid
                  } else {
                    setInvalidDateMessage('Selected date range does not match any patient records.')
                  }
                }}
                moveRangeOnFirstSelection={false}
                months={2}
                direction="horizontal"
                rangeColors={['#2563EB']}
                className="rounded-lg"
              />

              {/* Message for invalid date range */}
              {invalidDateMessage && (
                <p className="text-sm text-red-500 mt-2">{invalidDateMessage}</p>
              )}

              <div className="flex justify-end mt-4">
                <button
                  onClick={() => {
                    setDateRange({
                      selection: {
                        startDate: null,
                        endDate: null,
                        key: 'selection'
                      }
                    })
                    setInvalidDateMessage(null) // Clear the message when clearing dates
                  }}
                  className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
                >
                  Clear Dates
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-col pb-5 h-[90%] w-full bg-blue-200 overflow-y-auto">
        {Object.keys(
          filteredPatients.reduce((groups, patient) => {
            const date = new Date(patient.onboarded_date).toDateString() // Group by date
            if (!groups[date]) groups[date] = []
            groups[date].push(patient)
            return groups
          }, {})
        )
          .sort((a, b) => new Date(b).getTime() - new Date(a).getTime()) // Sort dates in descending order
          .map((date) => (
            <div key={date} className="mt-6 mx-20">
              <div className="text-gray-500 py-5 text-lg flex items-center">
                {new Date(date).toLocaleDateString('en-GB', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
                <div className="w-[83%] h-[1px] bg-gray-300 ml-4 my-4" />
              </div>
              {filteredPatients
                .filter((patient) => new Date(patient.onboarded_date).toDateString() === date)
                .map((patient) => (
                  <Link
                    key={patient.id}
                    to={`/patientdetails`}
                    state={{ mode: 'existing', id: patient.id, role }}
                    onClick={() => {
                      localStorage.setItem(
                        'patientState',
                        JSON.stringify({ mode: 'existing', id: patient.id, role, name: patient.name, age:patient.age })
                      )
                    }}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border hover:shadow-lg transition-all"
                  >
                    <div className="flex items-center">
                      <img
                        src={getPatientProfileImageUrl(patient.profile_image)}
                        alt={patient.name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      <div className="ml-4">
                        <div className="font-semibold">{patient.name}</div>
                        <div className="text-gray-500">
                          {patient.age} years, {patient.sex}
                        </div>
                      </div>
                    </div>
                    <div className="text-md text-gray-600 font-medium">
                      <div>Therapist: {patient.therapist_name || 'Assigned to All'}</div>
                      <div>Doctor: {patient.doctor_name || 'Assigned to All'}</div>
                    </div>
                  </Link>
                ))}
            </div>
          ))}
      </div>

      {/* Floating Buttons */}
      <div className="fixed bottom-8 right-8 flex flex-col items-end space-y-4">
        {role !== "Administrator" && (
          <>
            {/* Therapy Button */}
            <div className="relative group">
              <Link
                to="/therapy"
                className="bg-gray-900 text-white rounded-full w-14 h-14 flex items-center justify-center shadow-md transition-transform transform hover:scale-105"
                style={{
                  boxShadow: "0px 6px 12px rgba(0, 0, 0, 0.15)",
                }}
              >
                <GiBrain className="text-2xl" />
              </Link>
              {/* Tooltip */}
              <span className="absolute right-16 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 
                              bg-gray-800 text-white text-sm py-1 px-3 rounded-md shadow-lg transition-opacity duration-200
                              whitespace-nowrap min-w-[max-content]">
                Therapyware
              </span>
            </div>

            {/* Add Patient Button */}
            <div className="relative group">
              <Link
                to="/patientdetails"
                state={{ mode: "add", role }}
                className="bg-gray-900 text-white rounded-full w-14 h-14 flex items-center justify-center shadow-md transition-transform transform hover:scale-105"
                style={{
                  boxShadow: "0px 6px 12px rgba(0, 0, 0, 0.15)",
                }}
              >
                <FiPlus className="text-2xl" />
              </Link>
              {/* Tooltip */}
              <span className="absolute right-16 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 
                              bg-gray-800 text-white text-sm py-1 px-3 rounded-md shadow-lg transition-opacity duration-200
                              whitespace-nowrap min-w-[max-content]">
                Add Patient
              </span>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default PatientList
