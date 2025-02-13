import { useState, useRef, useEffect } from 'react';

// Function to retrieve username from patientState in localStorage
const getUsernameFromPatientState = (): string | null => {
  const patientState = localStorage.getItem('patientState');
  
  if (patientState) {
    try {
      const parsedState = JSON.parse(patientState);
      if (parsedState && parsedState.name) {
        return parsedState.name; // Assuming the username is stored as 'name' in patientState
      } else {
        console.error('Unexpected format for patientState in localStorage');
        return null;
      }
    } catch (error) {
      console.error('Error parsing patientState from localStorage:', error);
      return null;
    }
  }

  return null;
};

export const useRatingRecorder = (pageName: string, currentWord: string) => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [ratingData, setRatingData] = useState<any>(null); // State to hold rating data
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  // Get username from patientState
  const username = getUsernameFromPatientState();

  useEffect(() => {
    if (isRecording) {
      navigator.mediaDevices.getUserMedia({ audio: true })
        .then(stream => {
          const mediaRecorder = new MediaRecorder(stream);
          mediaRecorderRef.current = mediaRecorder;
          mediaRecorder.ondataavailable = event => {
            audioChunksRef.current.push(event.data);
          };
          mediaRecorder.onstop = async () => {
            const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/mp3' });
            setAudioBlob(audioBlob);
            audioChunksRef.current = [];

            if (username) {
              // Process and upload the audio
              const uploadedRatingData = await uploadAudio(audioBlob, username, currentWord, pageName);
              setRatingData(uploadedRatingData); // Store the rating data
            } else {
              console.error('Username or pageName not found');
            }
          };
          mediaRecorder.start();
        })
        .catch(error => {
          console.error('Error accessing the microphone:', error);
          setIsRecording(false);
        });
    } else {
      mediaRecorderRef.current?.stop();
    }
  }, [isRecording, username, currentWord, pageName]);

  const toggleRecording = () => {
    setIsRecording(prevState => !prevState);
  };

  const uploadAudio = async (blob: Blob, username: string, word: string, page: string) => {
    const timestamp = new Date().toISOString().replace(/[-:.]/g, ''); // Generate a unique timestamp
    const filename = `${timestamp}-${username}.mp3`;

    // Create FormData for the upload API (MP3)
    const uploadFormData = new FormData();
    uploadFormData.append('file', blob, filename);
    uploadFormData.append('username', username);
    uploadFormData.append('page', page);

    try {
      // Upload the MP3 file
      const uploadResponse = await fetch('http://localhost:8000/therapyware/upload/', {
        method: 'POST',
        body: uploadFormData,
      });

      const uploadData = await uploadResponse.json();
      console.log('Upload successful', uploadData);

      // Create a new Blob with the same audio data for the rating
      const ratingFormData = new FormData();
      const tempfile = `temp.wav`; // You might want to handle WAV conversion if necessary

      ratingFormData.append('file', blob, tempfile); // Assuming you still want to send the mp3 blob
      ratingFormData.append('username', username);
      ratingFormData.append('current_word', word); // Match FastAPI parameter
      ratingFormData.append('page', page);

      // Call the rating API
      const ratingResponse = await fetch('http://localhost:8000/therapyware/rating/', {
        method: 'POST',
        body: ratingFormData,
      });

      const ratingData = await ratingResponse.json();
      console.log('Rating successful', ratingData);
      return ratingData; // Return rating data to store in the state

    } catch (error) {
      console.error('Error occurred during API calls:', error);
      return null; // Return null if there was an error
    }
  };

  return {
    isRecording,
    audioBlob,
    ratingData, // Return the rating data
    toggleRecording,
  };
};
