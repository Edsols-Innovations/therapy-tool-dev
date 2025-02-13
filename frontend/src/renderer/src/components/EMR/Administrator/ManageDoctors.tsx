import { Upload, Trash, Edit, Trash2, UserCircle } from 'lucide-react'
import { useState, useEffect } from 'react'

interface Doctor {
  id: string
  doctor_name: string
  specialization: string
  username: string
  password?: string // Password for adding/updating
}

const ManageDoctors: React.FC = () => {
  const [doctors, setDoctors] = useState<Doctor[]>([]) // Array of doctors
  const [username, setUsername] = useState('')
  const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(null)
  const [editingDoctor, setEditingDoctor] = useState<Doctor | null>(null) // Doctor being edited
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [notification, setNotification] = useState<{
    message: string
    type: 'success' | 'error'
  } | null>(null)

  const showNotification = (message: string, type: 'success' | 'error') => {
    setNotification({ message, type })
    setTimeout(() => setNotification(null), 3000) // Hide after 3 seconds
  }

  // Fetch all doctors from the API
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/api/doctors')
        if (!response.ok) {
          throw new Error(`Failed to fetch doctors: ${response.statusText}`)
        }
        const data = await response.json()
        setDoctors(data)
      } catch (error) {
        console.error('Error fetching doctors:', error)
      }
    }

    fetchDoctors()
  }, [])

  // Check username availability
  const checkUsernameAvailability = async (username: string) => {
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/doctors/check-username?username=${username}`
      )
      if (!response.ok) {
        throw new Error('Failed to check username availability')
      }
      const data = await response.json()
      setUsernameAvailable(data.available)
    } catch (error) {
      console.error('Error checking username availability:', error)
      setUsernameAvailable(null)
    }
  }

  // Function to handle adding or updating a doctor
  const handleAddOrUpdateDoctor = async (doctor) => {
    try {
      const url = editingDoctor
        ? `http://127.0.0.1:8000/api/doctors/${editingDoctor.id}`
        : 'http://127.0.0.1:8000/api/doctors'
      const method = editingDoctor ? 'PUT' : 'POST'

      const formData = new FormData()
      formData.append('doctor_name', doctor.doctor_name)
      formData.append('specialization', doctor.specialization)
      formData.append('username', doctor.username)
      if (doctor.password) formData.append('password', doctor.password)
      if (imageFile) formData.append('file', imageFile)

      const response = await fetch(url, {
        method,
        body: formData
      })

      if (!response.ok) {
        const errorData = await response.json()
        showNotification(errorData.detail || 'Failed to save doctor', 'error')
        return
      }

      showNotification('Doctor saved successfully', 'success')

      const updatedDoctor = await response.json()

      if (editingDoctor) {
        setDoctors((prevDoctors) =>
          prevDoctors.map((d) => (d.id === editingDoctor.id ? updatedDoctor : d))
        )
      } else {
        setDoctors((prevDoctors) => [...prevDoctors, updatedDoctor])
      }

      setEditingDoctor(null)
      setImageFile(null)
      setImagePreview(null)
    } catch (error) {
      console.error('Error saving doctor:', error)
    }
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0]
      setImageFile(file)

      // Create preview URL
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  // Function to handle deleting a doctor
  const handleDeleteDoctor = async (id: string) => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/doctors/${id}`, {
        method: 'DELETE'
      })

      if (!response.ok) {
        showNotification('Failed to delete doctor', 'error')
        return
      }

      showNotification('Doctor deleted successfully', 'success')

      setDoctors((prevDoctors) => prevDoctors.filter((doctor) => doctor.id !== id))
    } catch (error) {
      console.error('Error deleting doctor:', error)
    }
  }

  // Function to reset the form for a new doctor
  const handleCancelEdit = () => {
    setEditingDoctor(null)
  }

  return (
    <div className="relative container mx-auto p-8">
      {notification && (
        <div
          className={`fixed top-4 right-4 px-4 py-2 rounded shadow-lg text-white ${
            notification.type === 'success' ? 'bg-green-500' : 'bg-red-500'
          }`}
        >
          {notification.message}
        </div>
      )}

      <h2 className="text-3xl font-semibold mb-6 text-gray-900">
        {editingDoctor ? 'Edit Doctor' : 'Add New Doctor'}
      </h2>

      {/* Doctor Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault()
          const form = e.target as HTMLFormElement

          const nameInput = form.elements.namedItem('doctor_name') as HTMLInputElement
          const specializationInput = form.elements.namedItem('specialization') as HTMLInputElement
          const usernameInput = form.elements.namedItem('username') as HTMLInputElement
          const passwordInput = form.elements.namedItem('password') as HTMLInputElement

          handleAddOrUpdateDoctor({
            id: editingDoctor ? editingDoctor.id : '',
            doctor_name: nameInput.value,
            specialization: specializationInput.value,
            username: usernameInput.value,
            password: passwordInput.value
          })

          form.reset() // Reset the form after submission
        }}
        className="p-6 bg-white/70 backdrop-blur-md shadow-md rounded-lg shadow-lg"
      >
        <div className="mb-5">
          <label className="block text-sm font-semibold text-gray-800 mb-2">Name</label>
          <input
            type="text"
            name="doctor_name"
            defaultValue={editingDoctor?.doctor_name || ''}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            required
          />
        </div>

        <div className="mb-5">
          <label className="block text-sm font-semibold text-gray-800 mb-2">Specialization</label>
          <input
            type="text"
            name="specialization"
            defaultValue={editingDoctor?.specialization || ''}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            required
          />
        </div>

        <div className="mb-5">
          <label className="block text-sm font-semibold text-gray-800 mb-2">Username</label>
          <input
            type="text"
            name="username" // Corrected name attribute
            defaultValue={editingDoctor?.username || ''}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            required
            onChange={(e) => {
              setUsername(e.target.value)
              checkUsernameAvailability(e.target.value)
            }}
          />
          {username && (
            <p
              className={`mt-2 text-sm ${
                usernameAvailable === null
                  ? 'text-gray-500'
                  : usernameAvailable
                    ? 'text-green-600'
                    : 'text-red-600'
              }`}
            >
              {usernameAvailable === null
                ? 'Checking username availability...'
                : usernameAvailable
                  ? 'Username is available'
                  : 'Username is taken'}
            </p>
          )}
        </div>

        <div className="mb-5">
          <label className="block text-sm font-semibold text-gray-800 mb-2">Password</label>
          <input
            type="password"
            name="password"
            defaultValue={editingDoctor?.password || ''}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
            required
          />
        </div>

        <div className="mb-8">
          <label className="block text-sm font-medium text-gray-700">Doctor Image:</label>
          <div className="relative border-2 border-dashed border-gray-300 rounded-lg p-6 text-center flex flex-col items-center justify-center bg-gray-50 hover:bg-gray-100 transition">
            <Upload className="w-10 h-10 text-gray-400 mb-2" />
            <p className="text-sm text-gray-600">Click or Drag & Drop an image here</p>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
          </div>

          {imagePreview && (
            <div className="flex items-center space-x-4 mt-4 p-3 bg-white shadow-md rounded-lg">
              <img src={imagePreview} alt="Doctor" className="h-24 w-24 object-cover rounded-lg shadow-sm" />
              <button
                onClick={() => {
                  setImageFile(null)
                  setImagePreview(null)
                }}
                className="flex items-center space-x-2 text-sm text-red-600 hover:text-red-700 transition"
              >
                <Trash className="w-4 h-4" />
                <span>Remove Image</span>
              </button>
            </div>
          )}
        </div>

        <div className="flex justify-end space-x-4">
          <button
            type="submit"
            className="px-6 py-2 text-white bg-blue-600 rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            {editingDoctor ? 'Update Doctor' : 'Create Doctor'}
          </button>
          {editingDoctor && (
            <button
              type="button"
              onClick={handleCancelEdit}
              className="px-6 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-300"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      {/* Doctor List */}
      <h2 className="text-3xl font-semibold mt-8 mb-6 text-gray-900 flex items-center space-x-2">
        <UserCircle className="w-8 h-8 text-blue-600" /> <span>Doctors List</span>
      </h2>

      {doctors.length > 0 ? (
        <div className="bg-white bg-opacity-70 backdrop-blur-lg shadow-xl rounded-xl overflow-hidden">
          {/* Table-like List Header */}
          <div className="grid grid-cols-4 gap-4 px-6 py-4 bg-gray-100 border-b border-gray-200 font-semibold text-gray-700">
            <div className="flex justify-start">Name</div>
            <div className="flex justify-start">Specialization</div>
            <div className="flex justify-end col-span-2">Actions</div> {/* Adjusted for equal spacing */}
          </div>

          {/* List Items */}
          <div className="divide-y divide-gray-200">
            {doctors.map((doctor) => (
              <div
                key={doctor.id}
                className="grid grid-cols-4 gap-4 px-6 py-4 items-center hover:bg-gray-50 transition-all duration-200"
              >
                {/* Doctor Name */}
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-blue-100 text-blue-500 flex items-center justify-center rounded-full text-lg font-bold shadow-sm">
                    {doctor.doctor_name.charAt(0)} 
                  </div>
                  <span className="text-gray-900 font-medium">{doctor.doctor_name}</span>
                </div>

                {/* Specialization */}
                <div className="text-gray-700">{doctor.specialization}</div>

                {/* Actions */}
                <div className="flex justify-end space-x-4 col-span-2"> {/* Adjusted for equal spacing */}
                  <button
                    onClick={() => setEditingDoctor(doctor)}
                    className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 hover:shadow-lg transition-all focus:outline-none focus:ring-2 focus:ring-blue-300"
                  >
                    <Edit className="w-5 h-5" />
                    <span>Edit</span>
                  </button>

                  <button
                    onClick={() => handleDeleteDoctor(doctor.id)}
                    className="flex items-center space-x-2 px-4 py-2 bg-red-500 text-white rounded-lg shadow-md hover:bg-red-600 hover:shadow-lg transition-all focus:outline-none focus:ring-2 focus:ring-red-300"
                  >
                    <Trash2 className="w-5 h-5" />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <p className="text-gray-600 mt-6 text-center text-lg">No doctors available. Please add a new doctor.</p>
      )}
    </div>
  )
}

export default ManageDoctors
