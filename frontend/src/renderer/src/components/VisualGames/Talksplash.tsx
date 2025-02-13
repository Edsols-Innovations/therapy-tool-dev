import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useAudioRecorder } from "../../hooks/useAudioRecorder";

import singing from "../../assets/VisualGames/TalkSplash/singing.png";
import title from "../../assets/VisualGames/TalkSplash/title.png";
import record from "../../assets/VisualGames/record.png";
import play from "../../assets/VisualGames/SpeechFlight/play.png";
import pause from "../../assets/VisualGames/EnlargingCircle/pause.png";
import stop from "../../assets/VisualGames/stop.png";
import close from "../../assets/PSE/close.png";
import status from "../../assets/VisualGames/RecStatus.png";

interface Splash {
  x: number;
  y: number;
  color: string;
}

const getRandomPosition = (): Omit<Splash, "color"> => {
  const x = Math.random() * 100;
  const y = Math.random() * 100;
  return { x, y };
};

const getRandomColor = (): string => {
  const colors = [
    "bg-red-500",
    "bg-blue-500",
    "bg-green-500",
    "bg-yellow-500",
    "bg-purple-500",
    "bg-pink-500",
  ];
  return colors[Math.floor(Math.random() * colors.length)];
};

const TalkSplash = () => {
  const [splashes, setSplashes] = useState<Splash[]>([]);
  const [, setError] = useState<string | null>(null);
  const [, setIsSpeaking] = useState(false);
  const [audioInitialized, setAudioInitialized] = useState(false);
  const [threshold, setThreshold] = useState(20);
  const { isRecording, toggleRecording } = useAudioRecorder("Talk Splash");
  const [isEditingThreshold, setIsEditingThreshold] = useState(false);
  const [thresholdSteps] = useState<number[]>([20, 40, 70]); // Steps for threshold adjustment

  const animationRef = useRef<number | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const microphoneRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const dataArrayRef = useRef<Uint8Array | null>(null);

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
  
  const cleanupAudio = () => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
  };

  useEffect(() => {
    if (!audioInitialized) {
      cleanupAudio();
      return;
    }

    const setupAudio = async () => {
      try {
        const audioContext = new AudioContext();
        const analyser = audioContext.createAnalyser();
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const microphone = audioContext.createMediaStreamSource(stream);

        analyser.fftSize = 2048;
        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);

        microphone.connect(analyser);

        audioContextRef.current = audioContext;
        analyserRef.current = analyser;
        microphoneRef.current = microphone;
        dataArrayRef.current = dataArray;

        const analyzeAudio = () => {
          if (!analyserRef.current || !dataArrayRef.current) return;

          analyserRef.current.getByteFrequencyData(dataArrayRef.current);
          const average =
            dataArrayRef.current.reduce((a, b) => a + b, 0) /
            dataArrayRef.current.length;
          const isVoice = average > threshold;

          setIsSpeaking(isVoice);

          if (isVoice) {
            const newSplash = {
              ...getRandomPosition(),
              color: getRandomColor(),
            };
            setSplashes((prevSplashes) => [...prevSplashes, newSplash]);

            setTimeout(() => {
              setSplashes((prevSplashes) => prevSplashes.slice(1));
            }, 3000);
          }

          animationRef.current = requestAnimationFrame(analyzeAudio);
        };

        animationRef.current = requestAnimationFrame(analyzeAudio);
      } catch (err) {
        console.error("Error accessing microphone:", err);
        setError("Error accessing microphone");
      }
    };

    setupAudio();

    return cleanupAudio;
  }, [audioInitialized, threshold]);

  const initializeAudio = () => {
    setAudioInitialized(true);
  };

  const handleStop = () => {
    cleanupAudio();
    setAudioInitialized(false);
  };

  return (
    <div className="bg-white w-screen h-screen overflow-hidden relative">
      <div className="flex gap-7 py-2 px-6 items-center justify-center w-full sm:w-[50%] md:w-auto bg-gray-100 md:rounded-bl-2xl absolute top-0 right-0 z-20">
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
          onClick={audioInitialized ? handleStop : initializeAudio}
          className="flex p-1 rounded-full w-[50px] transition-all"
        >
          <img
            src={audioInitialized ? pause : play}
            alt={audioInitialized ? "Pause" : "Play"}
            className="hover:p-[1px] transition-all"
          />
        </button>

        <Link
          to="/visualgames-1"
          className="flex p-1 rounded-full w-[40px] transition-all"
        >
          <img src={close} alt="Close" className="hover:p-[1px] transition-all" />
        </Link>
      </div>
      <div className="w-full h-[30%] flex">
        <img
          src={title}
          className="absolute -top-[8%] lg:-top-[10%] lg:-left-[5%] max-h-[30%] z-10"
          alt="title"
        />
      </div>
      <img
        src={singing}
        className="absolute bottom-[0%] lg:h-[20%] right-[0%] h-[0%] z-10"
        alt="boy"
      />
      {splashes.map((splash, index) => (
        <div
          key={index}
          className={`absolute w-12 h-12 ${splash.color} rounded-full opacity-75`}
          style={{
            left: `${splash.x}%`,
            top: `${splash.y}%`,
            transform: "scale(0)",
            animation: "splash-animation 2s forwards",
          }}
        ></div>
      ))}
      <style>{`
        @keyframes splash-animation {
          0% {
            transform: scale(0);
            opacity: 1;
          }
          50% {
            transform: scale(1.5);
            opacity: 0.75;
          }
          100% {
            transform: scale(1.5);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
};

export default TalkSplash;
