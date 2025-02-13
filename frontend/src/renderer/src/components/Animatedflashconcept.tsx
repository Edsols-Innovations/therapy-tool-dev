import { Link, useNavigate } from "react-router-dom";

import home from "../assets/AnimatedFlashConcepts/home.png";
import topright from "../assets/AnimatedFlashConcepts/topright.png";
import bottomleft from "../assets/AnimatedFlashConcepts/bottomleft.png";
import edsolslogo from "../assets/AnimatedFlashConcepts/edsolslogo.png";

import parkImg from "../assets/AnimatedFlashConcepts/Park.png";
import dreamLandImg from "../assets/AnimatedFlashConcepts/DreamLand.png";
import zooImg from "../assets/AnimatedFlashConcepts/Zoo.png";
import dayActivityImg from "../assets/AnimatedFlashConcepts/DayActivity.png";
import airTravelImg from "../assets/AnimatedFlashConcepts/AirTravel.png";
import trainTravelImg from "../assets/AnimatedFlashConcepts/TrainTravel.png";
import climateImg from "../assets/AnimatedFlashConcepts/Climate.png";
import sportsEventImg from "../assets/AnimatedFlashConcepts/SportsEvent.png";
import dressCodeImg from "../assets/AnimatedFlashConcepts/Dresscode.png";
import clinicImg from "../assets/AnimatedFlashConcepts/clinic.png";
import MyDailyRoutineVideo from "../assets/AnimatedFlashConcepts/videos/Mydailyroutine.mp4";
import zooVideo from "../assets/AnimatedFlashConcepts/videos/zoo.mp4"
import clinicVideo from "../assets/AnimatedFlashConcepts/videos/clinic.mp4"
import friendsVideo from "../assets/AnimatedFlashConcepts/videos/friends.mp4"
import schoolVideo from "../assets/AnimatedFlashConcepts/videos/Myschool.mp4"
import shopVideo from "../assets/AnimatedFlashConcepts/videos/shopping.mp4"


type Chapter = {
  title: string;
  time: string;
  seconds: number;
};

type GridItem = {
  id: number;
  text: string;
  imageSrc: string;
  videoSrc: string;
  chapters: Chapter[];
};

const items: GridItem[] = [
  {
    id: 1,
    text: "Friends",
    imageSrc: parkImg,
    videoSrc: friendsVideo,
    chapters: [
      { title: "Introduction", time: "0:00", seconds: 0 },
      { title: "Main Scene", time: "0:15", seconds: 15 },
      { title: "Closing", time: "0:25", seconds: 25 },
    ],
  },
  {
    id: 2,
    text: "Shopping",
    imageSrc: dreamLandImg,
    videoSrc: shopVideo,
    chapters: [
      { title: "Welcome", time: "0:00", seconds: 0 },
      { title: "Exploration", time: "0:30", seconds: 30 },
      { title: "Farewell", time: "0:40", seconds: 40 },
    ],
  },
  {
    id: 3,
    text: "Zoo",
    imageSrc: zooImg,
    videoSrc: zooVideo,
    chapters: [
      { title: "Opening", time: "0:00", seconds: 0 },
      { title: "Animal Exhibit", time: "0:20", seconds: 20 },
      { title: "Exit", time: "0:25", seconds: 25 },
    ],
  },
  {
    id: 4,
    text: "Daily Activity",
    imageSrc: dayActivityImg,
    videoSrc: MyDailyRoutineVideo,
    chapters: [
      { title: "Morning", time: "0:00", seconds: 0 },
      { title: "Afternoon", time: "0:30", seconds: 30 },
      { title: "Evening", time: "0:50", seconds: 50 },
    ],
  },
  {
    id: 5,
    text: "AirTravel",
    imageSrc: airTravelImg,
    videoSrc: "/videos/airtravel.mp4",
    chapters: [
      { title: "Takeoff", time: "0:00", seconds: 0 },
      { title: "Mid-Flight", time: "0:40", seconds: 40 },
      { title: "Landing", time: "1:20", seconds: 80 },
    ],
  },
  {
    id: 6,
    text: "TrainTravel",
    imageSrc: trainTravelImg,
    videoSrc: "/videos/traintravel.mp4",
    chapters: [
      { title: "Boarding", time: "0:00", seconds: 0 },
      { title: "Journey", time: "0:35", seconds: 35 },
      { title: "Arrival", time: "1:10", seconds: 70 },
    ],
  },
  {
    id: 7,
    text: "Climate",
    imageSrc: climateImg,
    videoSrc: "/videos/climate.mp4",
    chapters: [
      { title: "Sunny Day", time: "0:00", seconds: 0 },
      { title: "Rainy Day", time: "0:50", seconds: 50 },
      { title: "Storm", time: "1:30", seconds: 90 },
    ],
  },
  {
    id: 8,
    text: "SportsEvent",
    imageSrc: sportsEventImg,
    videoSrc: "/videos/sportsevent.mp4",
    chapters: [
      { title: "Kickoff", time: "0:00", seconds: 0 },
      { title: "Halftime", time: "0:40", seconds: 40 },
      { title: "Full Time", time: "1:20", seconds: 80 },
    ],
  },
  {
    id: 9,
    text: "My School",
    imageSrc: dressCodeImg,
    videoSrc: schoolVideo,
    chapters: [
      { title: "Introduction", time: "0:00", seconds: 0 },
      { title: "Styles", time: "0:20", seconds: 20 },
      { title: "Closing", time: "0:35", seconds: 35 },
    ],
  },
  {
    id: 10,
    text: "Clinic",
    imageSrc: clinicImg,
    videoSrc: clinicVideo,
    chapters: [
      { title: "Registration", time: "0:00", seconds: 0 },
      { title: "Consultation", time: "0:25", seconds: 25 },
      { title: "Checkout", time: "0:40", seconds: 40 },
    ],
  },
];

const AnimatedFlashConcept = () => {
  const navigate = useNavigate();

  const handleNavigation = (videoSrc: string, chapters: Chapter[]) => {
    navigate("/videoplayer", { state: { videoSrc, chapters } });
  };

  return (
    <div className="flex w-screen h-screen bg-[#ab9aee]">
      {/* Sidebar */}
      <div className="w-[4.5%] h-max gap-5 items-center rounded-br-3xl flex flex-col justify-between py-4 bg-[#6f30ae]">
        <Link to="/home" className="w-[70%] rounded-full">
          <img src={home} alt="home" className="rounded-full" />
        </Link>
      </div>
      {/* Main Content */}
      <div className="flex flex-col w-[95.5%]">
        {/* Header */}
        <div className="w-full h-[10vh] justify-center text-black font-sans font-bold text-2xl lg:text-5xl md:text-3xl flex mb-10 py-9">
          Animated Flash Concepts
          <img
            src={topright}
            alt=""
            className="absolute top-0 right-0 h-[0%] md:h-[15%] lg:h-[20%]"
          />
        </div>

        <img
          src={bottomleft}
          alt="Bottom Left Image"
          className="absolute bottom-0 left-0 h-[18%] md:h-[25%] lg:h-[40%] rotate-180 -ml-[20px]"
          style={{ transform: "rotate(360deg)" }}
        />

        {/* Grid */}
        <div className="flex h-[72%] items-center justify-center flex-wrap overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 w-full max-w-6xl h-full p-5">
            {items.map((item) => (
              <div
                key={item.id}
                onClick={() => handleNavigation(item.videoSrc, item.chapters)}
                className="cursor-pointer bg-white rounded-lg hover:shadow-xl flex items-center p-5 z-10"
              >
                <div className="text-2xl font-bold flex-1">{item.text}</div>
                <img
                  src={item.imageSrc}
                  alt={`Image ${item.id}`}
                  className="h-[100px] object-contain"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Footer Logo */}
        <img
          src={edsolslogo}
          className="absolute bottom-[1%] right-[1%] h-[5%]"
          alt="image"
        />
      </div>
    </div>
  );
};

export default AnimatedFlashConcept;
