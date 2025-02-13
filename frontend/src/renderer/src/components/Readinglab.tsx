import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlay, faPlus } from '@fortawesome/free-solid-svg-icons'

import design from '../assets/ReadingLab/design1.png'
import plants from '../assets/ReadingLab/plant.png'
import bottomPerson from '../assets/ReadingLab/person1.png'
import logo from '../assets/ReadingLab/edsols.png'
import topPerson from '../assets/ReadingLab/person2.png'
import fnDesign from '../assets/ReadingLab/fontdesign.png'
import add from '../assets/ReadingLab/plus.png'

import ask from '../assets/ReadingLab/ask.png'
import proverbs from '../assets/ReadingLab/proverbs.png'
import rhymes from '../assets/ReadingLab/rhymes.png'
import limericks from '../assets/ReadingLab/limericks.png'
import words from '../assets/ReadingLab/words.png'
import tongue from '../assets/ReadingLab/tonguetwisters.png'

import home from '../assets/ReadingLab/home.png'

const Readinglab = () => {
  const navigate = useNavigate()

  const [selectedLines, setSelectedLines] = useState<string[]>([])
  const [selectedOption, setSelectedOption] = useState<string>('')
  const [selectedOption2, setSelectedOption2] = useState<string>('Words')
  const [fileContent, setFileContent] = useState<string[]>([])
  const [speed, setSpeed] = useState(0)
  const [isFormVisible, setIsFormVisible] = useState<boolean>(false)
  const [isDelete, setIsDelete] = useState<boolean>(false)
  const [newText, setNewText] = useState<string>('')
  const [errorMessage, setErrorMessage] = useState<string>('') // For handling error messages

  interface Option {
    name: string
    img: string
    fileName: string
  }

  const options: Option[] = [
    {
      name: 'Words',
      img: words,
      fileName: 'words.txt'
    },
    {
      name: 'Verbs & Adjectives',
      img: ask,
      fileName: 'Verbs%20&%20Adjectives.txt'
    },
    {
      name: 'Rhymes',
      img: rhymes,
      fileName: 'Rhymes.txt'
    },
    {
      name: 'Limericks',
      img: limericks,
      fileName: 'Limericks.txt'
    },
    {
      name: 'Tongue Twisters',
      img: tongue,
      fileName: 'Tongue%20Twisters.txt'
    },
    {
      name: 'Ask & Know',
      img: ask,
      fileName: 'Ask%20&%20Know.txt'
    },
    {
      name: 'Proverbs',
      img: proverbs,
      fileName: 'Proverbs.txt'
    }
  ]

  const selectOptions = [
    'Words',
    'Verbs & Adjectives',
    'Rhymes',
    'Limericks',
    'Tongue Twisters',
    'Ask & Know',
    'Proverbs'
  ]

  const toggleLineSelection = (line: string) => {
    setSelectedLines((prevSelectedLines) =>
      prevSelectedLines.includes(line)
        ? prevSelectedLines.filter((item) => item !== line)
        : [...prevSelectedLines, line]
    )
  }

  const handleClearSelection = () => {
    setSelectedLines([])
  }

  const handleAddText = () => {
    if (!selectedOption2) {
      alert('Please select a section')
      return
    }

    // Create FormData object
    const formData = new FormData()
    formData.append('file', new Blob([newText], { type: 'text/plain' }), 'text.txt')

    // Make the fetch request
    fetch(`http://localhost:8000/therapyware/append/${selectedOption2}.txt`, {
      method: 'POST',
      body: formData
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Error appending text: ${response.statusText}`)
        }
        return response.json()
      })
      .then((result) => {
        console.log(result.message)
        setNewText('') // Clear the text area
      })
      .catch((error) => {
        console.error('Error appending text:', error)
      })
  }

  const handleSubmit = (event: { preventDefault: () => void }) => {
    event.preventDefault()
    handleAddText()
  }

  const handleOptionClick = (option: Option) => {
    setSelectedOption(option.name)
    setIsFormVisible(false) // Hide form when an option is selected

    fetch(`http://localhost:8000/therapyware/fetch/${option.fileName}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok')
        }
        return response
      })
      .then((response) => response.json()) // Parse the response as JSON
      .then((data) => {
        console.log('Fetched data:', data)
        // Extract the 'content' field from the JSON response
        const text = data.content
        const lines = text
          .split('\n')
          .map((line: string) => line.trim())
          .filter((line: string | any[]) => line.length > 0)
        setFileContent(lines)
      })
      .catch((error) => {
        console.error('Error fetching the file:', error)
        setFileContent([])
      })
  }

  const setDelete = () => {
    if (selectedLines.length === 0) {
      return
    } else {
      setIsDelete(true)
    }
  }

  const cancelDelete = () => {
    setIsDelete(false)
  }
  

  const handleDeleteText = async () => {
    try {
      if (selectedLines.length === 0) {
        alert('Please select lines to delete');
        return;
      }
  
      const selectedText = selectedLines.join('\n'); // Combine selected lines into a single string
      console.log(`Selected text to delete: ${selectedText}`); // Debug log
  
      const selectedOption = options.find((opt) => opt.name === selectedOption2);
  
      if (!selectedOption) {
        console.error("Selected option not found for deletion.");
        alert("The selected option does not exist. Please select a valid option.");
        return;
      }
  
      const response = await fetch('http://localhost:8000/therapyware/delete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ selected_text: selectedText }),
      });
  
      if (response.ok) {
        const result = await response.json();
        console.log(result.message);
  
        setIsDelete(false); // Close delete confirmation
        setSelectedLines([]); // Clear selected lines
  
        // Refresh the content after deletion
        handleOptionClick(selectedOption);
      } else {
        const errorResponse = await response.json();
        console.error(`Error: ${errorResponse.detail || 'Unknown error occurred'}`);
        alert(`Error: ${errorResponse.detail || 'Unknown error occurred'}`);
      }
    } catch (error) {
      console.error('Error deleting text:', error);
      alert('An unexpected error occurred while deleting text.');
    }
  };
  

  const handlePlayButtonClick = () => {
    const combinedLines = [...selectedLines, newText].filter(Boolean)
    console.log('Combined Lines:', combinedLines)
    console.log('Speed:', speed)

    navigate('/readinglabplay', {
      state: { lines: combinedLines, speed }
    })
  }

  const handleChange = (e: { target: { value: string } }) => {
    const input = e.target.value

    // Allow clearing the input (empty string) to prevent blocking backspace
    if (input === '') {
      setSpeed(0)
      setErrorMessage('') // Clear error when input is cleared
      return
    }

    // Check if input is a valid number
    const number = parseInt(input, 10)
    if (!isNaN(number)) {
      if (number >= 1 && number <= 100) {
        setSpeed(number)
        setErrorMessage('') // Clear error for valid input
      } else {
        setErrorMessage('Speed must be between 1 and 100.') // Show error for out-of-range input
      }
    } else {
      setErrorMessage('Enter a valid number.') // Show error for non-numeric input
    }
  }

  const handleAddTextClick = () => {
    setIsFormVisible(true) // Show the form when Add Text is clicked
    setFileContent([]) // Clear file content when form is shown
    setSelectedOption('Add Text') // Set selected option to "Add Text"
  }

  return (
    <div className="flex md:flex-row flex-col w-screen md:h-screen h-[140vh] bg-pink-300">
      <div className="absolute right-0 top-10">
        <img src={plants} alt="Background Design" className="w-[0px] md:w-[400px]" />
      </div>
      <div className="absolute -bottom-48 md:bottom-0 ">
        <img src={design} alt="Background Design" className="w-[500px]" />
      </div>
      <div className="absolute -bottom-48 md:bottom-0 right-0 ">
        <img src={bottomPerson} alt="Background Design" className="" />
      </div>
      <div className="absolute p-4 -bottom-48 md:bottom-0 right-0">
        <img src={logo} alt="Background Design" className="w-[50px]" />
      </div>

      {/* Main content */}
      <div className="z-10 flex md:flex-col w-full h-max md:w-[4.5%] md:h-max bg-pink-400 md:rounded-br-3xl py-4 gap-5 items-center justify-center md:justify-between">
        <Link to="/home" className="w-[30px] md:w-[70%] rounded-full">
          <img src={home} alt="home" className="rounded-full" />
        </Link>
      </div>
      <div className="z-10 flex flex-col w-full md:w-[95.5%] h-full rounded-br-3xl">
        {/* Header */}
        <div className="flex ml-10 mt-3 h-[13vh] md:justify-start justify-between">
          <div className="flex w-2/3">
            <div className="flex md:w-max w-full">
              <div className="">
                <img src={fnDesign} alt="" className="w-[40px] md:w-[60px]" />
              </div>
              <div className="flex flex-wrap items-center w-max -ml-4 mt-4 md:text-5xl text-3xl font-bold">
                <div>Reading Laboratory</div>
              </div>
            </div>
            <div className="flex items-end">
              <img src={topPerson} alt="" className="h-[0px] md:h-[100px]" />
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="flex md:flex-row flex-col h-[87vh] w-full">
          {/* Options sidebar */}
          <div className="flex md:w-5/6 w-full h-full px-2  md:px-10 pb-4">
            <div className="flex h-[100%] w-full bg-white md:rounded-3xl overflow-hidden">
              <div className="flex flex-col h-full w-max md:w-1/4 md:rounded-3xl  bg-pink-100">
                {' '}
                {/*justify-between removed*/}
                {options.map((option, index) => (
                  <button
                    key={option.name}
                    className={`flex items-center justify-between gap-1 p-2 md:p-4 ${
                      selectedOption === option.name
                        ? 'bg-white text-pink-600 font-bold'
                        : 'bg-pink-100 text-gray-800'
                    }  ${index === 0 ? 'md:rounded-tl-3xl' : ''} 
                     hover:bg-white hover:text-pink-600 transition-all`}
                    onClick={() => handleOptionClick(option)}
                  >
                    <div className="lg:text-xl md:text-md sm:text-md text-xs text-left h-max hidden sm:block truncate">
                      {option.name}
                    </div>
                    <img src={option.img} alt={option.name} className="w-[50px]" />
                  </button>
                ))}
                <div className="p-2 px-4 h-[80px]">
                  <button
                    className="flex gap-3 h-full w-full hover:bg-pink-300 transition-all bg-pink-400 hover:text-pink-700 text-xl rounded-md items-center justify-center"
                    onClick={handleAddTextClick}
                  >
                    <img className="h-[40px] opacity-50" src={add} alt="" />
                    Add Text
                  </button>
                </div>
              </div>
              <div className="flex flex-col h-full w-3/4 gap-2 p-2 overflow-y-auto">
                {isFormVisible && (
                  <form className="flex flex-col gap-5 mb-4 p-5 h-full">
                    <textarea
                      placeholder="Enter text"
                      className="border border-gray-300 rounded p-2 text-wrap"
                      value={newText}
                      onChange={(e) => setNewText(e.target.value)}
                    />
                    <div className="flex gap-10  items-center h-1/6">
                      <div className="flex gap-5 items-center ">
                        <label htmlFor="option">Choose section:</label>

                        <select
                          name="option"
                          className="rounded-full border-[1px] p-2"
                          onChange={(e) => setSelectedOption2(e.target.value)}
                          value={selectedOption2}
                        >
                          {selectOptions.map((option) => (
                            <option key={option} value={option}>
                              {option}
                            </option>
                          ))}
                        </select>
                      </div>
                      <button
                        onClick={handleSubmit}
                        className="bg-pink-400 hover:bg-pink-200 transition-all p-2 px-4 rounded-full"
                      >
                        <FontAwesomeIcon icon={faPlus} /> Add
                      </button>
                    </div>
                    <div className="text-gray-500">Enter speed (1 - 100)</div>
                    <div className="flex gap-5">
                      <input
                        placeholder="Enter Speed (10 - 10000)"
                        className="rounded-full border-none focus:ring-0 focus:outline-none bg-gray-200 w-full pl-5"
                        type="number"
                        value={speed}
                        onChange={handleChange}
                      />
                      {errorMessage && (
                        <div className="mt-2 text-sm text-red-500">{errorMessage}</div>
                      )}

                      <div
                        className="flex drop-shadow-2xl h-[55px] rounded-3xl w-[50%] bg-blue-950 pb-1 transition-all"
                        style={{ marginTop: '10px' }}
                      >
                        <button
                          className="absolute top-[-10px] text-blue-950 tracking-wider w-full p-3 rounded-3xl border-[1px] border-pink-400 bg-pink-400 transition-transform transform hover:translate-y-1 active:translate-y-2"
                          onClick={handlePlayButtonClick}
                          disabled={speed < 1 || speed > 100}
                        >
                          <FontAwesomeIcon icon={faPlay} /> &nbsp;Play
                        </button>
                      </div>
                    </div>
                  </form>
                )}

                {fileContent.length > 0
                  ? fileContent.map((line, index) => (
                      <div
                        key={index}
                        className={`p-2 md:text-lg sm:text-md text-sm ${
                          selectedLines.includes(line) ? 'bg-gray-200' : ''
                        }`}
                        onClick={() => toggleLineSelection(line)}
                      >
                        {line}
                      </div>
                    ))
                  : !isFormVisible && (
                      <div className="text-center text-gray-500">Select an option or add text</div>
                    )}
              </div>
            </div>
          </div>
          {isDelete && (
            <div
              className="absolute flex items-center justify-center h-screen w-screen top-0 right-0 bg-opacity-20 bg-black"
              onClick={cancelDelete}
            >
              <div className="flex flex-col bg-white rounded-xl w-1/6 h-1/6 z-10">
                <div className="flex justify-center items-center w-full h-2/3 border-b-[1px]">
                  Are you sure you want to delete?
                </div>
                <div className="flex w-full h-1/3 justify-between">
                  <button
                    onClick={cancelDelete}
                    className="flex h-full w-full justify-center items-center border-r-[1px] hover:rounded-bl-xl hover:bg-gray-100 transition-all "
                  >
                    <div>Cancel</div>
                  </button>
                  <button
                    onClick={handleDeleteText}
                    className="flex h-full w-full justify-center items-center border-l-[1px] hover:rounded-br-xl hover:bg-gray-100 transition-all text-red-700"
                  >
                    <div>Delete</div>
                  </button>
                </div>
              </div>
            </div>
          )}
          {/* Speed input and play button */}
          {!isFormVisible && (
            <div className="flex flex-col justify-center items-center p-4 w-full md:w-[20%] bg-transparent">
              <div className="flex flex-col gap-6 items-center bg-white h-[45%] rounded-2xl p-5">
                <button
                  onClick={setDelete}
                  className="w-full h-1/5 rounded-lg hover:bg-red-200 bg-gray-300 transition-all"
                >
                  Delete Selection
                </button>
                <button
                  onClick={handleClearSelection}
                  className="w-full h-1/5 rounded-lg hover:bg-gray-200 bg-gray-300 transition-all"
                >
                  Clear Selection
                </button>
                <div className="flex flex-col items-center w-full">
                  <div className="mb-2 text-sm">Enter Speed (1 - 100)</div>
                  <input
                    placeholder="Speed (1 - 100)"
                    className="border border-gray-300 rounded-full px-4 py-2 text-center focus:outline-none focus:ring-2 focus:ring-pink-400"
                    type="number"
                    value={speed}
                    onChange={handleChange}
                  />
                  {errorMessage && <div className="mt-2 text-sm text-red-500">{errorMessage}</div>}
                </div>
                <div
                  className="flex drop-shadow-2xl h-[55px] rounded-3xl w-[50%] bg-blue-950 pb-1 transition-all"
                  style={{ marginTop: '10px' }}
                >
                  <button
                    className="absolute top-[-10px] text-blue-950 tracking-wider w-full p-3 rounded-3xl border-[1px] border-pink-400 bg-pink-400 transition-transform transform hover:translate-y-1 active:translate-y-2"
                    onClick={handlePlayButtonClick}
                    disabled={speed < 1 || speed > 100}
                  >
                    <FontAwesomeIcon icon={faPlay} />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Readinglab
