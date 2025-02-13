import { useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FaExpand, FaArrowLeft } from "react-icons/fa";
import play from "../assets/VisualGames/SpeechFlight/play.png";
import pause from "../assets/VisualGames/EnlargingCircle/pause.png";
import recordIcon from "../assets/VisualGames/record.png";
import stopRecord from "../assets/VisualGames/stop.png";
import recIndicator from "../assets/VisualGames/RecStatus.png"; // Blinking REC icon
import { useAudioRecorder } from "../hooks/useAudioRecorder";

type Chapter = {
  title: string;
  time: string;
  seconds: number;
};

const VideoPlayerPage = () => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentChapter, setCurrentChapter] = useState<number | null>(null);

  // Audio Recorder Hook
  const { isRecording, toggleRecording } = useAudioRecorder("Speech Video");

  const location = useLocation();
  const navigate = useNavigate();
  const { videoSrc, chapters }: { videoSrc: string; chapters: Chapter[] } = location.state || {
    videoSrc: "",
    chapters: [],
  };

  const handlePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
    }
  };

  const handleFullscreen = () => {
    if (videoRef.current) {
      if (videoRef.current.requestFullscreen) {
        videoRef.current.requestFullscreen();
      } else if ((videoRef.current as any).webkitRequestFullscreen) {
        (videoRef.current as any).webkitRequestFullscreen();
      } else if ((videoRef.current as any).msRequestFullscreen) {
        (videoRef.current as any).msRequestFullscreen();
      }
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const currentTime = videoRef.current.currentTime;

      const newCurrentChapter = chapters.findIndex(
        (chapter, index) =>
          currentTime >= chapter.seconds &&
          (index === chapters.length - 1 || currentTime < chapters[index + 1].seconds)
      );
      setCurrentChapter(newCurrentChapter);
    }
  };

  const handleTimestampClick = (chapterIndex: number, seconds: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime = seconds;
      videoRef.current.play();
      setIsPlaying(true);
      setCurrentChapter(chapterIndex);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row h-screen bg-gradient-to-r from-blue-50 to-indigo-100">
      {/* Back Button */}
      <button
        onClick={() => navigate("/afc")}
        className="absolute top-4 left-4 p-2 text-white bg-blue-500 rounded-full shadow hover:bg-blue-600"
      >
        <FaArrowLeft size={20} />
      </button>

      {/* Video Player Section */}
      <div className="flex-1 flex flex-col items-center justify-center p-6">
        <div className="relative w-4/5 aspect-video bg-gray-900 rounded-xl overflow-hidden shadow-xl">
          <video
            ref={videoRef}
            className="w-full h-full object-cover"
            src={videoSrc}
            controls={false}
            disablePictureInPicture
            controlsList="nodownload"
            onTimeUpdate={handleTimeUpdate}
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            onEnded={() => setIsPlaying(false)}
          ></video>
        </div>

        {/* Playback & Recording Controls */}
        <div className="flex items-center justify-between mt-6 space-x-6">
          {/* Play/Pause Button */}
          <button onClick={handlePlayPause} className="p-4 text-white rounded-full transition-transform transform hover:scale-105">
            <img src={isPlaying ? pause : play} alt="Play/Pause" className="w-10 h-10" />
          </button>

          {/* Fullscreen Button */}
          <button onClick={handleFullscreen} className="p-3 text-black rounded-full transition-transform transform hover:scale-105 border-black">
            <FaExpand className="text-black w-8 h-8" />
          </button>

          {/* Fixed-width container to prevent layout shifting */}
          <div className="flex items-center space-x-2">
            {/* Record Button */}
            <button onClick={toggleRecording} className="p-4 text-white rounded-full transition-transform transform hover:scale-105">
              <img src={isRecording ? stopRecord : recordIcon} alt="Record" className="w-10 h-10" />
            </button>
          </div>
          {/* Blinking REC Indicator (aligned to right) */}
          {isRecording && (
              <img src={recIndicator} className="animate-pulse h-6 absolute right-1/2" alt="Recording Indicator" />
            )}
        </div>
      </div>

      {/* Chapters Section */}
      <div className="lg:w-96 w-full bg-white shadow-lg rounded-xl overflow-y-auto border-t lg:border-t-0 lg:border-l border-gray-300 p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Sections</h2>
        <ul className="space-y-4">
          {chapters.map((chapter, index) => (
            <li
              key={index}
              onClick={() => handleTimestampClick(index, chapter.seconds)}
              className={`flex items-center space-x-4 p-4 ${
                currentChapter === index ? "bg-blue-200" : "bg-gray-100"
              } hover:bg-gray-200 rounded-lg shadow-md cursor-pointer transform transition-transform hover:scale-105`}
            >
              <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                {chapter.time}
              </div>
              <div className="text-lg font-medium text-gray-700">{chapter.title}</div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default VideoPlayerPage;
