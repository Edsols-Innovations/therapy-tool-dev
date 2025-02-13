import { useState, useEffect, useCallback } from "react";
import { useAudioRecorder } from "../../hooks/useAudioRecorder";

import back from "../../assets/VisualGames/back.png";
import replay from "../../assets/VisualGames/replay.png";
import record from "../../assets/VisualGames/record.png";
import status from "../../assets/VisualGames/RecStatus.png";
import playIcon from "../../assets/VisualGames/SpeechFlight/play.png";
import name from "../../assets/VisualGames/Teddy/name_board.png";
import grassimage from "../../assets/VisualGames/Teddy/down.png";
import down from "../../assets/VisualGames/Teddy/down1.png";
import rock from "../../assets/VisualGames/Teddy/rock1.png";
import rock1 from "../../assets/VisualGames/Teddy/rock2.png";
import teddyImage from "../../assets/VisualGames/Teddy/image195.gif";
import cloud from "../../assets/VisualGames/Teddy/cloud.png";
import cloud2 from "../../assets/VisualGames/Teddy/cloud2.png";
import cloud1 from "../../assets/VisualGames/Teddy/cloud1.png";
import { Link } from "react-router-dom";

const Teddy = () => {
  const [birdPosition, setBirdPosition] = useState<{ top: number; left: number }>({ top: 70, left: 5 });
  const [thresholdValue, setThresholdValue] = useState<number>(45);
  const { isRecording, toggleRecording } = useAudioRecorder("Bird Voice");
  const [isGamePaused, setIsGamePaused] = useState(true);
  const [showReplayButton, setShowReplayButton] = useState(false);
  const [isEditingThreshold, setIsEditingThreshold] = useState(false);
  const [thresholdSteps] = useState<number[]>([45, 60, 85]);

  const adjustThreshold = (direction: "increase" | "decrease") => {
    const currentIndex = thresholdSteps.findIndex((step) => step >= thresholdValue);
    if (direction === "increase" && currentIndex < thresholdSteps.length - 1) {
      const nextStep = thresholdSteps.find((step) => step > thresholdValue);
      if (nextStep !== undefined) setThresholdValue(nextStep);
    }
    if (direction === "decrease") {
      const prevStep = [...thresholdSteps].reverse().find((step) => step < thresholdValue);
      if (prevStep !== undefined) setThresholdValue(prevStep);
    }
  };

  const moveBird = useCallback(
    (amplitude: number) => {
      setBirdPosition((prev) => {
        let newTop = prev.top;
        let newLeft = prev.left;

        const speedFactor = (101 - thresholdValue) / 50;
        newTop -= (amplitude / 256) * speedFactor;
        newLeft += (amplitude / 256) * 0.5 * speedFactor;

        const maxTop = 40;
        if (newTop < maxTop) newTop = maxTop;
        if (newTop > 90) newTop = 90;

        return { top: newTop, left: newLeft };
      });
    },
    [thresholdValue]
  );

  const setInitialPosition = () => setBirdPosition({ top: 70, left: 5 });

  const handlePlayPause = () => {
    setIsGamePaused(false);
    setShowReplayButton(true);
  };

  const handleReplay = () => {
    setInitialPosition();
    setShowReplayButton(false);
    setIsGamePaused(true);
  };

  useEffect(() => {
    let audioContext: AudioContext;
    let analyser: AnalyserNode;
    let dataArray: Uint8Array;
    let requestId: number;

    const handleAudioProcessing = (stream: MediaStream) => {
      audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const source = audioContext.createMediaStreamSource(stream);
      analyser = audioContext.createAnalyser();
      source.connect(analyser);
      analyser.fftSize = 256;
      const bufferLength = analyser.frequencyBinCount;
      dataArray = new Uint8Array(bufferLength);

      const processAudio = () => {
        if (!isGamePaused) {
          analyser.getByteFrequencyData(dataArray);
          const avgAmplitude = dataArray.reduce((sum, value) => sum + value, 0) / bufferLength;
          moveBird(avgAmplitude);
        }
        requestId = requestAnimationFrame(processAudio);
      };

      processAudio();
    };

    if (!isGamePaused) {
      navigator.mediaDevices.getUserMedia({ audio: true }).then(handleAudioProcessing).catch(console.error);
    }

    return () => {
      if (audioContext) audioContext.close();
      cancelAnimationFrame(requestId);
    };
  }, [isGamePaused, moveBird]);
  
  return (
    <div className="relative w-screen h-screen overflow-hidden bg-[#74faff]">
      <div className="flex h-max md:h-[10vh] w-full justify-end">
        <div className="flex z-10 gap-7 py-2 px-6 items-center justify-center w-full md:w-auto bg-white md:rounded-bl-2xl">
          {isRecording && (
            <img src={status} className="h-[40px] animate-pulse" alt="Recording Indicator" />
          )}
          <div className="flex flex-col items-center">
            <label htmlFor="threshold" className="text-lg font-bold">Threshold:</label>
            <div className="flex items-center w-full mt-2 relative">
              <button
                className="absolute left-0 px-2 py-1 bg-gray-300 rounded-md"
                onClick={() => adjustThreshold("decrease")}
              >
                -
              </button>
              <input
                type="range"
                id="threshold-slider"
                min="0"
                max="100"
                value={thresholdValue}
                onChange={(e) => setThresholdValue(Number(e.target.value))}
                className="w-full mx-8"
              />
              <button
                className="absolute right-0 px-2 py-1 bg-gray-300 rounded-md"
                onClick={() => adjustThreshold("increase")}
              >
                +
              </button>
            </div>
            <div className="flex items-center mt-2 border border-black px-2">
              {isEditingThreshold ? (
                <input
                  type="number"
                  value={thresholdValue}
                  onChange={(e) => setThresholdValue(Number(e.target.value))}
                  onBlur={() => setIsEditingThreshold(false)}
                  className="w-[50px] text-center border border-gray-300 rounded-md"
                />
              ) : (
                <span onClick={() => setIsEditingThreshold(true)} className="cursor-pointer">
                  {thresholdValue}
                </span>
              )}
            </div>
          </div>
          {/* Record Button */}
          <button
            className="flex p-1 rounded-full w-[50px] transition-all"
            onClick={toggleRecording}
          >
            <img src={record} alt="Record" className="hover:p-[1px] transition-all" />
          </button>

          {/* Play/Replay Button */}
          <button
            className="flex p-1 rounded-full w-[50px] transition-all"
            onClick={showReplayButton ? handleReplay : handlePlayPause}
          >
            <img
              src={showReplayButton ? replay : playIcon}
              alt={showReplayButton ? "Replay" : "Play"}
              className="hover:p-[1px] transition-all"
            />
          </button>

          {/* Back Button */}
          <Link className="flex p-1 rounded-full w-[50px] transition-all" to="/visualgames-1">
            <img src={back} alt="Back" className="hover:p-[1px] transition-all" />
          </Link>
        </div>
      </div>

      {/* Bird Image */}
      <div
        className="absolute"
        style={{
          top: `${birdPosition.top}%`,
          left: `${birdPosition.left}%`,
          maxWidth: "100%",
          height: "auto",
          transform: "translate(-50%, -50%)",
        }}
      >
        <img
          src={teddyImage}
          alt="Teddy with Balloons"
          className="w-full h-auto"
          style={{
            maxWidth: "156px",
            maxHeight: "227px",
            width: "15vw",
            height: "20vw",
          }}
        />
      </div>
      
      {/* Cloud Images */}
      <div
        className="absolute animate-cloud"
        style={{
          top: "10vh",
          left: "55vw",
          width: "25vw",
          height: "19vh",
          aspectRatio: "16/9", // Add this property
        }}
      >
        <img
          src={cloud1}
          alt="Cloud 1"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
      </div>

      <div
        className="absolute animate-cloud"
        style={{
          top: "10vh",
          right: "-50vw",
          width: "25vw",
          height: "19vh",
          aspectRatio: "16/9", // Add this property
        }}
      >
        <img
          src={cloud1}
          alt="Cloud 1"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
      </div>

      <div
        className="absolute animate-cloud"
        style={{
          top: "3vh",
          left: "3vw",
          width: "35vw",
          height: "27vh",
          aspectRatio: "16/9", // Add this property
        }}
      >
        <img
          src={cloud}
          alt="Cloud"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
      </div>

      <div
        className="absolute animate-cloud"
        style={{
          top: "3vh",
          right: "-20vw",
          width: "35vw",
          height: "27vh",
          aspectRatio: "16/9", // Add this property
        }}
      >
        <img
          src={cloud}
          alt="Cloud"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
      </div>

      <div
        className="absolute animate-cloud"
        style={{
          top: "7vh",
          left: "29vw",
          width: "20vw",
          height: "17vh",
          aspectRatio: "16/9", // Add this property
        }}
      >
        <img
          src={cloud2}
          alt="Cloud 2"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
      </div>

      {/* Rocks and Grass */}
      <div
        className="absolute bottom-0 right-0 w-[20vw] h-[20vh]"
        style={{
          backgroundImage: `url(${down})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div
          className="absolute bottom-0 right-[20vw] w-[22vw] h-[20vh]"
          style={{
            backgroundImage: `url(${down})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div
            className="absolute bottom-0 right-[20vw] w-[23vw] h-[20vh]"
            style={{
              backgroundImage: `url(${down})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <div
              className="absolute bottom-0 right-[20vw] w-[23vw] h-[20vh]"
              style={{
                backgroundImage: `url(${down})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              <div
                className="absolute bottom-[-25vh] right-[30vw] w-[20vw] h-[20vh]"
                style={{
                  backgroundImage: `url(${grassimage})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              >
                <div
                  className="absolute bottom-[23vh] right-[-15vw] w-[15vw] h-[15vh]"
                  style={{
                    backgroundImage: `url(${rock})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                >
                  <div
                    className="absolute bottom-[0vh] left-[-11vw] w-[17vw] h-[17vh]"
                    style={{
                      backgroundImage: `url(${rock1})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                    }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Signpost with Text */}
      <div className="absolute bottom-0 right-0 flex items-center">
        <img src={name} alt="Nameboard" className="w-[15vw] h-[30vh]" />
        <div
          className="ml-2 flex flex-col items-start"
          style={{ position: "absolute", top: "2.5vh", left: "10vw" }}
        >
          <span
            className="text-black font-bold font-serif"
            style={{ fontSize: "2.5vw", marginLeft: "-6vw", lineHeight: "1.2" }}
          >
            Bird
          </span>
          <span
            className="text-black font-bold font-serif"
            style={{
              fontSize: "2.5vw",
              marginLeft: "-6.6vw",
              lineHeight: "1.2",
            }}
          >
            Voice
          </span>
        </div>
      </div>
    </div>
  );
};

export default Teddy;
