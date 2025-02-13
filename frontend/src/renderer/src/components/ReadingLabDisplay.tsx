import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useRatingRecorder } from '../hooks/useRatingRecorder';

import exit from '../assets/ReadingLab/exit.png';
import record from '../assets/ReadingLab/record.png';
import status from '../assets/ReadingLab/RecStatus.png';
import stop from '../assets/ReadingLab/stop.png';
import playpause from '../assets/ReadingLab/playpause.png';
import next from '../assets/ReadingLab/next.png';
import previous from '../assets/ReadingLab/prev.png';
import replay from '../assets/ReadingLab/replay.png';

// Default image and dynamic import for verbs folder
const defaultImage = new URL('../assets/ReadingLab/verbs/default.png', import.meta.url).href;
const verbImages = import.meta.glob('../assets/ReadingLab/verbs/*.{png,jpg,jpeg,svg}', { eager: true });

const ReadingLabDisplay: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedLines, setSelectedLines] = useState<string[]>([]);
  const [duration, setDuration] = useState<string>('');
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [isReplay, setIsReplay] = useState<boolean>(true);
  const [, setAnimationKey] = useState<number>(0); // Key to force re-render of animation
  const [currentWord, setCurrentWord] = useState<string>(''); // State to hold the current word
  const [displayRating, setDisplayRating] = useState<boolean>(false);
  const [isShowingQuestion, setIsShowingQuestion] = useState<boolean>(true); // Track whether to show question or answer
  const { isRecording, ratingData, toggleRecording } = useRatingRecorder('PSE', currentWord);
  const [speed, setSpeed] = useState<number | null>(null);

  useEffect(() => {
    if (location.state) {
      const { lines, speed } = location.state as { lines: string[]; speed: string };
      const parsedSpeed = parseInt(speed, 10);
      setSelectedLines(lines);
      setSpeed(parsedSpeed); // Set the speed for the slider
      const scaleFactor = 0.8; // Adjust for smoother scaling
      const baseDuration = 100000;
      const range = 99000;
      const calculatedDuration = baseDuration - Math.pow(parsedSpeed / 100, scaleFactor) * range;
      setDuration(String(Math.round(calculatedDuration))); // Use consistent formula for duration
      setCurrentIndex(0);
      setAnimationKey((prevKey) => prevKey + 1);
      setCurrentWord(lines[0]); // Set initial word
    }
  }, [location.state]);

  useEffect(() => {
    if (ratingData) {
      setDisplayRating(ratingData); // Show the rating when available
    }
  }, [ratingData]);

  const handleExitClick = () => {
    navigate('/readinglab');
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex < selectedLines.length - 1 ? prevIndex + 1 : prevIndex
    );
    toggleReplay();
    setDisplayRating(false);
    setCurrentWord(selectedLines[currentIndex + 1]); // Update for next line
  };

  const handlePrevious = () => {
    setCurrentIndex((prevIndex) => (prevIndex > 0 ? prevIndex - 1 : prevIndex));
    toggleReplay();
    setDisplayRating(false);
    setCurrentWord(selectedLines[currentIndex - 1]); // Update for previous line
  };

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const toggleReplay = () => {
    setIsReplay(!isReplay);
    setDisplayRating(false);
  };

  const handleSpeedChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const input = parseInt(event.target.value, 10);
    if (!isNaN(input) && input >= 1 && input <= 100) {
      const scaleFactor = 0.8;
      const baseDuration = 100000;
      const range = 99000;
      const calculatedDuration = baseDuration - Math.pow(input / 100, scaleFactor) * range;
      setDuration(String(Math.round(calculatedDuration)));
    }
  };

  const toggleQuestionAnswer = () => {
    setIsShowingQuestion((prev) => !prev); // Toggle between showing question and answer
  };

  const getDisplayedText = () => {
    const currentLine = selectedLines[currentIndex] || '';
    if (currentLine.includes('?')) {
      const [question, answer] = currentLine.split('?');
      return isShowingQuestion ? `${question.trim()}?` : answer.trim();
    }
    return currentLine;
  };

  const getCurrentImage = () => {
    const currentWord = selectedLines[currentIndex]?.toLowerCase() || '';
    const imagePath = `../assets/ReadingLab/verbs/${currentWord}.png`;
    return (verbImages[imagePath] as { default: string })?.default || defaultImage;
  };

  return (
    <div className="flex flex-col relative w-screen h-screen overflow-hidden bg-[#088BE5] text-white justify-between">
      <div className="flex h-[20vh] gap-10 justify-end">
        {isRecording && (
          <img src={status} className="mt-20 h-[40px] animate-pulse" alt="Recording Indicator" />
        )}
        <button className="justify-end h-max w-max mt-20 mr-20" onClick={handleExitClick}>
          <img src={exit} alt="Exit icon" />
        </button>
        {displayRating && ratingData && (
          <div className="absolute left-10 top-20">
            <span className="text-2xl">Matching: {(ratingData.rating * 10).toFixed(2)}%</span>
          </div>
        )}
      </div>
      <div className="flex justify-end h-[70vh] w-full">
        <div
          className={`flex w-max justify-end ${isPlaying ? 'pause' : ''} ${
            isReplay ? 'animate-marquee' : 'animate-marqueereplay'
          }`}
          style={{ animationDuration: `${duration}ms` }}
        >
          <div className="flex min-w-[100vw] items-center justify-start">
            {selectedLines.length > 0 ? (
              <div className="text-8xl whitespace-nowrap">
                <span>{getDisplayedText()}</span>
              </div>
            ) : (
              <div className="text-xl flex w-[100vw] justify-center">No lines selected</div>
            )}
          </div>
        </div>
      </div>
      <div className="flex flex-col w-full h-[20vh] items-center justify-center gap-10">
        <div className="flex w-full items-center justify-center gap-3">
          <button onClick={toggleRecording} className="rounded-full">
            <img
              src={isRecording ? stop : record}
              alt="Record icon"
              className="h-[50px] w-[50px] rounded-full"
            />
          </button>
          <button onClick={togglePlayPause} className="rounded-full">
            <img src={playpause} alt="Play/Pause icon" className="h-[50px] w-[50px] rounded-full" />
          </button>
          <button onClick={toggleReplay} className="text-white font-bold rounded-full">
            <img src={replay} alt="Replay icon" className="h-[50px] w-[50px] rounded-full" />
          </button>
          <button onClick={handlePrevious} disabled={currentIndex === 0} className="rounded-full">
            <img src={previous} alt="" className="h-[50px] w-[50px] rounded-full" />
          </button>
          <button
            onClick={handleNext}
            disabled={currentIndex === selectedLines.length - 1}
            className="rounded-full"
          >
            <img src={next} alt="" className="h-[50px] w-[50px] rounded-full" />
          </button>
          <button onClick={toggleQuestionAnswer} className="rounded-full bg-black p-2">
            {isShowingQuestion ? 'Show Answer' : 'Show Question'}
          </button>
        </div>
        <div className="flex items-center ml-4">
          <label htmlFor="speed-slider" className="mr-2 font-mono">
            Speed:
          </label>
          {speed !== null && ( // Render slider only when speed is available
            <input
              id="speed-slider"
              type="range"
              min="1"
              max="100"
              step="1"
              value={speed} // Bind slider value to the speed state
              onChange={(event) => {
                const input = parseInt(event.target.value, 10);
                if (!isNaN(input)) {
                  setSpeed(input); // Update speed state
                  handleSpeedChange(event); // Update duration
                }
              }}
              className="w-[400px] accent-white"
            />
          )}
        </div>
      </div>
      <div className="absolute left-10 -bottom-10">
        <img className="h-[500px]" src={getCurrentImage()} alt="Dynamic Illustration" />
      </div>
    </div>
  );
};

export default ReadingLabDisplay;
