import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelectedModules  } from "../../SelectedDataContext";

const BASE_URL = 'http://127.0.0.1:8000'

export const Notification = ({ message, type }) => {
  if (!message) return null

  const bgColor = type === 'success' ? 'bg-green-500' : 'bg-red-500'

  return (
    <div
      className={`fixed bottom-4 left-1/2 transform -translate-x-1/2 p-4 text-white rounded-lg shadow-lg ${bgColor}`}
    >
      {message}
    </div>
  )
}

const Therapyware = () => {
  const [notification, setNotification] = useState({ message: '', type: '' })

  const [selectedOptions, setSelectedOptions] = useState({
    visualGames: false,
    listeningStudio: false,
    readingLab: false,
    pictorialSoundExercise: false,
    animatedFlashConcepts: false
  })
  const { setSelectedModules  } = useSelectedModules ();
  const [selectedSubModules, setSelectedSubModules] = useState({
    module1: { subModule1: false, subModule2: false, subModule3: false, subModule4: false },
    module2: { subModule1: false, subModule2: false }
  })

  const [expandedModules, setExpandedModules] = useState({
    visualGames: false,
    module1: false,
    module2: false
  })

  const navigate = useNavigate()
  const [recommendedModules, setRecommendedModules] = useState<string[]>([]);

  useEffect(() => {
    
    const fetchTherapyRecommendations = async () => {
      const patientState = localStorage.getItem('patientState');

      if (!patientState) {
        // setNotification({ message: 'Patient state not found in localStorage.', type: 'error' });
        return;
      }

      let patientId;
      try {
        patientId = JSON.parse(patientState).id;
        if (!patientId || isNaN(patientId)) {
          throw new Error('Invalid patient ID');
        }
      } catch (error) {
        console.error('Error parsing patient state:', error);
        setNotification({ message: 'Failed to retrieve patient ID.', type: 'error' });
        return;
      }

      try {
        // **Fetch therapy recommendations from the backend**
        const response = await fetch(`${BASE_URL}/language/recommend/${patientId}`);
        if (response.ok) {
          const data = await response.json();
          console.log('Fetched Therapy Recommendations:', data);

          setRecommendedModules(data.recommendations || []);
        } else {
          const errorData = await response.json();
          console.error('Error fetching recommendations:', errorData.detail || 'Unknown error');
          // setNotification({
            // message: `Failed to fetch recommendations: ${errorData.detail || 'Unknown error'}`,
            // type: 'error'
          // });
        }
      } catch (error) {
        console.error('Error fetching therapy recommendations:', error);
        setNotification({
          message: 'An error occurred while fetching recommendations. Please try again.',
          type: 'error'
        });
      }
    };
    fetchTherapyRecommendations();
    const fetchTherapyData = async () => {
      const patientState = localStorage.getItem('patientState')

      if (!patientState) {
        // setNotification({ message: 'Patient state not found in localStorage.', type: 'error' })
        return
      }

      let patientId
      try {
        patientId = JSON.parse(patientState).id
        if (!patientId || isNaN(patientId)) {
          throw new Error('Invalid patient ID')
        }
      } catch (error) {
        console.error('Error parsing patient state:', error)
        setNotification({ message: 'Failed to retrieve patient ID.', type: 'error' })
        return
      }

      try {
        const response = await fetch(`${BASE_URL}/therapyware/${patientId}`)
        if (response.ok) {
          const data = await response.json()

          // Update state with fetched data
          setSelectedOptions({
            visualGames: data.visual_games,
            listeningStudio: data.listening_studio,
            readingLab: data.reading_lab,
            pictorialSoundExercise: data.pictorial_sound_exercise,
            animatedFlashConcepts: data.animated_flash_concepts
          })
          setSelectedSubModules({
            module1: {
              subModule1: data.module1_submodule1,
              subModule2: data.module1_submodule2,
              subModule3: data.module1_submodule3,
              subModule4: data.module1_submodule4
            },
            module2: {
              subModule1: data.module2_submodule1,
              subModule2: data.module2_submodule2
            }
          })
        } else {
          const errorData = await response.json()
          console.error('Error fetching therapy data:', errorData.detail || 'Unknown error')
          // setNotification({
          //   message: `Failed to fetch therapy data: ${errorData.detail || 'Unknown error'}`,
          //   type: 'error'
          // })
        }
      } catch (error) {
        console.error('Error fetching therapy data:', error)
        setNotification({
          message: 'An error occurred while fetching the therapy data. Please try again.',
          type: 'error'
        })
      }
    }

    fetchTherapyData()
  }, [])

  const handleParentCheckboxChange = (option: string) => {
    const isSelected = !selectedOptions[option]

    if (option === 'visualGames') {
      setSelectedOptions((prevState) => ({
        ...prevState,
        visualGames: isSelected
      }))
      setSelectedSubModules({
        module1: {
          subModule1: isSelected,
          subModule2: isSelected,
          subModule3: isSelected,
          subModule4: isSelected
        },
        module2: { subModule1: isSelected, subModule2: isSelected }
      })
      setExpandedModules((prevState) => ({
        ...prevState,
        visualGames: isSelected,
        module1: isSelected,
        module2: isSelected
      }))
    } else {
      setSelectedOptions((prevState) => ({
        ...prevState,
        [option]: isSelected
      }))
    }
  }

  const handleSubModuleChange = (module: string, subModule: string) => {
    setSelectedSubModules((prevState) => ({
      ...prevState,
      [module]: {
        ...prevState[module],
        [subModule]: !prevState[module][subModule]
      }
    }))
  }

  const toggleDropdown = (module: string) => {
    setExpandedModules((prevState) => ({
      ...prevState,
      [module]: !prevState[module]
    }))
  }

  const handleGoToTherapyware = async () => {
    const patientState = localStorage.getItem('patientState');
    let patientId = null;

    if (patientState) {
        try {
            patientId = JSON.parse(patientState).id;
            if (!patientId || isNaN(patientId)) {
                throw new Error('Invalid patient ID');
            }
        } catch (error) {
            console.error('Error parsing patient state:', error);
            setNotification({ message: 'Failed to retrieve patient ID.', type: 'error' });
        }
    }

    const selectedData = {
        patient_id: patientId ? parseInt(patientId, 10) : null, // Handle missing patient ID
        visual_games: selectedOptions.visualGames,
        module1_submodule1: selectedSubModules.module1.subModule1,
        module1_submodule2: selectedSubModules.module1.subModule2,
        module1_submodule3: selectedSubModules.module1.subModule3,
        module1_submodule4: selectedSubModules.module1.subModule4,
        module2_submodule1: selectedSubModules.module2.subModule1,
        module2_submodule2: selectedSubModules.module2.subModule2,
        listening_studio: selectedOptions.listeningStudio,
        reading_lab: selectedOptions.readingLab,
        pictorial_sound_exercise: selectedOptions.pictorialSoundExercise,
        animated_flash_concepts: selectedOptions.animatedFlashConcepts
    };

    const selectedmod = {
        selectedOptions,
        selectedSubModules,
    };

    // Attempt to save to API **only if patientState exists**
    if (patientId) {
        try {
            const response = await fetch(`${BASE_URL}/therapyware/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(selectedData)
            });

            if (response.ok) {
                setNotification({ message: 'Therapyware data saved successfully!', type: 'success' });
            } else {
                const errorData = await response.json();
                console.error('Server error:', errorData);
                setNotification({
                    message: `Error: ${errorData.detail || 'Unknown error occurred.'}`,
                    type: 'error'
                });
            }
        } catch (error) {
            console.error('Error saving therapyware data:', error);
            setNotification({
                message: 'An error occurred while saving the data. Please try again.',
                type: 'error'
            });
        }
    }

    // **Always navigate to home, even if API call fails or patient state is missing**
    setSelectedModules(selectedmod);
    navigate('/home', { state: selectedmod });
};

  return (
    <div className="min-h-screen bg-blue-200 flex flex-col items-center py-10">
      <h1 className="text-4xl font-bold mb-8 text-gray-800">Therapy Module Selection</h1>
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-4xl">
        {/* Visual Games Section */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <input
                type="checkbox"
                checked={selectedOptions.visualGames}
                onChange={() => handleParentCheckboxChange('visualGames')}
                className="h-5 w-5"
              />
              <label className="text-xl font-semibold">Visual Games</label>
            </div>
            <button
              onClick={() => toggleDropdown('visualGames')}
              className="text-gray-600 text-lg transform transition-transform duration-200"
            >
              {expandedModules.visualGames ? '⮟' : '⮞'}
            </button>
          </div>
          {expandedModules.visualGames && (
            <div className="ml-8 mt-4">
              {/* Module 1 */}
              <div className="mb-4">
                <div className="flex items-center justify-between">
                  <span className="text-lg font-medium ml-1">Module 1</span>
                  <button
                    onClick={() => toggleDropdown('module1')}
                    className="text-gray-600 text-lg transform transition-transform duration-200"
                  >
                    {expandedModules.module1 ? '⮟' : '⮞'}
                  </button>
                </div>
                {expandedModules.module1 && (
                  <div className="ml-6 mt-2">
                    <label className="flex items-center text-md mb-2">
                      <input
                        type="checkbox"
                        checked={selectedSubModules.module1.subModule1}
                        onChange={() => handleSubModuleChange('module1', 'subModule1')}
                        className="mr-3 h-4 w-4"
                      />
                      Voice Play
                    </label>
                    <label className="flex items-center text-md mb-2">
                      <input
                        type="checkbox"
                        checked={selectedSubModules.module1.subModule2}
                        onChange={() => handleSubModuleChange('module1', 'subModule2')}
                        className="mr-3 h-4 w-4"
                      />
                      Talk Splash
                    </label>
                    <label className="flex items-center text-md mb-2">
                      <input
                        type="checkbox"
                        checked={selectedSubModules.module1.subModule3}
                        onChange={() => handleSubModuleChange('module1', 'subModule3')}
                        className="mr-3 h-4 w-4"
                      />
                      Bird Voice
                    </label>
                    <label className="flex items-center text-md">
                      <input
                        type="checkbox"
                        checked={selectedSubModules.module1.subModule4}
                        onChange={() => handleSubModuleChange('module1', 'subModule4')}
                        className="mr-3 h-4 w-4"
                      />
                      Enlarging Circle
                    </label>
                  </div>
                )}
              </div>

              {/* Module 2 */}
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-medium">Module 2</span>
                  <button
                    onClick={() => toggleDropdown('module2')}
                    className="text-gray-600 text-lg transform transition-transform duration-200"
                  >
                    {expandedModules.module2 ? '⮟' : '⮞'}
                  </button>
                </div>
                {expandedModules.module2 && (
                  <div className="ml-6 mt-2">
                    <label className="flex items-center text-md mb-2">
                      <input
                        type="checkbox"
                        checked={selectedSubModules.module2.subModule1}
                        onChange={() => handleSubModuleChange('module2', 'subModule1')}
                        className="mr-3 h-4 w-4"
                      />
                      Speech Flight
                    </label>
                    <label className="flex items-center text-md">
                      <input
                        type="checkbox"
                        checked={selectedSubModules.module2.subModule2}
                        onChange={() => handleSubModuleChange('module2', 'subModule2')}
                        className="mr-3 h-4 w-4"
                      />
                      Talk Duckling
                    </label>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Other Sections */}
        {['listeningStudio', 'readingLab', 'pictorialSoundExercise', 'animatedFlashConcepts'].map(
          (option) => (
            <div className="mb-6" key={option}>
              <label className="flex items-center text-xl font-semibold space-x-4">
                <input
                  type="checkbox"
                  checked={selectedOptions[option]}
                  onChange={() => handleParentCheckboxChange(option)}
                  className="h-5 w-5"
                />
                <span>
                  {option.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase())}
                </span>
              </label>
            </div>
          )
        )}
        {/* Button */}
        <div className="flex justify-between">
        <button
            onClick={handleGoToTherapyware}
            className="px-6 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700"
          >
            Go to Therapyware
          </button>
          <button
            onClick={() => navigate('/patientlist')}
            className="px-6 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-gray-500 transition-all"
          >
            Back
          </button>
          
        </div>
      </div>
      <Notification message={notification.message} type={notification.type} />
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-4xl mt-5">

      {/* White Box to Show Recommendations */}
      <div className="bg-white p-6 rounded-lg w-full max-w-3xl text-start">
        <h2 className="text-2xl font-semibold mb-4 text-indigo-700">Recommended Therapy Modules</h2>
        {recommendedModules.length > 0 ? (
          <ul className="text-lg text-black space-y-3 w-max">
            {recommendedModules.map((module, index) => (
              <li key={index} className="p-2">{module}</li>
            ))}
          </ul>
        ) : (
          <p className="text-lg text-gray-600">No recommendations available.</p>
        )}
      </div>

      <Notification message={notification.message} type={notification.type} />
    </div>
    </div>
  )
}

export default Therapyware
