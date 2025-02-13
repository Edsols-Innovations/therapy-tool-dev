import React, { createContext, useContext, useState } from "react";

// Define the types
interface SelectedModules {
    selectedOptions: Record<string, boolean>;
    selectedSubModules: Record<string, Record<string, boolean>>;
}

interface SelectedModulesContextType {
    selectedModules: SelectedModules;
    setSelectedModules: React.Dispatch<React.SetStateAction<SelectedModules>>;
}

// Create the context with a default value
const SelectedModulesContext = createContext<SelectedModulesContextType | undefined>(undefined);

export const SelectedModulesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [selectedModules, setSelectedModules] = useState<SelectedModules>({
        selectedOptions: {},
        selectedSubModules: {},
    });

    return (
        <SelectedModulesContext.Provider value={{ selectedModules, setSelectedModules }}>
            {children}
        </SelectedModulesContext.Provider>
    );
};

export const useSelectedModules = () => {
    const context = useContext(SelectedModulesContext);

    if (!context) {
        throw new Error("useSelectedModules must be used within a SelectedModulesProvider");
    }

    return context;
};
