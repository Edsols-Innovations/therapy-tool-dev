import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelectedModules  } from "../../SelectedDataContext";

const Therapy = () => {
    const [selectedOptions, setSelectedOptions] = useState({
        visualGames: false,
        listeningStudio: false,
        readingLab: false,
        pictorialSoundExercise: false,
        animatedFlashConcepts: false,
    });
    const { setSelectedModules  } = useSelectedModules ();
    const [selectedSubModules, setSelectedSubModules] = useState({
        module1: { subModule1: false, subModule2: false, subModule3: false, subModule4: false },
        module2: { subModule1: false, subModule2: false },
    });

    const [expandedModules, setExpandedModules] = useState({
        visualGames: false,
        module1: false,
        module2: false,
    });

    const handleParentCheckboxChange = (option: string) => {
        const isSelected = !selectedOptions[option];

        if (option === 'visualGames') {
            setSelectedOptions((prevState) => ({
                ...prevState,
                visualGames: isSelected,
            }));
            setSelectedSubModules({
                module1: {
                    subModule1: isSelected,
                    subModule2: isSelected,
                    subModule3: isSelected,
                    subModule4: isSelected,
                },
                module2: { subModule1: isSelected, subModule2: isSelected },
            });
            setExpandedModules((prevState) => ({
                ...prevState,
                visualGames: isSelected,
                module1: isSelected,
                module2: isSelected,
            }));
        } else {
            setSelectedOptions((prevState) => ({
                ...prevState,
                [option]: isSelected,
            }));
        }
    };

    const handleSubModuleChange = (module: string, subModule: string) => {
        setSelectedSubModules((prevState) => ({
            ...prevState,
            [module]: {
                ...prevState[module],
                [subModule]: !prevState[module][subModule],
            },
        }));
    };

    const toggleDropdown = (module: string) => {
        setExpandedModules((prevState) => ({
            ...prevState,
            [module]: !prevState[module],
        }));
    };

    const navigate = useNavigate();

    const handleGoToTherapyware = () => {
        const selectedData = {
            selectedOptions,
            selectedSubModules,
        };
        setSelectedModules(selectedData);
        navigate('/home', { state: selectedData });
    };

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col items-center py-10">
            <h1 className="text-4xl font-bold mb-8 text-gray-800">Therapy Module Selection</h1>
            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-4xl">
                {/* Visual Games Section */}
                <div className="mb-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <input
                                type="checkbox"
                                checked={selectedOptions.visualGames}
                                onChange={() => handleParentCheckboxChange('visualGames')}
                                className="h-5 w-5"
                            />
                            <label className="text-xl font-semibold">Visual Games</label>
                        </div>
                        <button
                            onClick={() => toggleDropdown('visualGames')}
                            className="text-gray-600 text-lg transform transition-transform duration-200"
                        >
                            {expandedModules.visualGames ? '⮟' : '⮞'}
                        </button>
                    </div>
                    {expandedModules.visualGames && (
                        <div className="ml-8 mt-4">
                            {/* Module 1 */}
                            <div className="mb-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-lg font-medium ml-1">Module 1</span>
                                    <button
                                        onClick={() => toggleDropdown('module1')}
                                        className="text-gray-600 text-lg transform transition-transform duration-200"
                                    >
                                        {expandedModules.module1 ? '⮟' : '⮞'}
                                    </button>
                                </div>
                                {expandedModules.module1 && (
                                    <div className="ml-6 mt-2">
                                        <label className="flex items-center text-md mb-2">
                                            <input
                                                type="checkbox"
                                                checked={selectedSubModules.module1.subModule1}
                                                onChange={() =>
                                                    handleSubModuleChange('module1', 'subModule1')
                                                }
                                                className="mr-3 h-4 w-4"
                                            />
                                            Voice Play
                                        </label>
                                        <label className="flex items-center text-md mb-2">
                                            <input
                                                type="checkbox"
                                                checked={selectedSubModules.module1.subModule2}
                                                onChange={() =>
                                                    handleSubModuleChange('module1', 'subModule2')
                                                }
                                                className="mr-3 h-4 w-4"
                                            />
                                            Talk Splash
                                        </label>
                                        <label className="flex items-center text-md mb-2">
                                            <input
                                                type="checkbox"
                                                checked={selectedSubModules.module1.subModule3}
                                                onChange={() =>
                                                    handleSubModuleChange('module1', 'subModule3')
                                                }
                                                className="mr-3 h-4 w-4"
                                            />
                                            Bird Voice
                                        </label>
                                        <label className="flex items-center text-md">
                                            <input
                                                type="checkbox"
                                                checked={selectedSubModules.module1.subModule4}
                                                onChange={() =>
                                                    handleSubModuleChange('module1', 'subModule4')
                                                }
                                                className="mr-3 h-4 w-4"
                                            />
                                            Enlarging Circle
                                        </label>
                                    </div>
                                )}
                            </div>

                            {/* Module 2 */}
                            <div>
                                <div className="flex items-center justify-between">
                                    <span className="text-lg font-medium">Module 2</span>
                                    <button
                                        onClick={() => toggleDropdown('module2')}
                                        className="text-gray-600 text-lg transform transition-transform duration-200"
                                    >
                                        {expandedModules.module2 ? '⮟' : '⮞'}
                                    </button>
                                </div>
                                {expandedModules.module2 && (
                                    <div className="ml-6 mt-2">
                                        <label className="flex items-center text-md mb-2">
                                            <input
                                                type="checkbox"
                                                checked={selectedSubModules.module2.subModule1}
                                                onChange={() =>
                                                    handleSubModuleChange('module2', 'subModule1')
                                                }
                                                className="mr-3 h-4 w-4"
                                            />
                                            Speech Flight
                                        </label>
                                        <label className="flex items-center text-md">
                                            <input
                                                type="checkbox"
                                                checked={selectedSubModules.module2.subModule2}
                                                onChange={() =>
                                                    handleSubModuleChange('module2', 'subModule2')
                                                }
                                                className="mr-3 h-4 w-4"
                                            />
                                            Talk Duckling
                                        </label>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* Other Sections */}
                {['listeningStudio', 'readingLab', 'pictorialSoundExercise', 'animatedFlashConcepts'].map(
                    (option) => (
                        <div className="mb-6" key={option}>
                            <label className="flex items-center text-xl font-semibold space-x-4">
                                <input
                                    type="checkbox"
                                    checked={selectedOptions[option]}
                                    onChange={() => handleParentCheckboxChange(option)}
                                    className="h-5 w-5"
                                />
                                <span>
                                    {option
                                        .replace(/([A-Z])/g, ' $1')
                                        .replace(/^./, (str) => str.toUpperCase())}
                                </span>
                            </label>
                        </div>
                    )
                )}
                {/* Button */}
                <div className="flex justify-end">
                    <button
                        onClick={handleGoToTherapyware}
                        className="px-6 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700"
                    >
                        Go to Therapyware
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Therapy;
