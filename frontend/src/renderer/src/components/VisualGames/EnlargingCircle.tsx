import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAudioRecorder } from "../../hooks/useAudioRecorder";

import shelf from "../../assets/VisualGames/EnlargingCircle/shelf.png"
import bulb from "../../assets/VisualGames/EnlargingCircle/bulb.png"
import clock from "../../assets/VisualGames/EnlargingCircle/clock.png"
import table from "../../assets/VisualGames/EnlargingCircle/table.png"
import ball from "../../assets/VisualGames/EnlargingCircle/ball.png"

import record from "../../assets/VisualGames/record.png";
import play from "../../assets/VisualGames/SpeechFlight/play.png";
import pause from "../../assets/VisualGames/EnlargingCircle/pause.png";
import stop from "../../assets/VisualGames/stop.png";
import close from "../../assets/PSE/close.png";
import status from "../../assets/VisualGames/RecStatus.png";


const EnlargingCircle = () => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [audioInitialized, setAudioInitialized] = useState(false);
  const [threshold, setThreshold] = useState(10);
  const { isRecording, toggleRecording } = useAudioRecorder("Enlarging Circle");
  const [isEditingThreshold, setIsEditingThreshold] = useState(false);
  const [thresholdSteps] = useState<number[]>([25, 35, 50]); // Steps for threshold adjustment

  
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

  useEffect(() => {
    if (!audioInitialized) return;

    const audioContext = new AudioContext();
    const analyser = audioContext.createAnalyser();
    let source: MediaStreamAudioSourceNode;
    let dataArray: Uint8Array;

    navigator.mediaDevices.getUserMedia({ audio: true })
      .then((stream) => {
        source = audioContext.createMediaStreamSource(stream);
        source.connect(analyser);
        analyser.fftSize = 512;
        const bufferLength = analyser.frequencyBinCount;
        dataArray = new Uint8Array(bufferLength);

        const checkVolume = () => {
          analyser.getByteFrequencyData(dataArray);
          const volume = dataArray.reduce((sum, value) => sum + value, 0) / dataArray.length;
          setIsSpeaking(volume > threshold); // Use the threshold state
          console.log(volume)
          requestAnimationFrame(checkVolume);
        };

        checkVolume();
      })
      .catch((err) => {
        console.error('Error accessing microphone', err);
      });

    return () => {
      audioContext.close();
    };
  }, [audioInitialized, threshold]);

  const initializeAudio = () => {
    setAudioInitialized(true);
  };

  const handleStop = () => {
    setAudioInitialized(false);
  };


  return (
    <div className="bg-[url('/src/assets/VisualGames/EnlargingCircle/bgwall.png')] h-screen w-full bg-center flex flex-col justify-center relative overflow-hidden">
      {audioInitialized && (
        <div className="flex gap-7 py-2 px-6 items-center justify-center w-full sm:w-[50%] md:w-auto bg-white md:rounded-bl-2xl absolute top-0 right-0 z-20">
          {isRecording && (
          <img
            src={status}
            className="h-[40px] animate-pulse"
            alt="Recording Indicator"
          />
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
           <button onClick={toggleRecording} className="flex p-1 rounded-full w-[50px] transition-all">
            <img
              src={isRecording ? stop : record}  // Replace with the actual path to the record image
              alt="Record"
              className="hover:p-[1px] transition-all"
            />
          </button>
          <button onClick={handleStop} className="flex p-1 rounded-full w-[50px] transition-all">
            <img
              src={pause}  // Replace with the actual path to the stop image
              alt="Stop"
              className="hover:p-[1px] transition-all"
            />
          </button>
         
          <Link to="/visualgames-1"  className="flex p-1 rounded-full w-[40px] transition-all">
            <img
              src={close}  // Replace with the actual path to the close image
              alt="Close"
              className="hover:p-[1px] transition-all"
            />
          </Link>
        </div>
      )}
      {!audioInitialized && (
        <div className="flex gap-7 py-2 px-6 items-center justify-center w-full sm:w-[50%] md:w-auto bg-white md:rounded-bl-2xl absolute top-0 right-0 z-20">
          {isRecording && (
          <img
            src={status}
            className="h-[40px] animate-pulse"
            alt="Recording Indicator"
          />
        )}<div className="flex flex-col items-center">
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
            <div className="flex items-center mt-2">
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
          
          <button onClick={toggleRecording} className="flex p-1 rounded-full w-[50px] transition-all">
            <img
              src={isRecording ? stop : record}  // Replace with the actual path to the record image
              alt="Record"
              className="hover:p-[1px] transition-all"
            />
          </button><button onClick={initializeAudio} className="flex p-1 rounded-full w-[50px] transition-all">
            <img
              src={play}  // Replace with the actual path to the start image
              alt="Start"
              className="hover:p-[1px] transition-all"
            />
          </button>
          <Link to="/visualgames-1" className="flex p-1 rounded-full w-[40px] transition-all">
            <img
              src={close}  // Replace with the actual path to the close image
              alt="Close"
              className="hover:p-[1px] transition-all"
            />
          </Link>
        </div>
      )}
      <img
        src={shelf}
        className="w-[60%] sm:w-[50%] md:w-[40%] xl:w-[25%] h-auto max-h-[70%] absolute top-[10%] sm:top-[0%] left-[0%]"
        alt="shelf"
      />
      <img
        src={bulb}
        className="absolute top-[10%] sm:top-0 right-0 w-[17%] h-[20%] md:w-[13%] lg:w-[8%] lg:h-[30%]"
        alt="bulb"
      />
      <img
        src={clock}
        className="absolute top-[1%] right-[30%] w-[0%] h-[0%] md:w-[15%] md:h-[15%] xl:w-[10%] xl:h-[20%]"
        alt="clock"
      />
      <img
        src={table}
        className="absolute w-[50%] h-[50%] -bottom-[38%] right-[25%]"
        alt="table"
      />
      <div className="justify-center items-end flex w-screen h-screen relative">
        <img
          src={ball}
          className={`absolute bottom-[5%] max-h-[10%] max-w-[10%] transition-transform duration-4000 ease-in-out ${isSpeaking ? 'scale-10' : 'scale-1'}`}
          style={{
            transformOrigin: 'bottom center',
          }}
          alt="ball"
        />
      </div>
    </div>
  );
};

export default EnlargingCircle;
