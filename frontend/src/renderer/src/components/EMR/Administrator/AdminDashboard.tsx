import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import ManageDoctors from './ManageDoctors'
import ManageTherapists from './ManageTherapists'
import ManagePatients from './ManagePatients'
import AdminSettings from './AdminSettings'
import {
  FiSettings,
  FiLogOut,
  FiUserCheck,
  FiUser,
  FiUsers,
  FiMenu,
  FiChevronLeft
} from 'react-icons/fi'
import edsolsLogo from '../../../assets/EMR/edsols.png'

const BASE_URL = 'http://127.0.0.1:8000'

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState<'doctors' | 'therapists' | 'patients' | 'settings'>(
    'doctors'
  )
  const [isOpen, setIsOpen] = useState(true) // For desktop view
  const [hoveredButton, setHoveredButton] = useState<string | null>(null) // Track the hovered item for tooltips
  const [companyLogo, setCompanyLogo] = useState<string | null>(null)

  const navigate = useNavigate() // For navigation

  const handleLogout = () => {
    // Clear any session-related data (if applicable)
    localStorage.clear() // Example: clearing localStorage
    sessionStorage.clear() // Example: clearing sessionStorage

    // Redirect to the root page ("/"), which should load Login.tsx
    navigate('/')
  }

  const renderActiveTab = () => {
    if (activeTab === 'doctors') return <ManageDoctors />
    if (activeTab === 'therapists') return <ManageTherapists />
    if (activeTab === 'patients') return <ManagePatients />
    if (activeTab === 'settings') return <AdminSettings />
    return null
  }

  const menu = [
    { id: 'doctors', label: 'Manage Doctors', icon: <FiUserCheck /> },
    { id: 'therapists', label: 'Manage Therapists', icon: <FiUser /> },
    { id: 'patients', label: 'Manage Patient Data', icon: <FiUsers /> }
  ]

  const toggleSidebar = () => setIsOpen(!isOpen)

  // Tooltip component
  const Tooltip = ({ text }: { text: string }) => (
    <div className="absolute left-full top-1/2 transform -translate-y-1/2 ml-2 bg-gray-800 text-white text-sm px-2 py-1 rounded shadow-lg z-50 whitespace-nowrap">
      {text}
    </div>
  )

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
    fetchLogo()
  })

  return (
    <div className="flex text-nowrap h-screen relative">
      {/* Desktop Sidebar */}
      <div
        className={`bg-gray-900 text-white h-screen ${
          isOpen ? 'w-64' : 'w-20'
        } transition-all duration-300 hidden md:flex flex-col`}
      >
        {/* Sidebar Header */}
        <div className={`flex items-center ${isOpen ? 'justify-between' : 'justify-center'} p-4`}>
          {isOpen && (
            <div className="flex items-center justify-center p-4">
              <div className="flex items-center space-x-4">
                {companyLogo ? (
                  <img src={companyLogo} alt="Company Logo" className="h-10 object-contain" />
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

        {/* Menu Items */}
        <nav className="flex-1 relative">
          <ul className="py-4">
            {menu.map((item) => (
              <li key={item.id} className="relative">
                <button
                  onClick={() => setActiveTab(item.id as typeof activeTab)}
                  className={`flex items-center w-full px-4 py-4 text-left  transition-colors ${
                    activeTab === item.id ? 'bg-gray-800' : ''
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

        {/* Sidebar Footer: Settings and Logout */}
        <div className="p-4 border-t border-gray-700">
          <button
            onClick={() => setActiveTab('settings' as typeof activeTab)}
            className={`relative flex items-center w-full px-2 py-2 mb-4 text-left hover:bg-gray-800 transition-colors rounded-lg ${
              !isOpen && 'justify-center'
            }`}
            onMouseEnter={() => setHoveredButton('settings')}
            onMouseLeave={() => setHoveredButton(null)}
          >
            <FiSettings className="text-xl" />
            {isOpen && <span className="ml-4">Settings</span>}
            {!isOpen && hoveredButton === 'settings' && <Tooltip text="Settings" />}
          </button>
          <button
            onClick={handleLogout} // Logout handler
            className={`relative flex items-center w-full px-2 py-2 text-left hover:bg-gray-800 transition-colors rounded-lg ${
              !isOpen && 'justify-center'
            }`}
            onMouseEnter={() => setHoveredButton('logout')}
            onMouseLeave={() => setHoveredButton(null)}
          >
            <FiLogOut className="text-xl" />
            {isOpen && <span className="ml-4">Logout</span>}
            {!isOpen && hoveredButton === 'logout' && <Tooltip text="Logout" />}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 bg-blue-200 overflow-y-auto">{renderActiveTab()}</div>
    </div>
  )
}

export default AdminDashboard
