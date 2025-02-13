import { useEffect, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useRatingRecorder } from '../../hooks/useRatingRecorder'
import close from '../../assets/PSE/close.png'
import recstatus from '../../assets/PSE/recstatus.png'
import stop from '../../assets/PSE/stop.png'
import record from '../../assets/PSE/record.png'
import previous from '../../assets/PSE/previous.png'
import next from '../../assets/PSE/next.png'
import botvoice from '../../assets/PSE/voice-bot.png'
import humanvoice from '../../assets/PSE/voice-man.png'

const Pse1 = () => {
  const location = useLocation()
  const { addedWords } = location.state as { addedWords: string[] }
  const [currentWordIndex, setCurrentWordIndex] = useState(0)
  const [showSecondImage, setShowSecondImage] = useState(true)
  const [, setDuration] = useState<number>(0)
  const [, setCurrentTime] = useState<number>(0)
  const [, setIsPlaying] = useState<boolean>(false)
  const [displayRating, setDisplayRating] = useState<boolean>(false);
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const currentWord = addedWords[currentWordIndex]
  const [, setIsTTS] = useState<boolean>(false)

  // Pass currentWord as the second argument to useRatingRecorder
  const { isRecording, ratingData, toggleRecording } = useRatingRecorder('PSE', currentWord)

  useEffect(() => {
    const audioElement = new Audio()
    audioRef.current = audioElement

    const handleCanPlay = () => {
      if (audioElement.duration !== Infinity && !isNaN(audioElement.duration)) {
        setDuration(audioElement.duration)
      } else {
        console.error('Initial duration is Infinity, retrying...')
        setTimeout(() => {
          if (audioElement.duration !== Infinity && !isNaN(audioElement.duration)) {
            setDuration(audioElement.duration)
          } else {
            console.error(
              'Error: Audio duration is still Infinity after retry. Please check the file path or format.'
            )
            setDuration(0) // Reset duration to 0 if it remains Infinity
          }
        }, 500) // Retry after 500ms
      }
    }

    const handleTimeUpdate = () => {
      setCurrentTime(audioElement.currentTime)
    }

    const handleEnded = () => {
      setIsPlaying(false)
    }
    if (ratingData) {
      setDisplayRating(true); // Show the rating when available
    }

    audioElement.addEventListener('canplay', handleCanPlay)
    audioElement.addEventListener('timeupdate', handleTimeUpdate)
    audioElement.addEventListener('ended', handleEnded)

    return () => {
      audioElement.removeEventListener('canplay', handleCanPlay)
      audioElement.removeEventListener('timeupdate', handleTimeUpdate)
      audioElement.removeEventListener('ended', handleEnded)
      audioElement.pause()
    }
  }, [ratingData])

  const playRegularAudio = async () => {
    if (audioRef.current) {
      try {
        const response = await fetch(`http://localhost:8000/therapyware/pseaudio?word=${currentWord}`, {
          method: 'POST'
        })

        if (response.ok) {
          const blob = await response.blob()
          const audioURL = URL.createObjectURL(blob)

          audioRef.current.src = audioURL
          audioRef.current.play()
          setIsPlaying(true)
        } else {
          console.error('Error: Regular audio file does not exist.')
          setIsPlaying(false)
        }
      } catch (error) {
        console.error('Error handling regular audio:', error)
        setIsPlaying(false)
      }
    }
  }

  const playTTSAudio = async () => {
    if (audioRef.current) {
      setIsTTS(true)
  
      try {
        const response = await fetch("http://localhost:8000/therapyware/generateTTS/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ word: currentWord }), // Send the word in the request body
        })
  
        if (response.ok) {
          const blob = await response.blob()
          const audioURL = URL.createObjectURL(blob)
  
          audioRef.current.src = audioURL
          await audioRef.current.play()
          setIsPlaying(true)
        } else {
          console.error("Failed to get TTS audio:", response.statusText)
          setIsTTS(false)
        }
      } catch (error) {
        console.error("Error fetching TTS audio:", error)
        setIsTTS(false)
      }
    }
  }
  

  const handleNext = () => {
    if (currentWordIndex < addedWords.length - 1) {
      setCurrentWordIndex(currentWordIndex + 1)
      setShowSecondImage(true)
      setIsPlaying(false) // Stop playback when changing words
      setDisplayRating(false)
      if (audioRef.current) {
        audioRef.current.pause()
        setCurrentTime(0) // Reset current time on word change
      }
    }
  }

  const handlePrevious = () => {
    if (currentWordIndex > 0) {
      setCurrentWordIndex(currentWordIndex - 1)
      setShowSecondImage(true)
      setIsPlaying(false) // Stop playback when changing words
      setDisplayRating(false)
      if (audioRef.current) {
        audioRef.current.pause()
        setCurrentTime(0) // Reset current time on word change
      }
    }
  }

  return (
    <div className="w-screen h-screen bg-[rgb(209,235,241)]">
      <div className="h-[18%] flex relative items-center justify-center">
        {isRecording && (
          <img
            src={recstatus}
            alt="Recording Status"
            className="absolute h-[20%] lg:h-[30%] bottom-[30%] lg:bottom-[10%] right-[10%] animate-pulse"
          />
        )}
        <Link to="/pse">
          <img
            src={close}
            alt="close"
            className="absolute h-[20%] lg:h-[30%] bottom-[30%] lg:bottom-[10%] right-[5%]"
          />
        </Link>
        <div className="text-4xl font-bold text-black">{currentWord}</div>
      </div>
      <div className="h-[62%] flex w-full">
        <div className="w-[100%] h-full justify-start flex flex-col relative">
          <div className="flex justify-center w-full items-start">
            <div className="bg-white shadow-xl border-black border">
              {showSecondImage && (
                <img
                  src={`http://localhost:8000/therapyware/pseimage/${currentWord}.png?t=${new Date().getTime()}`}
                  alt={`${currentWord} 1`}
                  className="h-[40vh] p-5"
                />
              )}
            </div>
          </div>
          <div className="w-full flex items-center justify-center mt-10 fixed bottom-80">
            <button
              className="font-bold text-xl px-3 border-black border-2 rounded-2xl"
              onClick={() => setShowSecondImage(!showSecondImage)}
            >
              {showSecondImage ? 'Hide' : 'Show'}
            </button>
          </div>
          <div className="w-full flex justify-center bottom-52 fixed">
            <div className="flex items-center">
              <div className="w-max flex items-center">
                {displayRating && ratingData && (
                  <div>
                    <span className='text-xl'>Matching : {(ratingData.rating * 10).toFixed(2)}%</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="h-[20%] flex justify-center items-center px-10 gap-4">
        <button className="font-bold rounded-full" onClick={toggleRecording}>
          <img
            src={isRecording ? stop : record}
            alt="record"
            className="w-10 h-10 md:w-12 md:h-12 rounded-full"
          />
        </button>
        <button className="font-bold rounded-full border" onClick={playRegularAudio}>
          <img src={humanvoice} className="w-10 md:w-12 md:h-12" />
        </button>
        <button className="font-bold rounded-full" onClick={playTTSAudio}>
          <img src={botvoice} className="w-10 md:w-12 md:h-12 rounded-full" />
        </button>
        <button
          className="font-bold rounded-full"
          onClick={handlePrevious}
          disabled={currentWordIndex === 0}
        >
          <img src={previous} alt="previous" className="w-10 h-10 md:w-12 md:h-12 rounded-full" />
        </button>
        <button
          className="font-bold rounded-full"
          onClick={handleNext}
          disabled={currentWordIndex === addedWords.length - 1}
        >
          <img src={next} alt="next" className="w-10 h-10 md:w-12 md:h-12 rounded-full" />
        </button>
      </div>
    </div>
  )
}

export default Pse1
