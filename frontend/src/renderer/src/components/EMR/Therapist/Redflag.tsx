const twoMonthsFields = [
    { label: "Doesn't react to loud sounds", type: "select", options: ["Yes", "No"] },
    { label: "Doesn't bring hands to mouth", type: "select", options: ["Yes", "No"] },
    { label: "Doesn't follow moving objects", type: "select", options: ["Yes", "No"] },
    { label: "Cannot hold head up when pushing up when on tummy", type: "select", options: ["Yes", "No"] },
  ];
  
  const fourMonthsFields = [
    { label: "Doesn't smile at people", type: "select", options: ["Yes", "No"] },
    { label: "Doesn't coo or make sounds", type: "select", options: ["Yes", "No"] },
    { label: "Cannot hold head steady", type: "select", options: ["Yes", "No"] },
    { label: "Doesn't push down with legs when feet are placed on a hard surface", type: "select", options: ["Yes", "No"] },
  ];
  
  const sixMonthsFields = [
    { label: "Doesn't make vowel sounds ('ah', 'eh', 'oh') or squealing sounds", type: "select", options: ["Yes", "No"] },
    { label: "Shows no affection for caregivers", type: "select", options: ["Yes", "No"] },
    { label: "Doesn't roll over in either direction", type: "select", options: ["Yes", "No"] },
    { label: "Seems very stiff or very floppy", type: "select", options: ["Yes", "No"] },
  ];
  
  const nineMonthsFields = [
    { label: "Doesn't respond to own name", type: "select", options: ["Yes", "No"] },
    { label: "Doesn't seem to recognize familiar people", type: "select", options: ["Yes", "No"] },
    { label: "Doesn't look where you point", type: "select", options: ["Yes", "No"] },
    { label: "Doesn't play back-and-forth play", type: "select", options: ["Yes", "No"] },
    { label: "Doesn't babble ('mama', 'baba', 'dada')", type: "select", options: ["Yes", "No"] },
    { label: "Doesn't sit with help", type: "select", options: ["Yes", "No"] },
    { label: "Doesn't bear weight on legs with support", type: "select", options: ["Yes", "No"] },
    { label: "Doesn't transfer toys from one hand to the other", type: "select", options: ["Yes", "No"] },
  ];
  
  const twelveMonthsFields = [
    { label: "Doesn't say single words", type: "select", options: ["Yes", "No"] },
    { label: "Doesn't point to things", type: "select", options: ["Yes", "No"] },
    { label: "Doesn't learn gestures like waving or shaking head", type: "select", options: ["Yes", "No"] },
    { label: "Doesn't search for things that you hide", type: "select", options: ["Yes", "No"] },
    { label: "Doesn't crawl", type: "select", options: ["Yes", "No"] },
    { label: "Can't stand when supported", type: "select", options: ["Yes", "No"] },
  ];
  
  const eighteenMonthsFields = [
    { label: "Doesn't copy others", type: "select", options: ["Yes", "No"] },
    { label: "Doesn't use at least 6 words or doesn't gain new words", type: "select", options: ["Yes", "No"] },
    { label: "Doesn't point to show things to others", type: "select", options: ["Yes", "No"] },
    { label: "Doesn't know what familiar things are used for", type: "select", options: ["Yes", "No"] },
    { label: "Doesn't notice or mind when a caregiver leaves or returns", type: "select", options: ["Yes", "No"] },
    { label: "Cannot walk", type: "select", options: ["Yes", "No"] },
  ];
  
  const twoYearsFields = [
    { label: "Doesn't use 2-word phrases (for example, 'come here')", type: "select", options: ["Yes", "No"] },
    { label: "Doesn't copy actions or words", type: "select", options: ["Yes", "No"] },
    { label: "Doesn't follow simple instructions", type: "select", options: ["Yes", "No"] },
    { label: "Doesn't know what to do with common things, like a brush or spoon", type: "select", options: ["Yes", "No"] },
    { label: "Doesn't walk steadily", type: "select", options: ["Yes", "No"] },
  ];
  


  const renderInputField = (field: any) => {
    return (
      <div className={`w-full ${field.fullWidth ? 'md:col-span-3' : 'md:col-span-1'} mb-5`}>
        <label className="block text-gray-600 font-medium mb-1 truncate">{field.label}</label>
        
        {field.type === 'radio' ? (
          <div className="flex gap-5">
            {field.options?.map((option: string, index: number) => (
              <label key={index} className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  name={field.label}
                  value={option.toLowerCase()}
                  className="mr-2 focus:ring-0 text-gray-700"
                />
                <span className="text-gray-600">{option}</span>
              </label>
            ))}
          </div>
        ) : field.type === 'textarea' ? (
          <textarea
            className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:border-gray-400 placeholder-gray-400 transition ease-in-out duration-100"
            placeholder={field.placeholder}
          ></textarea>
        ) : field.type === 'select' ? (
          <select
            className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:border-gray-400 transition ease-in-out duration-100 bg-white"
          >
            {field.options?.map((option: string, index: number) => (
              <option key={index} value={option.toLowerCase()}>{option}</option>
            ))}
          </select>
        ) : (
          <input
            type={field.type}
            className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:border-gray-400 placeholder-gray-400 transition ease-in-out duration-100"
            placeholder={field.placeholder}
          />
        )}
      </div>
    );
  };
  


// Developmental History Section Component
const TwoMonthsField = () => {
  return (
    <div id="twoMonths-Fields" className="grid grid-cols-1 md:grid-cols-3 gap-5 p-10 bg-white rounded-3xl shadow-md">
      <h2 className="text-3xl mb-6 md:col-span-3">Developmental History</h2>
      {twoMonthsFields.map((field) => renderInputField(field))}
    </div>
  );
};


// Transition History Section Component
const FourMonthsField = () => {
  return (
    <div id="fourMonths-Field" className="grid grid-cols-1 md:grid-cols-3 gap-5 p-10 bg-white rounded-3xl shadow-md">
      <h2 className="text-3xl mb-6 md:col-span-3">Transition History</h2>
      {fourMonthsFields.map((field) => renderInputField(field))}
    </div>
  );
};

// Fine Motor Skills Section Component
const SixMonthsField = () => {

  return (
    <div id="sixMonths-Field" className="grid grid-cols-1 md:grid-cols-3 gap-5 p-10 bg-white rounded-3xl shadow-md">
      <h2 className="text-3xl mb-6 md:col-span-3">Fine Motor Skills</h2>
      {sixMonthsFields.map((field) => renderInputField(field))}
    </div>
  );
};

// Language Receptive Skills Section Component
const NineMonthsField = () => {
  return (
    <div id="nineMonths-Field" className="grid grid-cols-1 md:grid-cols-3 gap-5 p-10 bg-white rounded-3xl shadow-md">
      <h2 className="text-3xl mb-6 md:col-span-3">Language Receptive Skills</h2>     
      {nineMonthsFields.map((field) => renderInputField(field))}
    </div>
  );
};

// Communication Skills Section Component
const TwelveMonthsField = () => {
  return (
    <div id="twelveMonths-Field" className="grid grid-cols-1 md:grid-cols-3 gap-5 p-10 bg-white rounded-3xl shadow-md">
      <h2 className="text-3xl mb-6 md:col-span-3">Communication Skills</h2>
      {twelveMonthsFields.map((field) => renderInputField(field))}
    </div>
  );
};


// Social Development Section Component
const EighteenMonthsField = () => {
  return (
    <div id="eighteenMonths-Field" className="grid grid-cols-1 md:grid-cols-3 gap-5 p-10 bg-white rounded-3xl shadow-md">
      <h2 className="text-3xl mb-6 md:col-span-3">Social Development</h2>
      {eighteenMonthsFields.map((field) => renderInputField(field))}
    </div>
  );
};

const TwoYearsField = () => {
  return (
    <div id="twoYears-Field" className="grid grid-cols-1 md:grid-cols-3 gap-5 p-10 bg-white rounded-3xl shadow-md">
      <h2 className="text-3xl mb-6 md:col-span-3">Play Skills</h2>
      {twoYearsFields.map((field) => renderInputField(field))}
    </div>
  );
};


// Export all components
export {
  TwoMonthsField,
  FourMonthsField,
  SixMonthsField,
  NineMonthsField,
  TwelveMonthsField,
  EighteenMonthsField,
  TwoYearsField,
};
