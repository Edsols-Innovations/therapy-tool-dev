import React, { useState, useEffect } from 'react'
import { FaPlus, FaArrowLeft } from 'react-icons/fa'
import 'react-datepicker/dist/react-datepicker.css'
import { DateRangePicker } from 'react-date-range'
import 'react-date-range/dist/styles.css'
import 'react-date-range/dist/theme/default.css'
import ScreeningForm from './ScreeningForm'
import ScreeningDetails from './ScreeningDetails'

interface ScreeningData {
  id: number
  date: string
  age_group: string
  screening_data: Record<string, any>
  doctor_comment: string
  taken_by: string
  role: string; 
}

const BASE_URL = 'http://127.0.0.1:8000'

const ScreeningPage: React.FC = () => {
  const [screenings, setScreenings] = useState<ScreeningData[]>([])
  const [filteredScreenings, setFilteredScreenings] = useState<ScreeningData[]>([])
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [isAdvanced, setIsAdvanced] = useState<boolean>(false)
  const [patientDetails, setPatientDetails] = useState<{
    first_name: string
    last_name: string
    dob: string
  } | null>(null)

  const [dateRange, setDateRange] = useState<any>({
    selection: {
      startDate: null,
      endDate: null,
      key: 'selection'
    }
  })
  const [showNewScreening, setShowNewScreening] = useState<boolean>(false)
  const [selectedScreening, setSelectedScreening] = useState<ScreeningData | null>(null)

  const calculateAge = (dob: string, screeningDate: string): number => {
    const birthDate = new Date(dob)
    const screeningDay = new Date(screeningDate)
    let age = screeningDay.getFullYear() - birthDate.getFullYear()
    const monthDiff = screeningDay.getMonth() - birthDate.getMonth()
    if (monthDiff < 0 || (monthDiff === 0 && screeningDay.getDate() < birthDate.getDate())) {
      age--
    }
    return age
  }

  const fetchScreenings = async () => {
    const patientState = localStorage.getItem('patientState');
    if (patientState) {
      const { id: patientId } = JSON.parse(patientState);
      try {
        // Fetch patient profile
        const patientResponse = await fetch(`${BASE_URL}/screenings/${patientId}`);
        if (!patientResponse.ok) throw new Error('Failed to fetch patient profile');
        const patientData = await patientResponse.json();
        console.log(patientData)
        const { therapist_id, doctor_id, dob, first_name, last_name } = patientData[0] || {};
  
        // const { therapist_id, doctor_id, dob, first_name, last_name } = patientData;
        console.log(doctor_id, therapist_id)
  
        // Determine "taken_by" and role for each screening
        const takenByRole = async (id: number, type: 'therapist' | 'doctor') => {
          const url = `${BASE_URL}/api/${type}s/${id}`;
          const response = await fetch(url);
          if (!response.ok) return null;
          const data = await response.json();
          return { name: data[`${type}_name`], role: type.charAt(0).toUpperCase() + type.slice(1) };
        };
  
        // Fetch screenings
        const screeningsResponse = await fetch(`${BASE_URL}/screenings/${patientId}`);
        if (!screeningsResponse.ok) throw new Error('Failed to fetch screenings');
        const screeningsData: ScreeningData[] = await screeningsResponse.json();
  
        // Add "taken_by" and role dynamically
        const updatedScreenings = await Promise.all(
          screeningsData.map(async (screening) => {
            let takenBy = '';
            let role = '';
  
            if (therapist_id) {
              const therapist = await takenByRole(therapist_id, 'therapist');
              if (therapist) {
                takenBy = therapist.name;
                role = therapist.role;
                console.log(takenBy);
              }
            }
            else if (doctor_id) {
              const doctor = await takenByRole(doctor_id, 'doctor');
              if (doctor) {
                takenBy = doctor.name; // If both exist, the doctor will override
                role = doctor.role;
                console.log(takenBy);
              }
            }
            return {
              ...screening,
              taken_by: takenBy,
              role,
            };
          })
        );
  
        setScreenings(updatedScreenings);
        setFilteredScreenings(updatedScreenings);
  
        setPatientDetails({
          first_name,
          last_name,
          dob,
        });
      } catch (error) {
        console.error('Error fetching screenings:', error);
      }
    }
  }; 
  
  

  useEffect(() => {
    fetchScreenings()
  }, [])

  useEffect(() => {
    if (isAdvanced) {
      const { startDate, endDate } = dateRange.selection
      if (startDate && endDate) {
        const filtered = screenings.filter(
          (screening) =>
            new Date(screening.date) >= startDate && new Date(screening.date) <= endDate
        )
        setFilteredScreenings(filtered)
      } else {
        setFilteredScreenings(screenings)
      }
    } else {
      if (selectedDate) {
        const filtered = screenings.filter(
          (screening) => new Date(screening.date).toDateString() === selectedDate.toDateString()
        )
        setFilteredScreenings(filtered)
      } else {
        setFilteredScreenings(screenings)
      }
    }
  }, [selectedDate, dateRange, screenings, isAdvanced])

  const handleNewScreening = () => {
    setShowNewScreening(true)
    setSelectedScreening(null)
  }

  const handleBack = async () => {
    setShowNewScreening(false)
    setSelectedScreening(null)
    await fetchScreenings()
  }

  const handleScreeningClick = (screening: ScreeningData) => {
    setSelectedScreening(screening)
    setShowNewScreening(false)
  }

  return (
    <div className="min-h-screen bg-blue-200 flex flex-col">
      {showNewScreening ? (
        <div className="flex-1">
          <div className="bg-blue shadow-lg">
            <div className="mx-auto px-6 py-4 flex items-center justify-between">
              <h1 className="text-2xl font-semibold text-gray-800">New Screening</h1>
              <button
                onClick={handleBack}
                className="flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition"
              >
                <FaArrowLeft className="mr-2" /> Back
              </button>
            </div>
          </div>
          <div>
            <ScreeningForm />
          </div>
        </div>
      ) : selectedScreening && patientDetails ? (
        <div className="flex-1">
          <div className="bg-blue-200 shadow-lg">
            <div className="mx-auto px-6 py-4 flex items-center justify-between">
              <h1 className="text-2xl font-semibold text-gray-800">Screening Details</h1>
              <button
                onClick={handleBack}
                className="flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition"
              >
                <FaArrowLeft className="mr-2" /> Back
              </button>
            </div>
          </div>
          <div className="p-8">
            <ScreeningDetails
              Screening={selectedScreening!}
              patient={{
                first_name: patientDetails.first_name,
                last_name: patientDetails.last_name,
                age: calculateAge(patientDetails.dob, selectedScreening.date),
              }}
            />
          </div>
        </div>
      ) : (
        <>
          <div className="w-full bg-blue-200 shadow-lg">
            <div className="px-6 py-4 flex items-center justify-between">
              <h1 className="text-2xl font-semibold text-gray-800">Screening</h1>
              <button
                onClick={handleNewScreening}
                className="flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition"
              >
                <FaPlus className="mr-2" /> New Screening
              </button>
            </div>
          </div>

          <div className="flex-1 px-8 py-6">
            <div className="flex flex-col pb-3 space-y-6">
              <div className="bg-white p-4 rounded-lg shadow-lg">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold text-gray-800">Filter by Date</h2>
                  <button
                    onClick={() => setIsAdvanced(!isAdvanced)}
                    className="text-blue-600 hover:underline"
                  >
                    {isAdvanced ? 'Simple' : 'Advanced'}
                  </button>
                </div>

                {!isAdvanced ? (
                  <div className="flex items-center gap-4">
                    <input
                      type="date"
                      value={selectedDate ? selectedDate.toISOString().split('T')[0] : ''}
                      onChange={(e) => setSelectedDate(new Date(e.target.value))}
                      className="border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                      onClick={() => setSelectedDate(null)}
                      className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
                    >
                      Clear Date
                    </button>
                  </div>
                ) : (
                  <div>
                    <DateRangePicker
                      ranges={[dateRange.selection]}
                      onChange={(item) => setDateRange(item)}
                      moveRangeOnFirstSelection={false}
                      months={2}
                      direction="horizontal"
                      rangeColors={['#2563EB']}
                      className="rounded-lg"
                    />
                    <div className="flex justify-end mt-4">
                      <button
                        onClick={() =>
                          setDateRange({
                            selection: {
                              startDate: null,
                              endDate: null,
                              key: 'selection'
                            }
                          })
                        }
                        className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
                      >
                        Clear Dates
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {filteredScreenings.length > 0 ? (
              <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-x-auto">
                <div className="grid grid-cols-4 gap-4 bg-gray-100 border-b border-gray-300 p-4 font-semibold text-gray-700">
                  <span>Date</span>
                  <span>Age Group</span>
                  <span>Taken By</span>
                  <span>Role</span>
                </div>
                <div className="divide-y divide-gray-200">
                  {filteredScreenings.map((screening) => (
                    <div
                      key={screening.id}
                      onClick={() => handleScreeningClick(screening)}
                      className="grid grid-cols-4 gap-4 p-4 hover:bg-gray-100 cursor-pointer transition"
                    >
                      <span className="text-gray-800 font-medium">
                        {new Intl.DateTimeFormat('en-GB', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric'
                        }).format(new Date(screening.date))}
                      </span>
                      <span className="text-gray-600">{screening.age_group}</span>
                      <span className="text-gray-600">{screening.taken_by}</span>
                      <span className="text-gray-600">{screening.role}</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <p className="text-gray-600">No screenings found.</p>
            )}
          </div>
        </>
      )}
    </div>
  )
}

export default ScreeningPage
