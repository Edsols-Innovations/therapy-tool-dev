import { useState, useEffect } from 'react'
import { useRatingRecorder } from '../../hooks/useRatingRecorder'

import record from '../../assets/VisualGames/record.png'
import stop from '../../assets/VisualGames/stop.png'
import status from '../../assets/VisualGames/RecStatus.png'

import back from '../../assets/VisualGames/TalkDuckling/back.png'
import play from '../../assets/VisualGames/TalkDuckling/play.png'
import replay from '../../assets/VisualGames/TalkDuckling/replay.png'
import sun from '../../assets/VisualGames/TalkDuckling/sun.png'
import clouds from '../../assets/VisualGames/TalkDuckling/clouds.png'
import label from '../../assets/VisualGames/TalkDuckling/label.png'
import ducks from '../../assets/VisualGames/TalkDuckling/duck.png'
import happyducks from '../../assets/VisualGames/TalkDuckling/landAfter.png'
import grass from '../../assets/VisualGames/TalkDuckling/grass.png'
import pond from '../../assets/VisualGames/TalkDuckling/water.png'
import land from '../../assets/VisualGames/TalkDuckling/land.png'
import goodjob from '../../assets/VisualGames/TalkDuckling/goodjob.gif'
import { Link } from 'react-router-dom'

const TalkDuckling = () => {
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [animationEnd, setAnimationEnd] = useState(false)
  const [duckImage, setDuckImage] = useState(ducks)
  const [isAnimating, setIsAnimating] = useState(false)
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null)
  const [gifPosition, setGifPosition] = useState({ top: '50%', left: '50%' })
  const [threshold, setThreshold] = useState<number>(25)
  const [isEditingThreshold, setIsEditingThreshold] = useState(false);
  const [thresholdSteps] = useState<number[]>([35, 50, 65]); // Steps for threshold adjustment
  const [inputText, setInputText] = useState('');
  const [displayRating, setDisplayRating] = useState<boolean>(false);
  const { isRecording, ratingData, toggleRecording } = useRatingRecorder('Talk Duckling', inputText)

  const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    // setDisplayRating(false)
    setInputText(event.target.value);
  };

  const adjustThreshold = (direction: "increase" | "decrease") => {
    if (direction === "increase") {
      if (threshold < thresholdSteps[thresholdSteps.length - 1]) {
        const nextStep = thresholdSteps.find((step) => step > threshold);
        if (nextStep !== undefined) setThreshold(nextStep);
      }
    } else if (direction === "decrease") {
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
        requestAnimationFrame(checkVolume)
      }

      checkVolume()
    } catch (error) {
      console.error('Error accessing microphone', error)
    }
  }

  useEffect(() => {
    if (ratingData) {
      setDisplayRating(true); // Show the rating when available
    }
    if (isAnimating) {
      handleClickStart()
    } else if (audioContext) {
      audioContext.close()
      setAudioContext(null)
    }
  }, [isAnimating, threshold, ratingData])

  useEffect(() => {
    if (animationEnd) {
      setDuckImage(goodjob)
      setGifPosition({ top: '0%', left: '32%' })
    }
  }, [animationEnd])

  const handleToggleAnimation = () => {
    setIsAnimating(!isAnimating)
    setDuckImage(ducks)
    setAnimationEnd(false)
  }

  return (
    <div className="flex flex-col bg-[#74FAFF] w-screen h-screen overflow-hidden">
      {displayRating && ratingData && (
        <div className="absolute left-2/3 top-[42%] z-10">
          <span className='text-2xl font-bold'>Matching : {(ratingData.rating * 10).toFixed(2)}%</span>
        </div>
      )}
      <div className="flex h-max md:h-[10vh]  w-full justify-end">
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
            className="flex p-1 rounded-full w-[50px] transition-all"
            onClick={toggleRecording}
          >
            <img
              src={isRecording ? stop : record}
              alt="Record"
              className=" hover:p-[1px] transition-all"
            />
          </button>

          <button
            className="flex p-1 gap-2 items-center rounded-full w-[50px]  transition-all"
            onClick={handleToggleAnimation}
          >
            <div>
              {isAnimating ? (
                <img src={replay} alt="Back" className="hover:p-[1px] transition-all" />
              ) : (
                <img
                  src={play}
                  alt="Back"
                  className="hover:p-[1px] transition-all"
                  onClick={handleClickStart}
                />
              )}
            </div>
          </button>
          <Link className="flex p-1 rounded-full w-[50px]  transition-all" to="/visualgames-2">
            <img src={back} alt="Back" className="hover:p-[1px] transition-all" />
          </Link>
        </div>
      </div>
      <div className="flex flex-col justify-center h-[45vh]">
        <div className="flex justify-start h-max w-full">
          <img src={sun} alt="Sun" className="w-1/2" />
        </div>
        <div className="flex relative items-end justify-end h-max w-full">
          <img src={clouds} alt="Clouds" className="w-1/2 " />
          <img src={label} alt="Label" className="absolute w-[50vw] md:w-[400px] -right-2" />
        </div>
      </div>

      <div className="flex items-center relative h-[47vh] w-full overflow-hidden">
        <div className="flex h-full items-end mb-[20vh]">
          <img
            src={duckImage}
            alt="Ducks"
            className={`absolute bottom-10 md:bottom-32 z-10 ${
              isAnimating ? 'animate-duckmarquee' : ''
            }`}
            style={{
              animationPlayState: isSpeaking ? 'running' : 'paused',
              width: animationEnd ? '30vw' : '20vw',
              maxWidth: animationEnd ? '500px' : '350px',
              top: animationEnd ? gifPosition.top : undefined,
              left: animationEnd ? gifPosition.left : undefined
            }}
            onAnimationEnd={() => setAnimationEnd(true)}
          />
        </div>
        <div>
          <img src={pond} alt="Pond" className="absolute lg:-bottom-10 bottom-0 w-full" />
          <div>
            <img
              src={grass}
              alt="Grass"
              className="absolute z-10 -bottom-4 -left-20 w-[20vw] h-auto"
            />
          </div>
          <div>
            <img
              src={animationEnd ? happyducks : land}
              alt={animationEnd ? 'Happy Ducks' : 'Land'}
              className="absolute -bottom-10 -right-44 w-[35vw] h-auto"
            />
          </div>
        </div>
      </div>
      <div className="z-10 absolute left-10 bottom-1/2">
        <textarea
          className="w-[900px] text-3xl font-bold border-none rounded-3xl p-5"
          placeholder="Enter Text"
          name="text"
          id=""
          value={inputText}  // Controlled input
          onChange={handleInputChange}  // Handle input changes
        ></textarea>
      </div>
    </div>
  )
}

export default TalkDuckling
