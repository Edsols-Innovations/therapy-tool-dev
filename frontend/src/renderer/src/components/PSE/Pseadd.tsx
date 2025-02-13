import { useState } from "react";
import { Link } from "react-router-dom";
import { usePSEAudioRecorder } from "../../hooks/usePSEAudioRecorder";
import close from "../../assets/PSE/close.png";
import edit from "../../assets/PSE/edit.png";
import stop from "../../assets/PSE/stop.png";
import record from "../../assets/PSE/record.png";
import { categories } from "./Pse"; // Import categories array

const Pseadd = () => {
  const [word, setWord] = useState("");
  const [submittedWord, setSubmittedWord] = useState<string | null>(null);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState(categories[0].fileName); // Default to the first category
  const [dragging, setDragging] = useState(false);
  const [warningMessage, setWarningMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const { isRecording, toggleRecording } = usePSEAudioRecorder({ word });

  const handleInputChange = (e) => {
    setWord(e.target.value);
  };

  const handleSubmit = () => {
    if (word.trim() !== "") {
      setSubmittedWord(word);
      setWarningMessage(null); // Clear any previous warnings
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSubmit();
    }
  };

  const handleEdit = () => {
    setSubmittedWord(null);
    setWord(submittedWord || "");
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = () => setUploadedImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handlePaste = (e) => {
    e.preventDefault() // Prevent the default paste action

    const clipboardItems = e.clipboardData.items
    for (let i = 0; i < clipboardItems.length; i++) {
      const item = clipboardItems[i]
      if (item.type.startsWith('image/')) {
        const file = item.getAsFile()
        const reader = new FileReader()
        reader.onload = () => setUploadedImage(reader.result as string)
        if (file) {
          reader.readAsDataURL(file)
        }
        break
      }
    }
  }

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragging(true);
  };

  const handleDragLeave = () => {
    setDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = () => setUploadedImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleChangeImage = () => {
    setUploadedImage(null)
  }


  const handleSave = async () => {
    if (!submittedWord) {
      setWarningMessage("Please press Enter to submit the word before saving.");
      return;
    }
  
    if (!uploadedImage) {
      setWarningMessage("Please upload an image before saving.");
      return;
    }
  
    try {
      const formData = new FormData();
      formData.append("word", submittedWord);
      formData.append("category", selectedCategory);
  
      // Convert the base64 image back to a Blob
      const blob = await fetch(uploadedImage).then((res) => res.blob());
      formData.append("image", blob, `${submittedWord}.png`);
  
      console.log("Sending FormData:", formData);
  
      const response = await fetch("http://localhost:8000/therapyware/save-word/", {
        method: "POST",
        body: formData,
      });
  
      if (response.ok) {
        setWarningMessage(null);
        setSuccessMessage("Word and image saved successfully!");
  
        // Clear the form after saving
        setWord("");
        setSubmittedWord(null);
        setUploadedImage(null);
  
        // Clear success message after a few seconds
        setTimeout(() => setSuccessMessage(null), 3000);
      } else {
        console.error("Failed to save the word and image:", response.statusText);
        setWarningMessage("Failed to save the word and image. Please try again.");
      }
    } catch (error) {
      console.error("Error occurred while saving:", error);
      setWarningMessage("An error occurred while saving. Please try again.");
    }
  };
  

  return (
    <div className="w-screen h-screen bg-[rgb(209,235,241)]">
      <div className="h-[18%] flex relative items-end justify-center">
        {warningMessage && (
          <div className="absolute top-20 text-red-500 text-lg mb-4">{warningMessage}</div>
        )}
        {successMessage && (
          <div className="absolute top-20 text-green-500 text-lg mb-4">{successMessage}</div>
        )}
        {submittedWord ? (
          <div className="flex items-center">
            <div className="text-4xl font-bold text-black">{submittedWord}</div>
            <button type="button" onClick={handleEdit} className="p-2">
              <img src={edit} alt="edit" className="w-7 h-5" />
            </button>
          </div>
        ) : (
          <>
            <input
              type="text"
              placeholder="Type a word"
              value={word}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
              className="border-2 border-gray-400 rounded-md p-2 w-[10%] focus:outline-none"
            />
            <button
              type="button"
              onClick={handleSubmit}
              className="ml-4 bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 focus:outline-none"
            >
              Enter
            </button>
          </>
        )}
        <button className="font-bold rounded-full ml-4" onClick={toggleRecording}>
          <img
            src={isRecording ? stop : record}
            alt="record"
            className="w-[45px] rounded-full"
          />
        </button>
        <Link to="/pse">
          <img
            src={close}
            alt="close"
            className="absolute h-[20%] lg:h-[30%] bottom-[30%] lg:bottom-[10%] right-[5%]"
          />
        </Link>
      </div>
      <div className="h-[62%] flex flex-col items-center justify-center">
        <label htmlFor="category" className="block text-lg font-bold mb-2">
          Select Category:
        </label>
        <select
          id="category"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="border-2 border-gray-400 rounded-md p-2 w-[50%] focus:outline-none"
        >
          {categories.map((category) => (
            <option key={category.fileName} value={category.fileName}>
              {category.name}
            </option>
          ))}
        </select>
        <div
          className={`border-2 bg-white rounded-md p-4 w-[35%] h-[80%] mt-4 flex items-center justify-center ${
            dragging ? "border-blue-500" : "border-gray-400"
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onPaste={handlePaste}
        >
          {uploadedImage ? (
            <div className="relative h-[100%] flex p-16">
              <div>
                <img src={uploadedImage} alt="Uploaded" className="h-full object-contain" />
              </div>
              <button
                type="button"
                onClick={handleChangeImage}
                className="absolute bottom-2 right-[40%] bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 focus:outline-none"
              >
                Change Image
              </button>
            </div>
          ) : (
            <div className="text-gray-500 text-center select-none">
              <p>
                {dragging
                  ? "Drop the image here..."
                  : "Drag & drop an image here, paste it, or upload one below"}
              </p>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="mt-4"
              />
            </div>
          )}
        </div>
      </div>
      <div className="h-[20%] flex justify-center items-start px-10">
        <button
          type="button"
          onClick={handleSave}
          className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 focus:outline-none text-xl"
        >
          Save
        </button>
      </div>
    </div>
  );
};

export default Pseadd;
