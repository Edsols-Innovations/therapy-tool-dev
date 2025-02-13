import React, { useState, useEffect } from 'react';
import { FaPlus, FaArrowLeft } from 'react-icons/fa';
import { DateRangePicker } from 'react-date-range';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import AssessmentDetails from './AssessmentDetails';
import Assessment from './Assessment';

interface AssessmentData {
  id: number;
  date: string;
  content: string; // HTML content
  taken_by: string; // Name of doctor/therapist
  role: string; // Role (Doctor or Therapist)
}

const BASE_URL = 'http://127.0.0.1:8000';

const AssessmentPage: React.FC = () => {
  const [assessments, setAssessments] = useState<AssessmentData[]>([]);
  const [filteredAssessments, setFilteredAssessments] = useState<AssessmentData[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isAdvanced, setIsAdvanced] = useState(false);
  const [dateRange, setDateRange] = useState<any>({
    selection: {
      startDate: null,
      endDate: null,
      key: 'selection',
    },
  });
  const [selectedAssessment, setSelectedAssessment] = useState<AssessmentData | null>(null);
  const [showNewAssessment, setShowNewAssessment] = useState(false);
  const [patientDetails, setPatientDetails] = useState<{
    first_name: string;
    last_name: string;
  } | null>(null);

  const fetchAssessments = async () => {
    const patientState = localStorage.getItem('patientState');
    if (patientState) {
      const { id: patientId } = JSON.parse(patientState);
      try {
        // Fetch patient profile
        const patientResponse = await fetch(`${BASE_URL}/patients/fetch-profile/${patientId}`);
        if (!patientResponse.ok) throw new Error('Failed to fetch patient profile');
        const patientData = await patientResponse.json();

        // Fetch assessments
        const assessmentsResponse = await fetch(`${BASE_URL}/assessments/${patientId}`);
        if (!assessmentsResponse.ok) throw new Error('Failed to fetch assessments');
        const assessmentsData = await assessmentsResponse.json();
        console.log(assessmentsData)

        setPatientDetails({
          first_name: patientData.first_name,
          last_name: patientData.last_name,
        });
        setAssessments(assessmentsData);
        setFilteredAssessments(assessmentsData);
      } catch (error) {
        console.error('Error fetching assessments:', error);
      }
    }
  };

  useEffect(() => {
    fetchAssessments();
  }, []);

  const handleBack = async () => {
    setSelectedAssessment(null);
    setShowNewAssessment(false);
    await fetchAssessments();
  };


  useEffect(() => {
    if (isAdvanced) {
      const { startDate, endDate } = dateRange.selection;
      if (startDate && endDate) {
        const filtered = assessments.filter(
          (assessment) =>
            new Date(assessment.date) >= new Date(startDate) &&
            new Date(assessment.date) <= new Date(endDate)
        );
        setFilteredAssessments(filtered);
      } else {
        setFilteredAssessments(assessments);
      }
    } else {
      if (selectedDate) {
        const filtered = assessments.filter(
          (assessment) =>
            new Date(assessment.date).toDateString() === selectedDate.toDateString()
        );
        setFilteredAssessments(filtered);
      } else {
        setFilteredAssessments(assessments);
      }
    }
  }, [selectedDate, dateRange, assessments, isAdvanced]);

  
  const handleNewAssessment = () => {
    setShowNewAssessment(true);
    setSelectedAssessment(null);
  };

  const handleAssessmentClick = (assessment: AssessmentData) => {
    setSelectedAssessment(assessment);
  };

  return (
    <div className="min-h-screen bg-blue-200 flex flex-col">
      {showNewAssessment ? (
        <div className="flex-1">
          <div className="bg-blue-200 shadow-lg">
            <div className="mx-auto px-6 py-4 flex items-center justify-between">
              <h1 className="text-2xl font-semibold text-gray-800">New Assessment</h1>
              <button
                onClick={handleBack}
                className="flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition"
              >
                <FaArrowLeft className="mr-2" /> Back
              </button>
            </div>
          </div>
          <div className="pt-2">
            <Assessment />
          </div>
        </div>
      ) : selectedAssessment && patientDetails ? (
        <div className="flex-1">
          <div className="bg-blue-200 shadow-lg">
            <div className="mx-auto px-6 py-4 flex items-center justify-between">
              <h1 className="text-2xl font-semibold text-gray-800">Assessment Details</h1>
              <button
                onClick={handleBack}
                className="flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition"
              >
                <FaArrowLeft className="mr-2" /> Back
              </button>
            </div>
          </div>
          <div className="p-8">
            <AssessmentDetails
              assessment={selectedAssessment}
              patient={{
                first_name: patientDetails.first_name,
                last_name: patientDetails.last_name,
              }}
            />
          </div>
        </div>
      ) : (
        <>
          <div className="w-full bg-blue-200 shadow-lg">
            <div className="px-6 py-4 flex items-center justify-between">
              <h1 className="text-2xl font-semibold text-gray-800">Assessments</h1>
              <button
                onClick={handleNewAssessment}
                className="flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition"
              >
                <FaPlus className="mr-2" /> New Assessment
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
                  <DateRangePicker
                    ranges={[dateRange.selection]}
                    onChange={(item) => setDateRange(item)}
                    moveRangeOnFirstSelection={false}
                    months={2}
                    direction="horizontal"
                    rangeColors={['#2563EB']}
                    className="rounded-lg"
                  />
                )}
              </div>
            </div>

            {filteredAssessments.length > 0 ? (
              <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-x-auto">
                <div className="grid grid-cols-3 gap-4 bg-gray-100 border-b border-gray-300 p-4 font-semibold text-gray-700">
                  <span>Date</span>
                  <span>Taken By</span>
                  <span>Role</span>
                </div>
                <div className="divide-y divide-gray-200">
                  {filteredAssessments.map((assessment) => (
                    <div
                      key={assessment.id}
                      onClick={() => handleAssessmentClick(assessment)}
                      className="grid grid-cols-3 gap-4 p-4 hover:bg-gray-100 cursor-pointer transition"
                    >
                      <span className="text-gray-800 font-medium">
                        {new Intl.DateTimeFormat('en-GB', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric',
                        }).format(new Date(assessment.date))}
                      </span>
                      <span className="text-gray-600">{assessment.taken_by}</span>
                      <span className="text-gray-600">{assessment.role}</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <p className="text-gray-600">No assessments found.</p>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default AssessmentPage;
