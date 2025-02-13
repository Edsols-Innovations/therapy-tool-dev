import edsols from '../../assets/EMR/edsols.png';
import { UserCheck, Stethoscope, Heart } from "lucide-react";
import loginBg from '../../assets/EMR/login.png';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const BASE_URL = 'http://127.0.0.1:8000';

const Login = () => {
  const [selectedRole, setSelectedRole] = useState<'Admin' | 'Therapist' | 'Doctor'>(
    'Admin'
  );
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const navigate = useNavigate();
  const [companyLogo, setCompanyLogo] = useState<string | null>(null);
  const [notification, setNotification] = useState<string | null>(null);

  const { login } = useAuth();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCredentials({ ...credentials, [name]: value });
  };

  // 3D Tilt Hover Effect State
  const [tiltStyle, setTiltStyle] = useState({});

  // Handle Mouse Move for Tilt Effect
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { clientX, clientY, currentTarget } = e;
    const { left, top, width, height } = currentTarget.getBoundingClientRect();

    const x = ((clientX - left) / width - 0.5) * 10; // Tilt intensity
    const y = ((clientY - top) / height - 0.5) * -10;

    setTiltStyle({
      transform: `perspective(1000px) rotateX(${y}deg) rotateY(${x}deg) translateY(-3px)`,
      transition: "transform 0.1s ease-out",
    });
  };

  // Reset Tilt Effect When Mouse Leaves
  const handleMouseLeave = () => {
    setTiltStyle({
      transform: "perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)",
      transition: "transform 0.3s ease-out",
    });
  };

  const fetchLogo = async () => {
    try {
      const response = await fetch(`${BASE_URL}/admin/logo`);
      if (!response.ok) throw new Error('Failed to fetch logo');
      const data = await response.json();
      if (data.logo_path) {
        setCompanyLogo(`${BASE_URL}/${data.logo_path}`);
      }
    } catch (error) {
      console.error('Error fetching logo:', error);
    }
  };

  const handleLogin = async () => {
    try {
      const userData = await login(selectedRole, credentials); // Use login from AuthContext

      // Determine the navigation route based on the role
      const route = selectedRole === 'Admin' ? '/admin' : '/patientlist';
      navigate(route, {
        state: { id: userData.id, role: selectedRole, name: userData.name },
      });
    } catch (error: unknown) {
      if (error instanceof Error) {
        setNotification(error.message);
      } else {
        setNotification('An unexpected error occurred.');
      }
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      handleLogin();
    }
  };

  useEffect(() => {
    fetchLogo();
  }, []);

  const renderFormFields = () => (
    <div className="relative w-full overflow-hidden flex flex-col items-center">
      <div
        className="flex transition-transform duration-500 ease-in-out w-full"
        style={{
          transform: `translateX(${
            selectedRole === 'Admin'
              ? '0%'
              : selectedRole === 'Therapist'
              ? '-100%'
              : '-200%'
          })`,
        }}
      >
        {/* Administrator Form */}
        <div className="w-full flex-shrink-0 p-4">
          <label className="block mb-2 text-gray-700 font-semibold">Admin ID</label>
          <input
            type="text"
            name="username"
            placeholder="Enter Admin ID"
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            className="w-full border border-gray-300 focus:outline-none focus:ring-1 focus:ring-red-500 rounded-lg px-4 py-3 mb-4 shadow-sm transition duration-300"
          />
          <label className="block mb-2 text-gray-700 font-semibold">Password</label>
          <input
            type="password"
            name="password"
            placeholder="Enter Password"
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            className="w-full border border-gray-300 focus:outline-none focus:ring-1 focus:ring-red-500 rounded-lg px-4 py-3 shadow-sm transition duration-300"
          />
        </div>

        {/* Therapist Form */}
        <div className="w-full flex-shrink-0 p-4">
          <label className="block mb-2 text-gray-700 font-semibold">Therapist Username</label>
          <input
            type="text"
            name="username"
            placeholder="Enter Therapist Username"
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            className="w-full border border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500 rounded-lg px-4 py-3 mb-4 shadow-sm transition duration-300"
          />
          <label className="block mb-2 text-gray-700 font-semibold">Password</label>
          <input
            type="password"
            name="password"
            placeholder="Enter Password"
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            className="w-full border border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500 rounded-lg px-4 py-3 shadow-sm transition duration-300"
          />
        </div>

        {/* Doctor Form */}
        <div className="w-full flex-shrink-0 p-4">
          <label className="block mb-2 text-gray-700 font-semibold">Doctor Username</label>
          <input
            type="text"
            name="username"
            placeholder="Enter Doctor Username"
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            className="w-full border border-gray-300 focus:outline-none focus:ring-1 focus:ring-purple-500 rounded-lg px-4 py-3 mb-4 shadow-sm transition duration-300"
          />
          <label className="block mb-2 text-gray-700 font-semibold">Password</label>
          <input
            type="password"
            name="password"
            placeholder="Enter Password"
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            className="w-full border border-gray-300 focus:outline-none focus:ring-1 focus:ring-purple-500 rounded-lg px-4 py-3 shadow-sm transition duration-300"
          />
        </div>
      </div>
      <button
        onClick={handleLogin}
        className="flex justify-center items-center mt-6 w-full sm:w-3/4 lg:w-1/4 py-3 bg-gradient-to-r from-blue-500 to-indigo-700 text-white font-semibold rounded-md shadow-lg hover:shadow-2xl transform hover:scale-105 transition duration-300 ease-in-out"
      >
        Login
      </button>
    </div>
  );

  return (
    <div
      className="min-h-screen bg-sky-100 flex flex-col justify-center items-center bg-cover bg-center relative overflow-hidden"
      style={{ backgroundImage: `url(${loginBg})`, backgroundSize: "cover", backgroundPosition: "center" }} // ✅ Background applied
    >
      {/* Background Patterns */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-orange-400 opacity-10 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-blue-400 opacity-10 rounded-full translate-x-1/2 translate-y-1/2"></div>

      {notification && (
        <div className="absolute top-16 bg-red-500 text-white px-4 py-2 rounded shadow-lg">
          {notification}
        </div>
      )}

      {/* Header */}
      <div className="absolute top-0 left-0 w-full p-6 flex justify-between items-center z-10">
        <div className="text-3xl md:text-5xl font-bold text-gray-700">
          Electronic Medical Record
        </div>
        <div className="flex h-12 justify-between items-center">
          {companyLogo ? (
            <img src={companyLogo} alt="Company Logo" className="h-10 object-contain" />
          ) : (
            <div className="h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center">
              <span className="text-gray-400">Logo</span>
            </div>
          )}{' '}
          <div className="w-[1px] h-full bg-gray-400 mx-4"></div>
          <img className="h-full object-contain" src={edsols} alt="edsols" />
        </div>
      </div>

      {/* Login Card with 3D Tilt Hover Effect */}
      <div
        className="relative z-20 w-[90%] sm:w-[80%] md:w-[60%] lg:w-[40%] xl:w-[35%] p-8 bg-white rounded-2xl shadow-2xl flex flex-col items-center"
        style={tiltStyle}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >        
        <div className="text-2xl md:text-3xl font-semibold text-gray-800 mb-4">Welcome Back!</div>
        <div className="text-md md:text-lg text-gray-600 mb-8">Please select your role to login.</div>

        {/* Role Buttons */}
        <div className="flex justify-center gap-4 mb-6">
        <button
          onClick={() => setSelectedRole("Admin")}
          className={`flex items-center px-6 py-3 rounded-full font-medium transition-all duration-300
            ${
              selectedRole === "Admin"
                ? "bg-gradient-to-t from-gray-200 to-gray-100 border border-gray-300 shadow-lg"
                : "bg-gradient-to-t from-white to-gray-100 border border-gray-200 shadow-md"
            }
            hover:shadow-2xl hover:-translate-y-[2px]
            active:shadow-inner active:translate-y-[1px]"
          `}
        >
          <UserCheck className="mr-2 w-6 h-6" /> {/* Admin Icon */}
          Administrator
        </button>

        <button
          onClick={() => setSelectedRole("Therapist")}
          className={`flex items-center px-6 py-3 rounded-full font-medium transition-all duration-300
            ${
              selectedRole === "Therapist"
                ? "bg-gradient-to-t from-blue-200 to-blue-100 border border-blue-300 shadow-lg"
                : "bg-gradient-to-t from-white to-gray-100 border border-gray-200 shadow-md"
            }
            hover:shadow-2xl hover:-translate-y-[2px]
            active:shadow-inner active:translate-y-[1px]"
          `}
        >
          <Heart className="mr-2 w-6 h-6" /> {/* Therapist Icon */}
          Therapist
        </button>

        <button
          onClick={() => setSelectedRole("Doctor")}
          className={`flex items-center px-6 py-3 rounded-full font-medium transition-all duration-300
            ${
              selectedRole === "Doctor"
                ? "bg-gradient-to-t from-purple-200 to-purple-100 border border-purple-300 shadow-lg"
                : "bg-gradient-to-t from-white to-gray-100 border border-gray-200 shadow-md"
            }
            hover:shadow-2xl hover:-translate-y-[2px]
            active:shadow-inner active:translate-y-[1px]"
          `}
        >
          <Stethoscope className="mr-2 w-6 h-6" /> {/* Doctor Icon */}
          Doctor
        </button>
        </div>

        {/* Render Form Fields */}
        <div className="w-full p-4">{renderFormFields()}</div>
      </div>
    </div>
  );
};

export default Login;
