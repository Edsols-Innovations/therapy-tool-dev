import React, { useState, useEffect } from 'react'

const BASE_URL = 'http://127.0.0.1:8000'

const AdminSettingsPage: React.FC = () => {
  const [hospitalInfo, setHospitalInfo] = useState({
    name: '',
    address: '',
    contact: '',
    email: '',
    logo: ''
  })
  const [logoPreview, setLogoPreview] = useState<string | null>(null)
  const [notification, setNotification] = useState<{ type: string; message: string } | null>(null)

  const [passwords, setPasswords] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false
  })
  const [loading, setLoading] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setHospitalInfo({ ...hospitalInfo, [name]: value })
  }

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setPasswords({ ...passwords, [name]: value })
  }

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setLogoPreview(URL.createObjectURL(file))
    }
  }

  const fetchHospitalSettings = async () => {
    try {
      const response = await fetch(`${BASE_URL}/admin/settings`)
      if (!response.ok) {
        throw new Error('Failed to fetch settings')
      }

      const data = await response.json()
      console.log('Fetched settings:', data)

      setHospitalInfo({
        name: data.hospital_name || '',
        address: data.hospital_address || '',
        contact: data.contact_number || '',
        email: data.email || '',
        logo: data.logo_path || ''
      })

      if (data.logo_path) {
        setLogoPreview(`${BASE_URL}/${data.logo_path}`)
      }
    } catch (error) {
      console.error('Error fetching settings:', error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const formData = new FormData()
    formData.append('hospital_name', hospitalInfo.name)
    formData.append('hospital_address', hospitalInfo.address)
    formData.append('contact_number', hospitalInfo.contact)
    formData.append('email', hospitalInfo.email)

    const logoInput = document.querySelector<HTMLInputElement>('#logo-upload')
    if (logoInput?.files?.[0]) {
      formData.append('logo', logoInput.files[0])
    }

    try {
      const response = await fetch(`${BASE_URL}/admin/settings`, {
        method: 'PUT',
        body: formData
      })
      if (!response.ok) {
        setNotification({ type: 'error', message: 'Failed to save settings' })
        return
      }
      setNotification({ type: 'success', message: 'Settings updated successfully' })
    } catch (error) {
      console.error('Error saving settings:', error)
      setNotification({ type: 'error', message: 'An error occurred while saving settings' })
    } finally {
      setLoading(false)
    }
  }

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    if (passwords.newPassword !== passwords.confirmPassword) {
      setNotification({ type: 'error', message: 'Passwords do not match!' })
      return
    }

    try {
      const response = await fetch(`${BASE_URL}/admin/settings/password`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams({
          current_password: passwords.currentPassword,
          new_password: passwords.newPassword,
          confirm_password: passwords.confirmPassword
        })
      })
      if (!response.ok) {
        setNotification({ type: 'error', message: 'Failed to change password' })
        return
      }
      setNotification({ type: 'success', message: 'Password changed successfully' })
    } catch (error) {
      console.error('Error changing password:', error)
      setNotification({ type: 'error', message: 'An error occurred while changing the password' })
    }
  }

  useEffect(() => {
    fetchHospitalSettings()
  }, [])

  return (
    <div className="relative w-full h-screen bg-blue-200 flex items-center justify-center">
      {notification && (
        <div
          className={`fixed top-5 right-5 px-4 py-2 rounded shadow-lg text-white ${
            notification.type === 'success' ? 'bg-green-500' : 'bg-red-500'
          }`}
        >
          {notification.message}
        </div>
      )}

      <div className="w-full max-w-6xl bg-blue-100 rounded-xl shadow-md p-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Settings</h1>
        <div className="flex flex-wrap gap-6">
          {/* General Section */}
          <div className="flex-1 min-w-[300px] bg-gray-100 rounded-lg p-6 shadow-lg">
            <form onSubmit={handleSubmit}>
              <h2 className="text-lg font-semibold text-gray-800 mb-4">General</h2>
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
                      {logoPreview ? (
                        <img
                          src={logoPreview}
                          alt="Logo Preview"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-gray-400">Logo</span>
                      )}
                    </div>
                  </div>
                </div>
                <label
                  htmlFor="logo-upload"
                  className="block text-sm font-medium text-blue-600 cursor-pointer hover:underline"
                >
                  Upload Logo
                </label>
                <input
                  id="logo-upload"
                  type="file"
                  accept=".png, .jpg, .jpeg, .svg"
                  onChange={handleLogoChange}
                  className="hidden"
                />
              </div>
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-sm text-gray-600">Hospital Name</label>
                  <input
                    type="text"
                    name="name"
                    value={hospitalInfo.name}
                    onChange={handleInputChange}
                    required
                    className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600">Address</label>
                  <input
                    type="text"
                    name="address"
                    value={hospitalInfo.address}
                    onChange={handleInputChange}
                    required
                    className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600">Contact Number</label>
                  <input
                    type="text"
                    name="contact"
                    value={hospitalInfo.contact}
                    onChange={handleInputChange}
                    required
                    className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={hospitalInfo.email}
                    onChange={handleInputChange}
                    required
                    className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>
              <div className="text-right mt-6">
                <button
                  type="submit"
                  className="px-6 py-3 bg-blue-600 text-white font-medium rounded-md shadow hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  disabled={loading}
                >
                  {loading ? 'Saving...' : 'Save Settings'}
                </button>
              </div>
            </form>
          </div>

          {/* Change Password Section */}
          <div className="flex-1 min-w-[300px] bg-gray-100 rounded-lg p-6 shadow-sm">
            <form onSubmit={handleChangePassword}>
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Change Password</h2>
              <div className="space-y-4">
                {['current', 'new', 'confirm'].map((key) => (
                  <div key={key}>
                    <label className="block text-sm text-gray-600 capitalize">{`${key} Password`}</label>
                    <div className="relative">
                      <input
                        type={showPassword[key as keyof typeof showPassword] ? 'text' : 'password'}
                        name={`${key}Password`}
                        value={passwords[`${key}Password` as keyof typeof passwords]}
                        onChange={handlePasswordChange}
                        required
                        className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowPassword((prev) => ({
                            ...prev,
                            [key]: !prev[key as keyof typeof showPassword]
                          }))
                        }
                        className="absolute right-3 top-4 text-gray-500 focus:outline-none"
                      >
                        {showPassword[key as keyof typeof showPassword] ? 'Hide' : 'Show'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              <div className="text-right mt-6">
                <button
                  type="submit"
                  className="px-6 py-3 bg-blue-600 text-white font-medium rounded-md shadow hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                >
                  Change Password
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminSettingsPage
