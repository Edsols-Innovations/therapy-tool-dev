import React, { useState, useEffect } from 'react'

interface InvestigationDetailsProps {
  patientId: number
  patientName: string
  age: number
  screeningDate: string
}

interface Document {
  id: number
  document_name: string
  document_path: string
}

const BASE_URL = 'http://127.0.0.1:8000'

const InvestigationDetails: React.FC<InvestigationDetailsProps> = ({
  patientId,
  patientName,
  age,
  screeningDate
}) => {
  const [documents, setDocuments] = useState<Document[]>([])
  const [selectedSection, setSelectedSection] = useState<string | null>(null)

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const response = await fetch(`${BASE_URL}/investigations/${patientId}`)
        if (!response.ok) {
          throw new Error('Failed to fetch documents')
        }
        const data: Document[] = await response.json()
        setDocuments(data)
      } catch (error) {
        console.error('Error fetching documents:', error)
      }
    }

    fetchDocuments()
  }, [patientId])

  const handleSectionClick = (section: string) => {
    setSelectedSection(section)
  }

  const constructFilePath = (documentPath: string) =>
    `${BASE_URL}/${documentPath.replace(/\\/g, '/')}`

  return (
    <div className="min-h-[80vh] bg-blue-200 font-sans">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-800 mb-1">
          {patientName} - {age} years old
        </h1>
        <p className="text-gray-600">Uploaded Date: {screeningDate}</p>
      </div>
      <div className="grid grid-cols-4 gap-6">
        <div className="col-span-1 bg-blue-50 rounded-2xl shadow-lg p-4 h-fit">
          <h2 className="text-xl font-medium text-gray-800 mb-4">Documents</h2>
          {documents.map((doc) => (
            <div
              key={doc.id}
              onClick={() => handleSectionClick(doc.document_name)}
              className={`cursor-pointer p-3 rounded-md text-lg font-medium mb-3 ${
                selectedSection === doc.document_name
                  ? 'bg-blue-100 text-blue-600'
                  : 'bg-gray-100 text-gray-800'
              }`}
            >
              {doc.document_name}
            </div>
          ))}
        </div>
        <div className="col-span-3 bg-blue-50 rounded-2xl shadow-lg p-8">
          {selectedSection ? (
            documents.map((doc) =>
              doc.document_name === selectedSection ? (
                doc.document_path.endsWith('.pdf') ? (
                  <div key={doc.id}>
                    <h2 className="text-2xl font-bold mb-4">{doc.document_name}</h2>
                    <iframe
                      src={constructFilePath(doc.document_path)}
                      className="w-full h-[600px] rounded-md"
                      title={doc.document_name}
                    ></iframe>
                  </div>
                ) : (
                  <div key={doc.id}>
                    <h2 className="text-2xl font-bold mb-4">{doc.document_name}</h2>
                    <img
                      src={constructFilePath(doc.document_path)}
                      alt={doc.document_name}
                      className="w-full rounded-md shadow-md"
                    />
                  </div>
                )
              ) : null
            )
          ) : (
            <div className="text-center text-gray-600">
              <h2 className="text-xl font-medium">Select a section to view the details.</h2>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default InvestigationDetails
