import React from 'react'
import ScreeningPdf from './ScreeningPdf'

interface ScreeningDetailsProps {
  Screening: {
    id: number
    date: string
    age_group: string
    screening_data: Record<string, Record<string, string>>
    doctor_comment: string
  }
  patient: {
    first_name: string
    last_name: string
    age: number
  }
}

const ScreeningDetails: React.FC<ScreeningDetailsProps> = ({ Screening, patient }) => {
  // Format ISO date into readable format
  const formatDate = (isoDate: string) => {
    const dateObj = new Date(isoDate)
    return dateObj.toLocaleString('en-US', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      // hour: '2-digit',
      // minute: '2-digit',
      // hour12: true
    })
  }

  return (
    <div className="print-wrapper">
      <div className="min-h-screen bg-gray-100 print-content">
        <div className="w-full p-8 bg-white shadow-lg ">
          {/* Patient Header */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900">
              {patient.first_name} {patient.last_name} - {patient.age} years old
            </h1>
            <p className="text-lg text-gray-700 mt-2">
              Screening Date: {formatDate(Screening.date)}
            </p>
          </div>

          {/* Screening Results */}
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">Screening Results</h2>
            <table className="w-full border-collapse border border-gray-300 text-left text-lg">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 p-4 text-gray-800">Category</th>
                  <th className="border border-gray-300 p-4 text-gray-800">Question</th>
                  <th className="border border-gray-300 p-4 text-gray-800 text-center">Response</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(Screening.screening_data).map(([category, questions]) =>
                  Object.entries(questions).map(([question, answer], index) => (
                    <tr key={`${category}-${index}`} className="even:bg-gray-50">
                      {index === 0 && (
                        <td
                          rowSpan={Object.keys(questions).length}
                          className="border border-gray-300 p-4 font-semibold text-gray-800 align-top"
                        >
                          {category.charAt(0).toUpperCase() + category.slice(1)}
                        </td>
                      )}
                      <td className="border border-gray-300 p-4 text-gray-700">{question}</td>
                      <td
                        className={`border border-gray-300 p-4 font-medium text-white text-center ${
                          answer.toLowerCase() === 'yes' ? 'bg-green-500' : 'bg-red-500'
                        }`}
                      >
                        {answer.charAt(0).toUpperCase() + answer.slice(1)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Doctor's Comment */}
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Doctor's Comment</h2>
            <div
              className="p-6 prose bg-gray-50 border border-gray-300 rounded-md text-gray-900 overflow-y-auto"
              style={{ height: 'auto', minHeight: '300px' }}
              dangerouslySetInnerHTML={{ __html: Screening.doctor_comment }}
            ></div>
          </div>

          {/* Print Button */}
          <div className="flex justify-center">
            <ScreeningPdf patient={patient} screening={Screening} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default ScreeningDetails
