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

export const useAudioRecorder = (pageName: string) => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
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
          mediaRecorder.onstop = () => {
            const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/mp3' });
            setAudioBlob(audioBlob);
            audioChunksRef.current = [];
            if (username) {
              uploadAudio(audioBlob, username, pageName);
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
  }, [isRecording, username, pageName]);

  const toggleRecording = () => {
    setIsRecording(prevState => !prevState);
  };

  const uploadAudio = async (blob: Blob, username: string, pageName: string) => {
    const formData = new FormData();
    const timestamp = new Date().toISOString().replace(/[-:.]/g, ''); // Generate a unique timestamp
    const filename = `${timestamp}-${username}.mp3`;
    formData.append('file', blob, filename);
    formData.append('username', username);
    formData.append('page', pageName);

    try {
      const response = await fetch('http://localhost:8000/therapyware/upload/', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      console.log('Upload successful', data);
    } catch (error) {
      console.error('Upload error', error);
    }
  };

  return {
    isRecording,
    audioBlob,
    toggleRecording,
  };
};
