import React, { useState } from 'react';
import PatientHistoryForm from './PatientHistoryForm';

const PatientHistoryPage: React.FC = () => {
  const [showForm, setShowForm] = useState(false);

  const [patientData, setPatientData] = useState({
    firstName: 'John',
    lastName: 'Doe',
    sex: 'Male',
    dob: '2000-01-01',
    chronologicalAge: 22,
    gestationalAge: 'N/A',
    fatherName: 'Michael Doe',
    fatherOccupation: 'Engineer',
    fatherContact: '+1 123 456 7890',
    fatherEmail: 'michael.doe@example.com',
    motherName: 'Jane Doe',
    motherOccupation: 'Doctor',
    motherContact: '+1 987 654 3210',
    motherEmail: 'jane.doe@example.com',
    residence: '123 Main St, Anytown',
    pedigree: '1st child',
    consanguinity: 'None',
    antenatalHistory: 'Normal',
    perinatalHistory: 'Normal delivery with no complications',
    conceptionMode: 'Natural',
    deliveryMode: 'NVD',
    term: 'Term',
    criedAtBirth: 'Yes',
    birthWeight: '3.5 kg',
    postnatalComplications: 'None',
    breastfedUpto: '1 year',
  });

  const handleSave = (updatedData: any) => {
    setPatientData(updatedData);
    setShowForm(false);
  };

  return (
    <div className="p-6 bg-blue-100 min-h-screen">
      {showForm ? (
        <PatientHistoryForm initialData={patientData} onSave={handleSave} />
      ) : (
        <div className="bg-white rounded shadow p-6">
          <h2 className="text-2xl font-bold">Patient Details</h2>
          <div className="mt-4">
            {Object.entries(patientData).map(([key, value]) => (
              <p key={key}>
                <strong>{key.replace(/([A-Z])/g, ' $1')}:</strong> {value}
              </p>
            ))}
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
          >
            Edit
          </button>
        </div>
      )}
    </div>
  );
};

export default PatientHistoryPage;
