// renderInputField.tsx
interface Field {
  label: string;
  type: string;
  options?: string[];
  placeholder?: string;
  category: string; // To identify which section the field belongs to
}

interface RenderInputFieldProps {
  field: Field;
  onChange: (category: string, question: string, value: string) => void;
}

export const renderInputField = ({ field, onChange }: RenderInputFieldProps) => {
  const handleChange = (value: string) => {
    onChange(field.category, field.label, value);
  };

  return (
    <div className="w-full md:col-span-1 mb-4">
      <label className="block text-gray-700 font-semibold mb-2">{field.label}</label>
      {field.type === 'radio' ? (
        <div className="flex gap-4">
          {field.options?.map((option: string, index: number) => (
            <label key={index} className="flex items-center">
              <input
                type="radio"
                name={`${field.category}-${field.label}`}
                value={option.toLowerCase()}
                onChange={(e) => handleChange(e.target.value)}
                className="mr-2"
              />
              {option}
            </label>
          ))}
        </div>
      ) : (
        <input
          type={field.type}
          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-300"
          placeholder={field.placeholder}
          onChange={(e) => handleChange(e.target.value)}
        />
      )}
    </div>
  );
};