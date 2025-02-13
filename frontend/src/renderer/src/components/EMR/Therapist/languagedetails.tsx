import React, { useState, useEffect } from "react";
import { DateRangePicker } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { FaArrowLeft, FaPlus } from "react-icons/fa";
import Language from "./Language";

interface LanguageData {
  id: number;
  date: string;
  development_age: string;
  language_data: Record<string, Record<string, string>>;
  doctor_id: number | null;
  therapist_id: number | null;
  taken_by: string;
  role: string;
  first_name: string;
  last_name: string;
  dob: string;
}

interface PatientDetails {
  first_name: string;
  last_name: string;
  age: number;
}

const BASE_URL = "http://127.0.0.1:8000";

const LanguagePage: React.FC = () => {
  const [showNewAssessment, setShowNewAssessment] = useState<boolean>(false);
  const [languageRecords, setLanguageRecords] = useState<LanguageData[]>([]);
  const [filteredRecords, setFilteredRecords] = useState<LanguageData[]>([]);
  const [selectedLanguage, setSelectedLanguage] = useState<LanguageData | null>(
    null
  );
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isAdvanced, setIsAdvanced] = useState<boolean>(false);
  const [patientDetails, setPatientDetails] = useState<PatientDetails | null>(
    null
  );

  const [dateRange, setDateRange] = useState<any>({
    selection: {
      startDate: null,
      endDate: null,
      key: "selection",
    },
  });

  const calculateAge = (dob: string): number => {
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const fetchLanguageRecords = async () => {
    const patientState = localStorage.getItem("patientState");
    if (patientState) {
      const { id: patientId } = JSON.parse(patientState);

      try {
        const response = await fetch(`${BASE_URL}/language/${patientId}`);
        if (!response.ok) throw new Error("Failed to fetch language records");
        const data: LanguageData[] = await response.json();

        if (data.length > 0) {
          const { first_name, last_name, dob } = data[0];
          const age = calculateAge(dob);
          setPatientDetails({ first_name, last_name, age });

          // Dynamically assign "taken_by" and "role"
          const updatedRecords = await Promise.all(
            data.map(async (record) => {
              let takenBy = "";
              let role = "";

              const fetchTakenByRole = async (id: number, type: "therapist" | "doctor") => {
                const url = `${BASE_URL}/api/${type}s/${id}`;
                const response = await fetch(url);
                if (response.ok) {
                  const result = await response.json();
                  return {
                    name: result[`${type}_name`],
                    role: type.charAt(0).toUpperCase() + type.slice(1),
                  };
                }
                return null;
              };

              if (record.therapist_id) {
                const therapist = await fetchTakenByRole(record.therapist_id, "therapist");
                if (therapist) {
                  takenBy = therapist.name;
                  role = therapist.role;
                }
              } else if (record.doctor_id) {
                const doctor = await fetchTakenByRole(record.doctor_id, "doctor");
                if (doctor) {
                  takenBy = doctor.name;
                  role = doctor.role;
                }
              }

              return { ...record, taken_by: takenBy, role };
            })
          );

          setLanguageRecords(updatedRecords);
          setFilteredRecords(updatedRecords);
        }
      } catch (error) {
        console.error("Error fetching language records:", error);
      }
    }
  };

  useEffect(() => {
    fetchLanguageRecords();
  }, []);

  useEffect(() => {
    if (isAdvanced) {
      const { startDate, endDate } = dateRange.selection;
      if (startDate && endDate) {
        const filtered = languageRecords.filter(
          (record) =>
            new Date(record.date) >= startDate && new Date(record.date) <= endDate
        );
        setFilteredRecords(filtered);
      } else {
        setFilteredRecords(languageRecords);
      }
    } else {
      if (selectedDate) {
        const filtered = languageRecords.filter(
          (record) =>
            new Date(record.date).toDateString() === selectedDate.toDateString()
        );
        setFilteredRecords(filtered);
      } else {
        setFilteredRecords(languageRecords);
      }
    }
  }, [selectedDate, dateRange, languageRecords, isAdvanced]);

  const handleNewAssessment = () => {
    setShowNewAssessment(true);
    setSelectedLanguage(null);
  };

  const handleLanguageClick = (language: LanguageData) => {
    setSelectedLanguage(language);
    setShowNewAssessment(false);
  };

  const handleBack = async () => {
    setShowNewAssessment(false);
    setSelectedLanguage(null);
    await fetchLanguageRecords();
  };

  const LanguageDetails: React.FC<{
    language: LanguageData;
    patient: PatientDetails;
    onBack: () => void;
  }> = ({ language, patient, onBack }) => {
    const formatDate = (isoDate: string) => {
      const dateObj = new Date(isoDate);
      return dateObj.toLocaleString("en-US", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        // hour: "2-digit",
        // minute: "2-digit",
        // hour12: true,
      });
    };

    return (
      <div className="min-h-screen bg-blue-200">
        <div className="w-full bg-blue-200 shadow-lg px-6 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-gray-800">
            Language Details
          </h1>
          <button
            onClick={onBack}
            className="flex items-center px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200"
          >
            <FaArrowLeft className="mr-2" /> Back
          </button>
        </div>
        <div className="p-8">
          <div className="bg-white shadow-md p-6 rounded-lg">
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-gray-900">
                {patient.first_name} {patient.last_name} - {patient.age} years
                old
              </h1>
              <p className="text-lg text-gray-700 mt-2">
                Assessment Date: {formatDate(language.date)}
              </p>
            </div>
            <div>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                Language Questionnaire
              </h2>
              <table className="w-full border-collapse border border-gray-300 text-left text-lg">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border border-gray-300 p-4 text-gray-800">
                      Age Group
                    </th>
                    <th className="border border-gray-300 p-4 text-gray-800">
                      Question
                    </th>
                    <th className="border border-gray-300 p-4 text-gray-800 text-center">
                      Response
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(language.language_data).map(
                    ([ageGroup, questions]) =>
                      Object.entries(questions).map(
                        ([question, answer], index) => (
                          <tr
                            key={`${ageGroup}-${index}`}
                            className="even:bg-gray-50"
                          >
                            {index === 0 && (
                              <td
                                rowSpan={Object.keys(questions).length}
                                className="border border-gray-300 p-4 font-semibold text-gray-800 align-top"
                              >
                                {ageGroup}
                              </td>
                            )}
                            <td className="border border-gray-300 p-4 text-gray-700">
                              {question}
                            </td>
                            <td
                              className={`border border-gray-300 p-4 font-medium text-white text-center ${
                                answer.toLowerCase() === "yes"
                                  ? "bg-green-500"
                                  : "bg-red-500"
                              }`}
                            >
                              {answer.charAt(0).toUpperCase() + answer.slice(1)}
                            </td>
                          </tr>
                        )
                      )
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-blue-200 shadow-lg flex flex-col">
      {showNewAssessment ? (
        <div className="flex-1">
          <div className="bg-blue-200 ">
            <div className="mx-auto px-6 py-4 flex items-center justify-between">
              <h1 className="text-2xl font-semibold text-gray-800">
                New Language Assessment
              </h1>
              <button
                onClick={handleBack}
                className="flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition"
              >
                <FaArrowLeft className="mr-2" /> Back
              </button>
            </div>
          </div>
          <div>
            <Language />
          </div>
        </div>
      ) : selectedLanguage && patientDetails ? (
        <LanguageDetails
          language={selectedLanguage}
          patient={patientDetails}
          onBack={() => setSelectedLanguage(null)}
        />
      ) : (
        <>
          <div className="w-full bg-blue-200 shadow-lg">
            <div className="px-6 py-4 flex items-center justify-between">
              <h1 className="text-2xl font-semibold text-gray-800">
                Language Records
              </h1>
              <button
                onClick={handleNewAssessment}
                className="flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition"
              >
                <FaPlus className="mr-2" /> New Language Assessment
              </button>
            </div>
          </div>
          
          <div className="flex-1 px-8 py-6">
            <div className="flex flex-col pb-3 space-y-6">
              <div className="bg-white p-4 rounded-lg shadow-lg">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold text-gray-800">
                    Filter by Date
                  </h2>
                  <button
                    onClick={() => setIsAdvanced(!isAdvanced)}
                    className="text-blue-600 hover:underline"
                  >
                    {isAdvanced ? "Simple" : "Advanced"}
                  </button>
                </div>
                {!isAdvanced ? (
                  <div className="flex items-center gap-4">
                    <input
                      type="date"
                      value={
                        selectedDate
                          ? selectedDate.toISOString().split("T")[0]
                          : ""
                      }
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
                      rangeColors={["#2563EB"]}
                      className="rounded-lg"
                    />
                    <div className="flex justify-end mt-4">
                      <button
                        onClick={() =>
                          setDateRange({
                            selection: {
                              startDate: null,
                              endDate: null,
                              key: "selection",
                            },
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
            {filteredRecords.length > 0 ? (
              <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-x-auto">
                <div className="grid grid-cols-4 gap-4 bg-gray-100 border-b border-gray-300 p-4 font-semibold text-gray-700">
                  <span>Date</span>
                  <span>Development Age</span>
                  <span>Taken By</span>
                  <span>Role</span>
                </div>
                <div className="divide-y divide-gray-200">
                  {filteredRecords.map((record) => (
                    <div
                      key={record.id}
                      onClick={() => handleLanguageClick(record)}
                      className="grid grid-cols-4 gap-4 p-4 hover:bg-gray-100 cursor-pointer transition"
                    >
                      <span className="text-gray-800 font-medium">
                        {new Intl.DateTimeFormat("en-GB", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                        }).format(new Date(record.date))}
                      </span>
                      <span className="text-gray-600">
                        {record.development_age}
                      </span>
                      <span className="text-gray-600">{record.taken_by}</span>
                      <span className="text-gray-600">{record.role}</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <p className="text-gray-600">No language records found.</p>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default LanguagePage;
