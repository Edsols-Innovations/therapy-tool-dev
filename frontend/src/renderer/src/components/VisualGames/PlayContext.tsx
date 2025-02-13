import React, { createContext, useState, useContext, ReactNode } from 'react';

interface PlayContextType {
  selectedLines: string[];
  setSelectedLines: (lines: string[]) => void;
  speed: string;
  setSpeed: (speed: string) => void;
}

const PlayContext = createContext<PlayContextType | undefined>(undefined);

export const PlayProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [selectedLines, setSelectedLines] = useState<string[]>([]);
  const [speed, setSpeed] = useState<string>('');

  return (
    <PlayContext.Provider value={{ selectedLines, setSelectedLines, speed, setSpeed }}>
      {children}
    </PlayContext.Provider>
  );
};

export const usePlayContext = () => {
  const context = useContext(PlayContext);
  if (!context) {
    throw new Error('usePlayContext must be used within a PlayProvider');
  }
  return context;
};