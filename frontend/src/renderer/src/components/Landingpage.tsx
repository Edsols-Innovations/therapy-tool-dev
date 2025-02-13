import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { RiAccountCircleLine } from "react-icons/ri";
import { Link } from "react-router-dom";
import { useSelectedModules } from "./SelectedDataContext";

import logo from "../assets/LandingPage/edsols.png";
import sun from "../assets/LandingPage/sun.png";
import grass from "../assets/LandingPage/grass.png";

import visualGames from "../assets/LandingPage/vg.png";
import listeningStudio from "../assets/LandingPage/lstudio.png";
import readingLab from "../assets/LandingPage/rlab.png";
import pse from "../assets/LandingPage/pse.png";
import afc from "../assets/LandingPage/afc.png";

const LandingPage = () => {
  const navigate = useNavigate(); // Use navigate from react-router-dom
  const { selectedModules } = useSelectedModules(); // Get selectedModules from context
  const [isTabVisible, setIsTabVisible] = useState(false);

  const patientState = JSON.parse(localStorage.getItem("patientState") || "{}");

  const handleLogout = () => {
    if (patientState?.id) {
        // Redirect to patient details if patient ID exists
        navigate('/patientdetails', { state: { id: patientState.id, mode: 'existing', role: patientState.role } });
    } else {
        // Redirect to patient list if no patient state is found
        navigate('/patientlist');
    }
};


  // Check if any submodules in Visual Games are selected
  const isAnyVisualGamesSubModuleSelected =
    Object.values(selectedModules.selectedSubModules.module1 || {}).some(
      (value) => value
    ) || Object.values(selectedModules.selectedSubModules.module2 || {}).some((value) => value);

  return (
    <div className="flex flex-col bg-sky-400 w-screen h-screen">
      {/* Header */}
      <div className="flex h-max w-full justify-between items-center">
        <img
          src={sun}
          alt="Sun"
          className="w-[100px] sm:w-[150px] md:w-[250px] lg:w-[300px] h-auto"
        />
        <div className="flex flex-col md:flex-row md:h-1/4 h-5/6 w-20 md:w-40 bg-white rounded-full">
          <button
            onClick={() => setIsTabVisible((prev) => !prev)}
            className="flex w-full md:w-1/2 h-full justify-center items-center hover:bg-gray-200 rounded-t-full md:rounded-r-none md:rounded-l-full border-b-[1px] md:border-b-0 md:border-r-[1px] transition-all"
          >
            <RiAccountCircleLine size={28} />
          </button>
          {isTabVisible && (
            <div className="z-10 absolute left-[25%] top-0 mt-5 p-4 bg-white border rounded shadow-lg w-80">
              <h3 className="text-lg font-bold">Profile</h3>
              <div className="mt-2">
                <p>
                  <strong>Name:</strong> {patientState.name || "N/A"}
                </p>
                <p>
                  <strong>Age:</strong> {patientState.age !== undefined && patientState.age !== null ? patientState.age : "N/A"}
                </p>
              </div>
            </div>
          )}
          <button
            onClick={handleLogout}
            className="flex w-full md:w-1/2 h-full justify-center items-center hover:bg-gray-200 rounded-b-full md:rounded-b-none md:rounded-r-full transition-all"
          >
            Logout
          </button>
        </div>
        <img
          src={logo}
          alt="Logo"
          className="w-[175px] sm:w-[225px] md:w-[275px] lg:w-[325px] h-auto"
        />
      </div>

      {/* Main Content */}
      <div className="flex md:h-max p-10 md:px-0 h-max bg-sky-400 w-full justify-center">
        <div className="flex flex-wrap justify-center gap-10 h-full w-full md:w-3/4">
          {/* Render Modules Based on Selection */}
          {(selectedModules.selectedOptions.visualGames ||
            isAnyVisualGamesSubModuleSelected) && (
            <Link
              to="/visualgames-1"
              className="flex flex-col w-full sm:w-1/2 md:w-1/3 lg:w-1/4 bg-[#76d4ff] rounded-xl hover:shadow-xl transition-all"
            >
              <div className="h-1/4 pl-5 py-3 text-2xl font-bold">Visual Games</div>
              <div className="flex h-3/4 w-full p-3 items-center justify-end">
                <img src={visualGames} alt="Visual Games" className="h-[100px]" />
              </div>
            </Link>
          )}

          {selectedModules.selectedOptions.listeningStudio && (
            <Link
              to="/listeningstudio"
              className="flex flex-col w-full sm:w-1/2 md:w-1/3 lg:w-1/4 bg-[#e4eec3] rounded-xl hover:shadow-xl transition-all"
            >
              <div className="h-1/4 pl-5 py-3 text-2xl font-bold">Listening Studio</div>
              <div className="flex h-3/4 w-full p-3 items-center justify-end">
                <img src={listeningStudio} alt="Listening Studio" className="h-[100px]" />
              </div>
            </Link>
          )}

          {selectedModules.selectedOptions.readingLab && (
            <Link
              to="/readinglab"
              className="flex flex-col w-full sm:w-1/2 md:w-1/3 lg:w-1/4 bg-[#f8d2e2] rounded-xl hover:shadow-xl transition-all"
            >
              <div className="h-1/4 pl-5 py-3 text-2xl font-bold">Reading Laboratory</div>
              <div className="flex h-3/4 w-full p-3 items-center justify-end">
                <img src={readingLab} alt="Reading Laboratory" className="h-[100px]" />
              </div>
            </Link>
          )}

          {selectedModules.selectedOptions.pictorialSoundExercise && (
            <Link
              to="/pse"
              className="flex flex-col w-full sm:w-1/2 md:w-1/3 lg:w-1/4 bg-[#83f5ef] rounded-xl hover:shadow-xl transition-all"
            >
              <div className="h-1/4 pl-5 py-3 text-2xl font-bold">Pictorial Sound Exercise</div>
              <div className="flex h-3/4 w-full p-3 items-center justify-end">
                <img src={pse} alt="Pictorial Sound Exercise" className="h-[100px]" />
              </div>
            </Link>
          )}

          {selectedModules.selectedOptions.animatedFlashConcepts && (
            <Link
              to="/afc"
              className="flex flex-col w-full sm:w-1/2 md:w-1/3 lg:w-1/4 bg-[#d0c4ff] rounded-xl hover:shadow-xl transition-all"
            >
              <div className="h-1/4 pl-5 py-3 text-2xl font-bold">Animated Flash Concepts</div>
              <div className="flex h-3/4 w-full p-3 items-center justify-end">
                <img src={afc} alt="Animated Flash Concepts" className="h-[100px]" />
              </div>
            </Link>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="flex w-full h-full bg-sky-400 items-end">
        <img className="w-full" src={grass} alt="" />
      </div>
    </div>
  );
};

export default LandingPage;
