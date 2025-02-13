import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import home from "../../assets/PSE/home.png";
import edsolslogo from "../../assets/PSE/edsols.png";
import bottomplant from "../../assets/PSE/bottomplant.png";
import hangingplant from "../../assets/PSE/hangingplant.png";

export const categories = [
  { name: "Household Items", fileName: "Household_Items.txt" },
  { name: "Clothing and Accessories", fileName: "Clothing_and_Accessories.txt" },
  { name: "Food and Beverages", fileName: "Food_and_Beverages.txt" },
  { name: "Fruits", fileName: "Fruits.txt" },
  { name: "Vegetables", fileName: "Vegetables.txt" },
  { name: "Flowers", fileName: "Flowers.txt" },
  { name: "Animals", fileName: "Animals.txt" },
  { name: "Birds", fileName: "Birds.txt" },
  { name: "Insects and Small Creatures", fileName: "Insects_and_Small_Creatures.txt" },
  { name: "Stationery", fileName: "Stationery.txt" },
  { name: "Modes of Transportation", fileName: "Modes_of_Transportation.txt" },
  { name: "Body Parts", fileName: "Body_Parts.txt" },
  { name: "Family", fileName: "Family.txt" },
  { name: "Bedding", fileName: "Bedding.txt" },
  { name: "Emotions", fileName: "Emotions.txt" },
];

const Pse = () => {
  const [filteredWords, setFilteredWords] = useState<string[]>([]);
  const [selectedWords, setSelectedWords] = useState<Set<string>>(new Set());
  const [addedWords, setAddedWords] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("Household Items");

  const navigate = useNavigate();

  useEffect(() => {
    // Fetch words for the default category
    const defaultCategory = categories.find((cat) => cat.name === "Household Items");
    if (defaultCategory) fetchCategoryData(defaultCategory.fileName);
  }, []);

  const fetchCategoryData = async (fileName: string) => {
    try {
      setIsLoading(true);
      const response = await fetch(`http://localhost:8000/therapyware/fetchpse/${fileName}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch ${fileName}`);
      }
      const data = await response.json();
      const words = data.content
        .split("\n")
        .map((line: string) => line.trim())
        .filter((line: string) => line.length > 0);

      setFilteredWords(words);
    } catch (error) {
      console.error("Error fetching file:", error);
      setFilteredWords([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteWords = async () => {
    if (
      window.confirm(
        "Are you sure you want to delete the selected words? This action cannot be undone."
      )
    ) {
      try {
        const categoryFileName = categories.find(
          (category) => category.name === selectedCategory
        )?.fileName;

        if (!categoryFileName) {
          console.error("Selected category not found");
          alert("The selected category does not exist. Please choose a valid category.");
          return;
        }

        const response = await fetch(
          "http://localhost:8000/therapyware/delete-words/",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              category: categoryFileName,
              words: Array.from(selectedWords),
            }),
          }
        );

        if (response.ok) {
          const result = await response.json();
          console.log(result.message);

          // Update state after successful deletion
          setFilteredWords((prevFilteredWords) =>
            prevFilteredWords.filter((word) => !selectedWords.has(word))
          );
          setSelectedWords(new Set());
        } else {
          const errorResponse = await response.json();
          console.error("Failed to delete words:", errorResponse.detail);
          alert(`Error: ${errorResponse.detail}`);
        }
      } catch (error) {
        console.error("Error deleting words:", error);
        alert("An unexpected error occurred. Please try again.");
      }
    }
  };

  const handleCategoryClick = (categoryName: string, fileName: string) => {
    setSelectedCategory(categoryName);
    fetchCategoryData(fileName);
  };

  const handleWordClick = (word: string) => {
    setSelectedWords((prevSelectedWords) => {
      const newSelectedWords = new Set(prevSelectedWords);
      if (newSelectedWords.has(word)) {
        newSelectedWords.delete(word);
      } else {
        newSelectedWords.add(word);
      }
      return newSelectedWords;
    });
  };

  return (
    <div className="flex bg-[rgb(209,235,241)] w-screen h-screen flex-grow">
      <div className="bg-[#1f7772] h-max gap-5 items-center rounded-br-3xl flex flex-col justify-between py-4">
        <Link to="/home" className="w-[60%] md:w-[70%] rounded-full">
          <img src={home} alt="home" />
        </Link>
      </div>

      <img
        src={bottomplant}
        alt="Another Image"
        className="absolute bottom-[0%] -left-[3%] w-[2%] h-[5%] md:w-[6%] md:h-[10%] lg:w-[11%] lg:h-[26%] z-10"
      />
      <img
        src={hangingplant}
        alt="Example Image"
        className="absolute top-[0%] right-[0%] w-[5%] h-[2%] md:w-[10%] md:h-[5%] lg:w-[15%] lg:h-[20%] z-10"
      />

      <div className="w-full h-screen flex flex-col">
        <div className="max-h-[10vh] font-bold text-[20px] sm:text-[24px] md:text-[32px] lg:text-[40px] xl:text-[45px] 2xl:text-[50px] pl-4 sm:pl-4 md:pl-6 lg:pl-8 xl:pl-8 2xl:pl-20 flex items-start lg:justify-start">
          Pictorial Sound Exercise
        </div>

        <div className="flex flex-col w-full max-h-[40%] 2xl:h-auto bg-[rgb(209,235,241)]">
          <div className="flex gap-0 flex-wrap bg-[rgb(209,235,241)] pr-4 md:pr-6 lg:pr-8 pl-4 md:pl-6 lg:pl-20 rounded-lg w-full lg:w-[90%] xl:w-[90%] 2xl:w-[70%] overflow-auto">
            {categories.map((category) => (
              <button
                key={category.name}
                className={`rounded-lg hover:shadow-xl flex items-center justify-center px-4 py-2 md:px-6 md:py-3 lg:px-8 lg:py-4 text-lg md:text-xl font-bold mr-3 md:mr-5 mb-3 md:mb-5 transition-all ${
                  selectedCategory === category.name
                    ? "bg-white text-[#1f7772]"
                    : "bg-[#1f7772] text-white"
                }`}
                onClick={() => handleCategoryClick(category.name, category.fileName)}
              >
                {category.name}
              </button>
            ))}
          </div>

          <div className="ml-16 px-4 w-[20%]">
            <input
              type="text"
              placeholder="Search words..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="p-2 border rounded-md w-full"
            />
          </div>
        </div>

        <div className="flex-grow bg-[rgb(209,235,241)] w-full h-[54%] p-0 md:px-5 xl:px-16 2xl:px-20 py-5 flex flex-col md:flex-row items-center md:justify-between md:items-stretch space-y-5 md:space-y-0">
          <div className="bg-white w-[60%] md:w-[40%] h-[40%] md:h-auto rounded-xl p-2 md:p-4 xl:p-8 md:justify-start overflow-auto flex">
            {isLoading ? (
              <div>Loading...</div>
            ) : (
              <ul className="w-full">
                {filteredWords
                  .filter((word) =>
                    word.toLowerCase().startsWith(searchQuery.toLowerCase())
                  )
                  .map((word, index) => (
                    <li
                      key={index}
                      className={`text-black font-bold text-lg mb-2 cursor-pointer ${
                        selectedWords.has(word) ? "bg-gray-300" : ""
                      }`}
                      onClick={() => handleWordClick(word)}
                    >
                      {word}
                    </li>
                  ))}
              </ul>
            )}
          </div>

          <div className="w-[15%] flex flex-col">
            <div className="flex md:flex-col justify-center items-center bg-[#1f7772] rounded-3xl p-3 md:p-4 xl:p-8 w-full max-w-[100%] h-max max-h-[100%] mt-5 lg:mt-0 overflow-auto">
              <div className="flex md:flex-col w-full">
                <button
                  className="text-white font-bold p-1 md:p-4 w-max md:w-full text-center border-r md:border-r-0 md:border-b"
                  onClick={() => setAddedWords([...addedWords, ...Array.from(selectedWords)])}
                >
                  Add
                </button>
                <button
                  className="text-white font-bold p-1 md:p-4 w-max md:w-full text-center border-r md:border-r-0 md:border-b"
                  onClick={() => setAddedWords([...addedWords, ...filteredWords])}
                >
                  Add all
                </button>
                <button
                  className="text-white font-bold p-1 md:p-4 w-max md:w-full text-center border-r md:border-r-0 md:border-b"
                  onClick={() => setSelectedWords(new Set())}
                >
                  Clear
                </button>
                <button
                  className="text-white font-bold p-1 md:p-4 w-max md:w-full text-center border-r md:border-r-0 md:border-b"
                  onClick={() => setAddedWords([])}
                >
                  Clear all
                </button>
                <button
                  className="text-white font-bold p-1 md:p-4 w-max md:w-full text-center"
                  onClick={() => navigate("/pse1", { state: { addedWords } })}
                  disabled={addedWords.length === 0}
                >
                  Ok
                </button>
              </div>
            </div>

            <div className="flex md:flex-col justify-center items-center bg-[#1f7772] rounded-3xl p-3 md:p-4 xl:p-8 w-full max-w-[100%] h-max max-h-[100%] mt-5 overflow-auto">
              <Link
                to="/pseaddnew"
                className="text-white font-bold p-1 md:p-4 w-max md:w-full text-center border-r md:border-r-0 md:border-b"
              >
                Add new
              </Link>
              <button
                className="text-white font-bold p-1 md:p-4 w-max md:w-full text-center"
                onClick={handleDeleteWords}
                disabled={selectedWords.size === 0}
              >
                Delete
              </button>
            </div>
          </div>

          <div className="bg-white w-[60%] md:w-[40%] h-[40%] md:h-auto rounded-xl p-2 md:p-4 xl:p-8 md:justify-start overflow-auto flex">
            <ul className="w-full">
              {addedWords.map((word, index) => (
                <li
                  key={index}
                  className={`text-black font-bold text-lg mb-2 cursor-pointer ${
                    selectedWords.has(word) ? "bg-gray-300" : ""
                  }`}
                  onClick={() => handleWordClick(word)}
                >
                  {word}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="absolute p-4 bottom-0 right-0">
          <img
            src={edsolslogo}
            alt="Background Design"
            className="object-contain w-[50px]"
          />
        </div>
      </div>
    </div>
  );
};

export default Pse;
