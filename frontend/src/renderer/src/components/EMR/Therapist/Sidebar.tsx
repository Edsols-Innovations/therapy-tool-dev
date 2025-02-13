// Sidebar.jsx
import { useEffect, useState } from 'react'
import {
  FiUser,
  FiFileText,
  FiLayers,
  FiUserPlus,
  FiMenu,
  FiChevronLeft,
  FiHome
} from 'react-icons/fi'
import { AiOutlineCloudUpload } from 'react-icons/ai'
import { BiClipboard, BiBarChartAlt2 } from 'react-icons/bi'
import profileImg from '../../../assets/EMR/profile.jpg'
import edsolsLogo from '../../../assets/EMR/edsols.png'
import { Link } from 'react-router-dom'

const BASE_URL = 'http://127.0.0.1:8000'

const Sidebar = ({ activeView, onClick, mode, onModeChange, isAdding, role, roleId, name }) => {
  const [isOpen, setIsOpen] = useState(true)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [hoveredButton, setHoveredButton] = useState<string | null>(null)
  const [selectedPicture, setSelectedPicture] = useState(profileImg)
  const [companyLogo, setCompanyLogo] = useState<string | null>(null);

  // Define menu items based on mode
  const existingPatientMenu = [
    { id: 'patient-profile', label: 'Patient Profile', icon: <FiUser /> },
    { id: 'screening', label: 'Screening', icon: <FiFileText /> },
    { id: 'language', label: 'Language', icon: <BiBarChartAlt2 /> },
    { id: 'investigation', label: 'Investigation', icon: <AiOutlineCloudUpload /> },
    { id: 'assessment', label: 'Assessments', icon: <BiClipboard /> },
    { id: 'therapyware', label: 'Therapyware', icon: <FiLayers /> }
  ]

  const addPatientMenu = [
    { id: 'patient-history', label: 'Patient History', icon: <FiUser /> },
    { id: 'screening', label: 'Screening', icon: <BiBarChartAlt2 /> },
    { id: 'language', label: 'Language', icon: <BiBarChartAlt2 /> },
    { id: 'investigation', label: 'Investigation', icon: <AiOutlineCloudUpload /> },
    { id: 'assessment', label: 'Assessments', icon: <BiClipboard /> }
  ]

  const menuItems = mode === 'existing' ? existingPatientMenu : addPatientMenu

  const toggleSidebar = () => setIsOpen(!isOpen)
  const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen)

  const getProfileImageUrl = (filename, role) => {
    if (!filename) return profileImg // Fallback to default profile picture
    const cleanFilename = filename.split('/').pop() // Extract only the filename

    // Use the appropriate endpoint based on the role
    const endpoint = role === 'Therapist' ? 'therapist-image' : 'doctor-image'
    return `${BASE_URL}/api/${endpoint}/${encodeURIComponent(cleanFilename)}`
  }

  const fetchLogo = async () => {
    try {
      const response = await fetch(`${BASE_URL}/admin/logo`)
      if (!response.ok) throw new Error('Failed to fetch logo')
      const data = await response.json()
      if (data.logo_path) {
        setCompanyLogo(`${BASE_URL}/${data.logo_path}`)
      }
    } catch (error) {
      console.error('Error fetching logo:', error)
    }
  }

  useEffect(() => {
    const fetchProfileImage = async () => {
      try {
        const response = await fetch(`${BASE_URL}/images/profile-image/${role}/${roleId}`)
        if (!response.ok) {
          throw new Error('Failed to fetch profile image')
        }
        const data = await response.json()
        console.log(data.profile_image)
        if (data.profile_image) {
          setSelectedPicture(`${data.profile_image}`)
        }
      } catch (error) {
        console.error('Error fetching profile image:', error)
      }
    }

    if (roleId && role) {
      fetchProfileImage()
    }
    fetchLogo()
  }, [roleId, role])

  // Tooltip component
  const Tooltip = ({ text }) => (
    <div className="absolute left-full top-1/2 transform -translate-y-1/2 ml-2 bg-gray-800 text-white text-sm px-2 py-1 rounded shadow-lg z-50 whitespace-nowrap">
      {text}
    </div>
  )

  return (
    <div className="flex text-nowrap relative">
      {/* Mobile menu button */}
      <div className="md:hidden flex items-center p-2 bg-gray-800 text-white">
        <button onClick={toggleMobileMenu}>
          {mobileMenuOpen ? <FiChevronLeft size={24} /> : <FiMenu size={24} />}
        </button>
      </div>

      {/* Sidebar */}
      <div
        className={`bg-gray-900 text-white h-screen ${
          isOpen ? 'w-64' : 'w-20'
        } transition-all duration-300 hidden md:flex flex-col relative`}
      >
        <div className={`flex items-center ${isOpen ? 'justify-between' : 'justify-center'} p-4`}>
          {isOpen && (
            <div className="flex items-center justify-center p-4">
              <div className="flex items-center space-x-4">
                {companyLogo ? (
                  <img
                    src={companyLogo}
                    alt="Company Logo"
                    className="h-10 w-auto object-contain"
                  />
                ) : (
                  <div className="h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center">
                    <span className="text-gray-400">Logo</span>
                  </div>
                )}
                <div className="w-px h-8 bg-gray-600"></div>
                <img src={edsolsLogo} alt="Edsols Logo" className="h-10 w-auto" />
              </div>
            </div>
          )}
          <button onClick={toggleSidebar} className="text-gray-300">
            {isOpen ? <FiChevronLeft size={24} /> : <FiMenu size={24} />}
          </button>
        </div>

        {/* Mode Switch - Hide if isAdding is true */}
        {!isAdding && role !== 'Administrator' && (
          <div className="px-4 relative">
            <button
              onClick={() => onModeChange(mode === 'existing' ? 'add' : 'existing')}
              className={`flex items-center w-full px-3 py-2 text-left hover:bg-gray-800 transition-colors rounded-lg ${
                !isOpen && 'justify-center'
              }`}
              onMouseEnter={() => setHoveredButton('mode-switch')}
              onMouseLeave={() => setHoveredButton(null)}
            >
              <span className="text-xl">{mode === 'existing' ? <FiUserPlus /> : <FiUser />}</span>
              {isOpen && (
                <span className="ml-4">
                  {mode === 'existing' ? 'Add Patient' : 'Existing Patient'}
                </span>
              )}
              {/* Tooltip */}
              {!isOpen && hoveredButton === 'mode-switch' && (
                <Tooltip text={mode === 'existing' ? 'Add Patient' : 'Existing Patient'} />
              )}
            </button>
          </div>
        )}

        {/* Menu Items */}
        <nav className="flex-1 relative">
          <ul className="py-4">
            {menuItems.map((item) => (
              <li key={item.id} className="relative">
                <button
                  onClick={() => onClick(item.id)}
                  className={`flex items-center w-full px-4 py-4 text-left transition-colors ${
                    activeView === item.id ? 'bg-gray-800' : ''
                  } ${!isOpen && 'justify-center'}`}
                  onMouseEnter={() => setHoveredButton(item.id)}
                  onMouseLeave={() => setHoveredButton(null)}
                >
                  <span className="text-2xl">{item.icon}</span>
                  {isOpen && <span className="ml-4">{item.label}</span>}
                  {/* Tooltip */}
                  {!isOpen && hoveredButton === item.id && <Tooltip text={item.label} />}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        {/* Logout Buttons */}
        <div className="p-4 border-t border-gray-700">
          <Link
            to="/patientlist"
            className={`relative flex items-center w-full px-2 py-2 text-left hover:bg-gray-800 transition-colors rounded-lg ${
              !isOpen && 'justify-center'
            }`}
            onClick={() => {
              // Clear patientState from localStorage
              localStorage.removeItem('patientState')
            }}
            onMouseEnter={() => setHoveredButton('home')}
            onMouseLeave={() => setHoveredButton(null)}
          >
            <FiHome className="text-xl" />
            {isOpen && <span className="ml-4">Home</span>}
            {/* Tooltip */}
            {!isOpen && hoveredButton === 'home' && <Tooltip text="Home" />}
          </Link>
        </div>

        {/* User Profile */}
        <div className="p-4 border-t border-gray-700">
          <div className={`flex items-center ${!isOpen ? 'justify-center' : 'space-x-4'}`}>
            <img
              src={getProfileImageUrl(selectedPicture, role)}
              alt="Profile"
              className="h-10 w-10 rounded-full object-cover"
            />
            {isOpen && (
              <div>
                <p className="text-sm">Welcome,</p>
                <p className="text-lg font-semibold">{name}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Sidebar
