import { useState, useRef, useEffect } from 'react';


interface usePSEAudioRecorderProps {
  word: string;
}

export const usePSEAudioRecorder = ({ word }: usePSEAudioRecorderProps) => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  

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
            if (word) {
              uploadAudio(audioBlob, word);
            } else {
              console.error('Username or word not found');
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
  }, [isRecording]);

  const toggleRecording = () => {
    setIsRecording(prevState => !prevState);
  };

  const uploadAudio = async (blob: Blob, word: string) => {
    console.log(word)
    const formData = new FormData();
    formData.append('file', blob, `${word}.mp3`); 
    formData.append('word', word);

    try {
      const response = await fetch('http://localhost:8000/therapyware/upload-pse/', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Failed to upload: ${response.statusText}`);
      }

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
