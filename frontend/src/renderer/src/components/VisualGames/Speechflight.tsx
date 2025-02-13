import { useState, useEffect } from 'react'
import { useRatingRecorder } from '../../hooks/useRatingRecorder'

import record from '../../assets/VisualGames/record.png'
import stop from '../../assets/VisualGames/stop.png'
import status from '../../assets/VisualGames/RecStatus.png'

import bg from '../../assets/VisualGames/SpeechFlight/background.png'
import cloud from '../../assets/VisualGames/SpeechFlight/clouds.png'
import flight from '../../assets/VisualGames/SpeechFlight/flight.png'
import back from '../../assets/VisualGames/SpeechFlight/back.png'
import replay from '../../assets/VisualGames/SpeechFlight/replay.png'
import play from '../../assets/VisualGames/SpeechFlight/play.png'

import label from '../../assets/VisualGames/SpeechFlight/label.png'
import { Link } from 'react-router-dom'

const Speechflight = () => {
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [animationEnd, setAnimationEnd] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null)
  const [threshold, setThreshold] = useState<number>(20)
  const [inputText, setInputText] = useState('')
  const [displayRating, setDisplayRating] = useState<boolean>(false)
  const [isEditingThreshold, setIsEditingThreshold] = useState(false);
  const [thresholdSteps] = useState<number[]>([25, 45, 65]); // Steps for threshold adjustment
  const { isRecording, ratingData, toggleRecording } = useRatingRecorder('Speech Flight', inputText)

  const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputText(event.target.value)
  }

  const adjustThreshold = (direction: "increase" | "decrease") => {
    const currentIndex = thresholdSteps.findIndex(
      (step) => step >= threshold
    );
  
    if (direction === "increase" && currentIndex < thresholdSteps.length - 1) {
      if (threshold < thresholdSteps[thresholdSteps.length - 1]) {
        const nextStep = thresholdSteps.find((step) => step > threshold);
        if (nextStep !== undefined) setThreshold(nextStep);
      }
    } if (direction === "decrease" ) {
      if (threshold > thresholdSteps[0]) {
        const prevStep = [...thresholdSteps].reverse().find((step) => step < threshold);
        if (prevStep !== undefined) setThreshold(prevStep);
      }
    }
  };

  const handleClickStart = async () => {
    try {
      const context = new (window.AudioContext || (window as any).webkitAudioContext)()
      setAudioContext(context)

      const analyser = context.createAnalyser()
      const microphone = await navigator.mediaDevices.getUserMedia({
        audio: true
      })
      const source = context.createMediaStreamSource(microphone)
      source.connect(analyser)
      analyser.fftSize = 512
      const dataArray = new Uint8Array(analyser.frequencyBinCount)

      const checkVolume = () => {
        analyser.getByteFrequencyData(dataArray)
        const volume = dataArray.reduce((sum, value) => sum + value, 0) / dataArray.length
        setIsSpeaking(volume > threshold)
        if (isAnimating) {
          requestAnimationFrame(checkVolume)
        }
      }

      checkVolume()
    } catch (error) {
      console.error('Error accessing microphone', error)
    }
  }

  const stopAudio = () => {
    if (audioContext) {
      audioContext.close()
      setAudioContext(null)
    }
    setIsSpeaking(false)
  }

  useEffect(() => {
    if (isAnimating) {
      handleClickStart()
    } else {
      stopAudio()
    }
  }, [isAnimating, threshold])

  useEffect(() => {
    if (ratingData) {
      setDisplayRating(true)
    }
  }, [ratingData])

  useEffect(() => {
    if (animationEnd) {
      setIsAnimating(false)
    }
  }, [animationEnd])

  const handleToggleAnimation = () => {
    setIsAnimating(!isAnimating)
    setAnimationEnd(false)
  }

  return (
    <div className="flex flex-col w-screen h-screen bg-sky-300 overflow-hidden">
      {displayRating && ratingData && (
        <div className="absolute left-20 top-28 z-10">
          <span className="text-2xl font-bold">
            Matching : {(ratingData.rating * 10).toFixed(2)}%
          </span>
        </div>
      )}
      <div className="flex h-max md:h-[10vh] w-full justify-end z-10">
        <div className="flex gap-7 py-2 px-6 items-center justify-center w-full md:w-auto bg-white md:rounded-bl-2xl">
          {isRecording && (
            <img src={status} className="h-[40px] animate-pulse" alt="Recording Indicator" />
          )}
          <div className="flex flex-col items-center">
            <label htmlFor="threshold" className="text-lg font-bold">
              Threshold:
            </label>
            <div className="flex items-center w-full mt-2 relative">
              {/* - Button on the left */}
              <button
                className="absolute left-0 px-2 py-1 bg-gray-300 rounded-md"
                onClick={() => adjustThreshold("decrease")}
              >
                -
              </button>
              {/* Slider */}
              <input
                type="range"
                id="threshold-slider"
                min="0"
                max="100"
                value={threshold}
                onChange={(e) => setThreshold(Number(e.target.value))}
                className="w-full mx-8"
              />
              {/* + Button on the right */}
              <button
                className="absolute right-0 px-2 py-1 bg-gray-300 rounded-md"
                onClick={() => adjustThreshold("increase")}
              >
                +
              </button>
            </div>
            {/* Editable Threshold Value */}
            <div className="flex items-center mt-2 border border-black px-2">
              {isEditingThreshold ? (
                <input
                  type="number"
                  value={threshold}
                  onChange={(e) => setThreshold(Number(e.target.value))}
                  onBlur={() => setIsEditingThreshold(false)}
                  className="w-[50px] text-center border border-gray-300 rounded-md"
                />
              ) : (
                <span
                  onClick={() => setIsEditingThreshold(true)}
                  className="cursor-pointer"
                >
                  {threshold}
                </span>
              )}
            </div>
          </div>
          <button
            onClick={toggleRecording}
            className="flex p-1 rounded-full w-[50px] transition-all"
          >
            <img
              src={isRecording ? stop : record}
              alt="Record"
              className="hover:p-[1px] transition-all"
            />
          </button>
          <button
            className="flex p-1 gap-2 items-center rounded-full w-[50px] transition-all"
            onClick={handleToggleAnimation}
          >
            <img
              src={isAnimating ? replay : play}
              alt="Play/Replay"
              className="hover:p-[1px] transition-all"
            />
          </button>
          <Link className="flex p-1 rounded-full w-[50px] transition-all" to="/visualgames-2">
            <img src={back} alt="Back" className="hover:p-[1px] transition-all" />
          </Link>
        </div>
      </div>
      <div className="flex h-full items-center">
        <div className="absolute top-12">
          <img src={cloud} alt="" />
        </div>
        <div className="absolute bottom-0">
          <img src={bg} alt="" />
        </div>
        <div
          className={`flex z-10 mt-24 w-full ${
            isAnimating || animationEnd ? '' : 'justify-end'
          } ${animationEnd ? 'animate-takeoff' : ''}`}
        >
          <img
            src={flight}
            alt="Flight"
            className={`w-[100px] md:w-[200px] ${isAnimating ? 'animate-flight' : ''}
            `}
            style={{ animationPlayState: isSpeaking ? 'running' : 'paused' }}
            onAnimationEnd={() => setAnimationEnd(true)}
          />
        </div>
        <div className="z-10 absolute bottom-0 right-10">
          <img className="w-[65px] md:w-[150px] lg:w-[250px]" src={label} alt="" />
        </div>
        <div className="z-10 absolute bottom-10 right-1/4">
          <textarea
            className="w-[900px] text-3xl font-bold border-none rounded-3xl p-5"
            placeholder="Enter Text"
            value={inputText}
            onChange={handleInputChange}
          />
        </div>
      </div>
    </div>
  )
}

export default Speechflight
