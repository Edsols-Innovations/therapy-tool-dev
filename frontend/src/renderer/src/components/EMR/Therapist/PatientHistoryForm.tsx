import React, { useState } from 'react';

const sections = [
  { id: 'profile', label: 'Profile' },
  { id: 'birth-history', label: 'Birth History' },
];

const profileFields = [
  { label: 'First Name', type: 'text', placeholder: 'Enter first name' },
  { label: 'Last Name', type: 'text', placeholder: 'Enter last name' },
  { label: 'Sex', type: 'select', options: ['Select sex', 'Male', 'Female', 'Other'] },
  { label: 'DOB', type: 'date' },
  { label: 'Chronological Age', type: 'number', placeholder: 'Enter chronological age' },
  { label: "Father's Name", type: 'text', placeholder: "Enter father's name" },
  { label: "Father's Occupation", type: 'text', placeholder: "Enter father's occupation" },
  { label: "Father's Contact Number", type: 'text', placeholder: "Enter father's contact number" },
  { label: "Mother's Name", type: 'text', placeholder: "Enter mother's name" },
  { label: "Mother's Occupation", type: 'text', placeholder: "Enter mother's occupation" },
  { label: "Mother's Contact Number", type: 'text', placeholder: "Enter mother's contact number" },
  { label: "Mother's Email ID", type: 'email', placeholder: "Enter mother's email ID" },
  { label: 'Residence', type: 'textarea', placeholder: 'Enter residence', fullWidth: true },
];

const birthHistoryFields = [
  { label: 'Pedigree (1st/2nd child)', type: 'text', placeholder: 'Enter pedigree' },
  { label: 'Consanguinity', type: 'text', placeholder: 'Enter consanguinity' },
  { label: 'Antenatal History', type: 'textarea', placeholder: 'Enter antenatal history' },
  { label: 'Perinatal History', type: 'textarea', placeholder: 'Enter perinatal history' },
  { label: 'Mode of Conception', type: 'radio', options: ['Natural', 'Assisted'] },
  { label: 'Mode of Delivery', type: 'radio', options: ['NVD', 'Assisted', 'LSCS'] },
  { label: 'Delivered Term or Preterm', type: 'radio', options: ['Term', 'Preterm'] },
  { label: 'Cried at Birth', type: 'radio', options: ['Yes', 'No'] },
  { label: 'Birth Weight', type: 'number', placeholder: 'Enter birth weight' },
  {
    label: 'Postnatal History (Complications)',
    type: 'textarea',
    placeholder: 'Describe postnatal complications',
  },
  { label: 'Breastfed Upto', type: 'text', placeholder: 'Enter duration of breastfeeding' },
];

const PatientHistoryForm: React.FC<{ initialData?: any; onSave: (data: any) => void }> = ({
  initialData = {},
  onSave,
}) => {
  const [page, setPage] = useState(0);
  const [formData, setFormData] = useState(initialData);

  const handleChange = (field: string, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    console.log('Form Data:', formData);
    onSave(formData);
  };

  const renderField = (field: any) => {
    switch (field.type) {
      case 'text':
      case 'number':
      case 'date':
      case 'email':
        return (
          <input
            type={field.type}
            placeholder={field.placeholder}
            value={formData[field.label] || ''}
            onChange={(e) => handleChange(field.label, e.target.value)}
            className="mt-1 w-full border border-gray-300 rounded-lg px-4 py-2"
          />
        );
      case 'select':
        return (
          <select
            value={formData[field.label] || ''}
            onChange={(e) => handleChange(field.label, e.target.value)}
            className="mt-1 w-full border border-gray-300 rounded-lg px-4 py-2"
          >
            {field.options.map((option: string) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        );
      case 'textarea':
        return (
          <textarea
            placeholder={field.placeholder}
            value={formData[field.label] || ''}
            onChange={(e) => handleChange(field.label, e.target.value)}
            className="mt-1 w-full border border-gray-300 rounded-lg px-4 py-2"
          />
        );
      case 'radio':
        return (
          <div className="flex space-x-4">
            {field.options.map((option: string) => (
              <label key={option}>
                <input
                  type="radio"
                  name={field.label}
                  value={option}
                  checked={formData[field.label] === option}
                  onChange={() => handleChange(field.label, option)}
                />
                {option}
              </label>
            ))}
          </div>
        );
      default:
        return null;
    }
  };

  const fields = page === 0 ? profileFields : birthHistoryFields;

  return (
    <div className="flex">
      {/* Sidebar */}
      <div className="w-1/4 bg-blue-600 text-white p-4">
        {sections.map((section, index) => (
          <div
            key={section.id}
            onClick={() => setPage(index)}
            className={`p-2 rounded cursor-pointer ${
              page === index ? 'bg-blue-800' : ''
            }`}
          >
            {section.label}
          </div>
        ))}
      </div>

      {/* Form */}
      <div className="flex-1 p-6 bg-white">
        <h2 className="text-lg font-bold">{sections[page].label}</h2>
        <div className="grid grid-cols-1 gap-4 mt-4">{fields.map(renderField)}</div>
        <div className="flex justify-between mt-6">
          <button
            onClick={() => setPage((prev) => Math.max(0, prev - 1))}
            disabled={page === 0}
            className="bg-gray-500 text-white px-4 py-2 rounded"
          >
            Previous
          </button>
          {page < sections.length - 1 ? (
            <button
              onClick={() => setPage((prev) => Math.min(sections.length - 1, prev + 1))}
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              Next
            </button>
          ) : (
            <button onClick={handleSubmit} className="bg-green-500 text-white px-4 py-2 rounded">
              Save
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default PatientHistoryForm;
