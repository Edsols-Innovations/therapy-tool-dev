import { Link } from "react-router-dom";
import { useSelectedModules } from "./SelectedDataContext";

import home from "../assets/VisualGames/landing/home.png";
import rope from "../assets/VisualGames/landing/rope.png";
import label from "../assets/VisualGames/landing/daylabel.png";

import flight from "../assets/VisualGames/landing/flight.png";
import duck from "../assets/VisualGames/landing/duck.png";
import mod1 from "../assets/VisualGames/landing/mod1Select.png";
import mod2select from "../assets/VisualGames/landing/mod2.png";

// Define types for submodules
interface SubModule {
  name: string;
  path: string;
  img: string;
  description: string;
}

interface ModuleData {
  [key: string]: SubModule[];
}

interface SelectedSubModules {
  [key: string]: {
    [subModuleKey: string]: boolean;
  };
}

const VisualGamesMain = () => {
  const { selectedModules } = useSelectedModules() as {
    selectedModules: {
      selectedSubModules: SelectedSubModules;
    };
  };

  const subModules: ModuleData = {
    module2: [
      { name: "Speech flight", path: "/speechflight", img: flight, description: "To Learn Custom Sentences" },
      { name: "Talk Duckling", path: "/talkduckling", img: duck, description: "To Learn Custom Sentences" },
    ],
  };

  const getSelectedSubModules = (): SubModule[] => {
    const selected: SubModule[] = [];
    Object.keys(selectedModules.selectedSubModules).forEach((moduleKey) => {
      const module = selectedModules.selectedSubModules[moduleKey];
      const moduleData = subModules[moduleKey] || [];
      moduleData.forEach((subModule, index) => {
        if (module[`subModule${index + 1}`]) {
          selected.push(subModule);
        }
      });
    });
    return selected;
  };

  const selectedSubModules = getSelectedSubModules();

  return (
    <div className="bg-[url('/src/assets/VisualGames/landing/nightbg.png')] w-screen h-screen bg-cover relative overflow-hidden flex">
      <img src={label} alt="board" className="absolute bottom-[-5%] left-[-3%] w-[20%]" />
      <div className="w-[4.5%] h-max gap-5 items-center rounded-br-3xl flex flex-col justify-between py-4 bg-[#ffffff]">
        <Link to="/home" className="w-[70%] rounded-full">
          <img src={home} alt="home" className="rounded-full" />
        </Link>
      </div>
      <div className="flex justify-center gap-96 w-[71%] ml-32">
        {selectedSubModules.map((subModule, index) => (
          <div className="flex flex-col items-center w-[18%] relative" key={index}>
            <div className="w-[25px] h-[30%] overflow-hidden">
              <img src={rope} alt="rope" className="w-full object-cover" />
            </div>
            <div className="relative w-full h-[20%] flex justify-center items-center group">
              <Link
                to={subModule.path}
                className="relative shadow-xl bg-white w-full h-full flex flex-col justify-start items-center p-4 border border-gray-300 group-hover:rounded-b-none rounded-lg overflow-hidden z-10"
              >
                <img src={subModule.img} alt={subModule.name} className="absolute h-[70%] w-[90%]" />
                <span className="font-bold text-2xl absolute bottom-[5%]">{subModule.name}</span>
              </Link>
              <div className="absolute inset-0 bg-sky-300 text-black group-hover:opacity-100 group-hover:translate-y-44 transition-transform duration-500 rounded-lg">
                <div className="flex flex-col items-center h-full justify-center">
                  <p className="text-center p-2 text-xl font-semibold">{subModule.description}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <Link to="/visualgames-1">
        <img src={mod1} alt="module1" className="absolute right-12 h-[17%] z-10" />
      </Link>
      <Link to="/visualgames-2">
        <img src={mod2select} alt="module2" className="absolute top-[15%] right-12 h-[17%]" />
      </Link>
    </div>
  );
};

export default VisualGamesMain;
