import { useState, useEffect } from "react";
import { Trash2, UserCircle } from "lucide-react";
import { toast, ToastContainer } from "react-toastify"; // Import Toastify
import "react-toastify/dist/ReactToastify.css"; // Import styles
import profile from "../../../assets/EMR/profile.jpg";

interface Patient {
  id: string;
  name: string;
  therapistName: string | null;
  doctorName: string | null;
  age: number;
  gender: string;
  profilePic: string;
}

const BASE_URL = "http://127.0.0.1:8000";

const ManagePatients: React.FC = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [selectedPatients, setSelectedPatients] = useState<Set<string>>(new Set());

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const response = await fetch(`${BASE_URL}/patients/admin`);
        if (response.ok) {
          const data = await response.json();
          setPatients(data);
        } else {
          console.error("Failed to fetch patients:", response.statusText);
        }
      } catch (error) {
        console.error("Error fetching patients:", error);
      }
    };

    fetchPatients();
  }, []);

  const getProfileImageUrl = (filename) => {
    if (!filename) return profile;
    const cleanFilename = filename.startsWith("/uploads/") ? filename.replace("/uploads/", "") : filename;
    return `${BASE_URL}/patients/patient-image/${encodeURIComponent(cleanFilename)}`;
  };

  const toggleSelectPatient = (patientId: string) => {
    setSelectedPatients((prevSelected) => {
      const newSelected = new Set(prevSelected);
      newSelected.has(patientId) ? newSelected.delete(patientId) : newSelected.add(patientId);
      return newSelected;
    });
  };

  const deleteSelectedPatients = async () => {
    if (selectedPatients.size === 0) {
      toast.warn("Please select at least one patient to delete.");
      return;
    }

    try {
      const response = await fetch(`${BASE_URL}/patients/admin`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(Array.from(selectedPatients)),
      });

      if (response.ok) {
        setPatients((prevPatients) => prevPatients.filter((patient) => !selectedPatients.has(patient.id)));
        setSelectedPatients(new Set());

        // ✅ Show success toast
        toast.success("Selected patients deleted successfully!");
      } else {
        const errorData = await response.json();
        console.error("Failed to delete patients:", errorData.detail);
        toast.error("Failed to delete selected patients.");
      }
    } catch (error) {
      console.error("Error deleting patients:", error);
      toast.error("An error occurred while deleting selected patients.");
    }
  };

  return (
    <div className="p-6 bg-opacity-80 rounded-xl w-full">
      <ToastContainer
        position="top-center"
        autoClose={5000}
        toastStyle={{ padding: "24px", width: "400px" }} // Enlarges the background box
      />

      <h2 className="text-3xl font-semibold text-left mb-6 flex items-center space-x-2">
        <UserCircle className="w-8 h-8 text-blue-600" />
        <span>Manage Patients</span>
      </h2>

      <div className="overflow-x-auto">
        <table className="w-full bg-white/70 backdrop-blur-md shadow-md rounded-lg shadow-lg overflow-hidden border border-gray-200">
          <thead className="bg-gray-100">
            <tr className="text-gray-700 text-left">
              <th className="p-4">
                <input
                  type="checkbox"
                  onChange={(e) => {
                    setSelectedPatients(e.target.checked ? new Set(patients.map((patient) => patient.id)) : new Set());
                  }}
                  className="form-checkbox h-5 w-5 text-blue-600"
                />
              </th>
              <th className="p-4">Profile</th>
              <th className="p-4">Name</th>
              <th className="p-4">Doctor</th>
              <th className="p-4">Therapist</th>
              <th className="p-4">Age</th>
              <th className="p-4">Gender</th>
            </tr>
          </thead>
          <tbody>
            {patients.map((patient) => (
              <tr
                key={patient.id}
                className={`border-t border-gray-200 transition-all ${
                  selectedPatients.has(patient.id) ? "bg-blue-50" : "hover:bg-gray-50"
                }`}
              >
                <td className="p-4">
                  <input
                    type="checkbox"
                    checked={selectedPatients.has(patient.id)}
                    onChange={() => toggleSelectPatient(patient.id)}
                    className="form-checkbox h-5 w-5 text-blue-600"
                  />
                </td>
                <td className="p-4">
                  <div className="w-12 h-12 rounded-full overflow-hidden shadow-md border border-gray-300">
                    <img src={getProfileImageUrl(patient.profilePic)} alt={patient.name} className="w-full h-full object-cover" />
                  </div>
                </td>
                <td className="p-4 font-medium text-gray-800">{patient.name}</td>
                <td className="p-4 text-gray-600">{patient.doctorName || "All"}</td>
                <td className="p-4 text-gray-600">{patient.therapistName || "All"}</td>
                <td className="p-4 text-gray-600">{patient.age}</td>
                <td className="p-4 text-gray-600">{patient.gender}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-6 flex justify-end">
        <button
          onClick={deleteSelectedPatients}
          className="flex items-center space-x-2 bg-red-500 text-white px-6 py-2 rounded-lg font-medium shadow-lg hover:bg-red-600 hover:shadow-xl transition-all"
        >
          <Trash2 className="w-5 h-5" />
          <span>Delete</span>
        </button>
      </div>
    </div>
  );
};

export default ManagePatients;
