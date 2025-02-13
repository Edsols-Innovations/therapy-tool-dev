import React, { useState, useEffect } from "react";
import VoiceballImage from "../../assets/VisualGames/Voiceball/namebackground.png";
import { useAudioRecorder } from "../../hooks/useAudioRecorder";

import back from "../../assets/VisualGames/back.png";
import record from "../../assets/VisualGames/record.png";
import stop from "../../assets/VisualGames/stop.png";
import playIcon from "../../assets/VisualGames/SpeechFlight/play.png";
import pauseIcon from "../../assets/VisualGames/EnlargingCircle/pause.png";
import status from "../../assets/VisualGames/RecStatus.png";

import ball1 from "../../assets/VisualGames/Voiceball/image1.png";
import ball2 from "../../assets/VisualGames/Voiceball/image2.png";
import ball3 from "../../assets/VisualGames/Voiceball/image3.png";
import ball4 from "../../assets/VisualGames/Voiceball/image4.png";
import ball5 from "../../assets/VisualGames/Voiceball/image5.png";
import ball6 from "../../assets/VisualGames/Voiceball/image6.png";
import ball7 from "../../assets/VisualGames/Voiceball/image7.png";
import ball9 from "../../assets/VisualGames/Voiceball/image9.png";
import ball10 from "../../assets/VisualGames/Voiceball/image10.png";
import ball11 from "../../assets/VisualGames/Voiceball/image11.png";
import ball12 from "../../assets/VisualGames/Voiceball/image12.png";
import ball13 from "../../assets/VisualGames/Voiceball/image13.png";
import ball14 from "../../assets/VisualGames/Voiceball/image14.png";
import { Link } from "react-router-dom";

const ballImages = [
  ball1, ball2, ball3, ball4, ball5,
  ball6, ball7, ball9, ball10, ball11,
  ball12, ball13, ball14, ball1, ball2,
  ball3, ball4, ball5, ball6, ball7,
  ball9, ball10, ball11, ball12, ball13,
  ball14, ball1, ball2, ball3, ball4,
  ball5, ball6, ball7, ball9, ball10,
  ball11, ball12, ball13, ball14, ball1,
  ball2, ball3, ball4, ball5, ball6,
];

interface BallConfig {
  top: string;
  left: string;
  width: string;
  height: string;
  transition?: string;
  transform?: string;
}

const generateInitialConfig = (totalBalls: number): BallConfig[] =>
  Array.from({ length: totalBalls }).map((_, index) => ({
    top: "90%", // Start near the bottom
    left: `${(index / totalBalls) * 100}%`, // Evenly spaced horizontally
    width: `${8 + Math.random() * 4}vw`, // Random size between 8vw and 12vw
    height: `${8 + Math.random() * 4}vw`, // Random size between 8vw and 12vw
  }));

const Voiceball: React.FC = () => {
  const [ballConfig, setBallConfig] = useState(generateInitialConfig(ballImages.length));
  const [threshold, setThreshold] = useState<number>(30);
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);
  const [analyser, setAnalyser] = useState<AnalyserNode | null>(null);
  const [dataArray, setDataArray] = useState<Uint8Array | null>(null);
  const [isGamePaused, setIsGamePaused] = useState(false);
  const [isEditingThreshold, setIsEditingThreshold] = useState(false);
  const [thresholdSteps] = useState<number[]>([35, 50, 75]); // Steps for threshold adjustment
  const { isRecording, toggleRecording } = useAudioRecorder("Voice Play");

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
  

  useEffect(() => {
    const initAudio = async () => {
      const context = new (window.AudioContext ||
        (window as any).webkitAudioContext)();
      setAudioContext(context);

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const source = context.createMediaStreamSource(stream);
      const analyserNode = context.createAnalyser();

      source.connect(analyserNode);
      analyserNode.fftSize = 256;
      const bufferLength = analyserNode.frequencyBinCount;
      const data = new Uint8Array(bufferLength);
      setDataArray(data);
      setAnalyser(analyserNode);

      const updateAudioLevel = () => {
        if (!isGamePaused) {
          analyserNode.getByteFrequencyData(data);
        }
        requestAnimationFrame(updateAudioLevel);
      };

      updateAudioLevel();
    };

    initAudio();

    return () => {
      audioContext?.close();
    };
  }, [isGamePaused]);

  const moveBalls = () => {
    if (dataArray && analyser && !isGamePaused) {
      analyser.getByteFrequencyData(dataArray);
      const avgVolume = dataArray.reduce((a, b) => a + b, 0) / dataArray.length;

      setBallConfig((prevConfig) =>
        prevConfig.map((ball) => {
          const randomBurst = Math.random() * 5;
          const horizontalBurst = Math.random() * 10;
          let newTop = parseFloat(ball.top);
          let newLeft = parseFloat(ball.left);

          if (avgVolume > threshold) {
            newTop = Math.max(0, newTop - randomBurst * 2);
            newLeft = Math.max(
              0,
              Math.min(
                100,
                newLeft + (Math.random() < 0.5 ? horizontalBurst : -horizontalBurst)
              )
            );
          } else {
            newTop = Math.min(90, newTop + randomBurst * 0.6);
            newLeft = Math.max(
              0,
              Math.min(
                100,
                newLeft + (Math.random() < 0.5 ? randomBurst * 0.1 : -randomBurst * 0.1)
              )
            );
          }

          return {
            ...ball,
            top: `${newTop}%`,
            left: `${newLeft}%`,
            transition: "top 0.2s ease, left 0.2s ease",
          };
        })
      );
    }
  };

  useEffect(() => {
    const intervalId = setInterval(moveBalls, 100);
    return () => clearInterval(intervalId);
  }, [dataArray, threshold, isGamePaused]);

  return (
    <div className="relative w-screen h-screen bg-black overflow-hidden">
      <div className="flex h-max md:h-[10vh] w-full justify-end">
        <div className="flex z-10 gap-7 py-2 px-6 items-center justify-center w-full md:w-auto bg-white md:rounded-bl-2xl">
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
          <button
            className="flex p-1 rounded-full w-[50px] transition-all"
            onClick={toggleRecording}
          >
            <img
              src={isRecording ? stop : record}
              alt="Record"
              className="hover:p-[1px] transition-all"
            />
          </button>
          <button
            className="flex p-1 rounded-full w-[50px] transition-all"
            onClick={() => setIsGamePaused((prev) => !prev)}
          >
            <img
              src={isGamePaused ? playIcon : pauseIcon}
              alt={isGamePaused ? "Play" : "Pause"}
              className="hover:p-[1px] transition-all"
            />
          </button>
          <Link
            className="flex p-1 rounded-full w-[50px] transition-all"
            to="/visualgames-1"
          >
            <img
              src={back}
              alt="Back"
              className="hover:p-[1px] transition-all"
            />
          </Link>
        </div>
      </div>

      <div className="absolute top-3 left-3 flex items-center">
        <img
          src={VoiceballImage}
          alt="Voice Play"
          className="w-[150px] sm:w-[100px] md:w-[150px] lg:w-[250px] h-auto"
        />
        <div
          className="ml-2 flex flex-col items-start absolute"
          style={{
            top: "50%",
            left: "70%",
            transform: "translate(-50%, -50%)",
          }}
        >
          <span className="text-white text-xl sm:text-2xl md:text-3xl font-bold">
            VOICE
          </span>
          <span className="text-white text-xl sm:text-2xl md:text-3xl font-bold mt-1">
            PLAY
          </span>
        </div>
      </div>

      <div className="absolute inset-0">
        {ballImages.map((ball, index) => {
          const { top, left, width, height, transition } = ballConfig[index];
          return (
            <img
              key={index}
              src={ball}
              alt={`Ball ${index + 1}`}
              className="absolute"
              style={{
                top,
                left,
                width,
                height,
                transition,
                transform: "translate(-50%, -50%)",
              }}
            />
          );
        })}
      </div>
    </div>
  );
};

export default Voiceball;
