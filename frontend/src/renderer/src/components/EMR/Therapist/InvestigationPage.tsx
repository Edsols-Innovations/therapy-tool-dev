import React, { useState, useEffect } from 'react'
import { FaPlus, FaArrowLeft } from 'react-icons/fa'
import 'react-datepicker/dist/react-datepicker.css'
import { DateRangePicker } from 'react-date-range'
import 'react-date-range/dist/styles.css'
import 'react-date-range/dist/theme/default.css'
import InvestigationDetails from './InvestigationDetails'
import Investigation from './Investigation'

interface InvestigationItem {
  id: number
  patient_id: number
  date: string
  document_name: string
  document_path: string
}

const BASE_URL = 'http://127.0.0.1:8000'

const InvestigationPage: React.FC = () => {
  const [investigations, setInvestigations] = useState<InvestigationItem[]>([])
  const [selectedInvestigation, setSelectedInvestigation] = useState<InvestigationItem | null>(null)
  const [filteredInvestigations, setFilteredInvestigations] = useState<InvestigationItem[]>([])
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [isAdvanced, setIsAdvanced] = useState<boolean>(false)
  const [dateRange, setDateRange] = useState<any>({
    selection: {
      startDate: null,
      endDate: null,
      key: 'selection'
    }
  })
  const [showNewInvestigation, setShowNewInvestigation] = useState<boolean>(false)
  const [patientDetails, setPatientDetails] = useState<{
    first_name: string
    last_name: string
    dob: string
  } | null>(null);

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
  

    const fetchInvestigations = async () => {
      const patientState = localStorage.getItem('patientState');
      if (patientState) {
        const { id: patientId } = JSON.parse(patientState); // Extract patientId
        try {
          // Fetch patient profile
          const patientResponse = await fetch(`${BASE_URL}/patients/fetch-profile/${patientId}`);
          if (!patientResponse.ok) throw new Error('Failed to fetch patient profile');
          const patientData = await patientResponse.json();
  
          const { first_name, last_name, dob } = patientData;
  
          // Store patient details
          setPatientDetails({
            first_name,
            last_name,
            dob,
          });
  
          // Fetch investigations
          const investigationsResponse = await fetch(`${BASE_URL}/investigations/${patientId}`);
          if (!investigationsResponse.ok) throw new Error('Failed to fetch investigations');
          const investigationsData: InvestigationItem[] = await investigationsResponse.json();
  
          setInvestigations(investigationsData);
          setFilteredInvestigations(investigationsData);
        } catch (error) {
          console.error('Error fetching investigations:', error);
        }
      }
    };
  
    useEffect(() => {
      fetchInvestigations();
    }, []); 

  
  useEffect(() => {
    // Filter investigations based on selected date or date range
    if (isAdvanced) {
      const { startDate, endDate } = dateRange.selection
      if (startDate && endDate) {
        const filtered = investigations.filter(
          (investigation) =>
            new Date(investigation.date) >= startDate && new Date(investigation.date) <= endDate
        )
        setFilteredInvestigations(filtered)
      } else {
        setFilteredInvestigations(investigations)
      }
    } else {
      if (selectedDate) {
        const filtered = investigations.filter(
          (investigation) =>
            new Date(investigation.date).toDateString() === selectedDate.toDateString()
        )
        setFilteredInvestigations(filtered)
      } else {
        setFilteredInvestigations(investigations)
      }
    }
  }, [selectedDate, dateRange, investigations, isAdvanced])

  const handleNewInvestigation = () => {
    // Show the Investigation component
    setShowNewInvestigation(true)
    setSelectedInvestigation(null)
  }

  const handleBack = () => {
    // Hide the Investigation component and reset selections
    setShowNewInvestigation(false)
    fetchInvestigations()
    setSelectedInvestigation(null)
  }

  const handleInvestigationClick = (investigation: InvestigationItem) => {
    // Show investigation details
    setSelectedInvestigation(investigation)
    setShowNewInvestigation(false)
  }

  return (
    <div className="min-h-screen bg-blue-200 flex flex-col">
      {showNewInvestigation ? (
        // Render the Investigation component
        <div className="flex-1">
          <div className="bg-blue-200 shadow-lg">
            <div className="mx-auto px-6 py-4 flex items-center justify-between">
              <h1 className="text-2xl font-semibold text-gray-800">New Investigation</h1>
              <button
                onClick={handleBack}
                className="flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition"
              >
                <FaArrowLeft className="mr-2" /> Back
              </button>
            </div>
          </div>
          <div>
            <Investigation onUploadSuccess={fetchInvestigations}  />
          </div>
        </div>
      ) : selectedInvestigation ? (
        // Render investigation details
        <div className="flex-1">
          <div className="bg-blue-200 shadow-lg">
            <div className="mx-auto px-6 py-4 flex items-center justify-between">
              <h1 className="text-2xl font-semibold text-gray-800">Investigation Details</h1>
              <button
                onClick={handleBack}
                className="flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition"
              >
                <FaArrowLeft className="mr-2" /> Back
              </button>
            </div>
          </div>
          <div className="p-8">
            <InvestigationDetails
              patientId={selectedInvestigation.patient_id}
              patientName={`${patientDetails?.first_name} ${patientDetails?.last_name}`}
              age={calculateAge(patientDetails?.dob || '', selectedInvestigation.date)}            
              screeningDate={new Date(selectedInvestigation.date).toLocaleDateString()}
            />
          </div>
        </div>
      ) : (
        // Existing content
        <>
          {/* Header */}
          <div className="w-full bg-blue-200 shadow-lg">
            <div className="px-6 py-4 flex items-center justify-between">
              <h1 className="text-2xl font-semibold text-gray-800">Investigation</h1>
              <button
                onClick={handleNewInvestigation}
                className="flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition"
              >
                <FaPlus className="mr-2" /> New Investigation
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 px-8 py-6">
            {/* Date Filter */}
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

                {/* Simple Date Picker */}
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
                  // Advanced Date Range Picker
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

            {/* Investigations List */}
            {filteredInvestigations.length > 0 ? (
              <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-x-auto">
                {/* Table Header */}
                <div className="grid grid-cols-2 gap-4 bg-gray-100 border-b border-gray-300 p-4 font-semibold text-gray-700">
                  <span>Title</span>
                  <span>Date</span>
                </div>
                {/* Table Rows */}
                <div className="divide-y divide-gray-200">
                  {filteredInvestigations
                    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                    .map((investigation) => (
                      <div
                        key={investigation.id}
                        onClick={() => handleInvestigationClick(investigation)}
                        className="grid grid-cols-2 gap-4 p-4 hover:bg-gray-100 cursor-pointer transition"
                      >
                        <span className="text-gray-800 font-medium">
                          {investigation.document_name}
                        </span>
                        <span className="text-gray-600">
                          {new Intl.DateTimeFormat('en-GB', {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric'
                          }).format(new Date(investigation.date))}
                        </span>
                      </div>
                    ))}
                </div>
              </div>
            ) : (
              <p className="text-gray-600">No investigations found.</p>
            )}
          </div>
        </>
      )}
    </div>
  )
}

export default InvestigationPage
