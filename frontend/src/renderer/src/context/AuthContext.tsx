import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";

// Define the shape of the user data
interface User {
  id?: string; // Optional for Admin
  name?: string; // Optional for Admin
  role: "Admin" | "Therapist" | "Doctor";
}

// Define the shape of the AuthContext
interface AuthContextType {
  user: User | null;
  login: (
    role: "Admin" | "Therapist" | "Doctor",
    credentials: { username: string; password: string }
  ) => Promise<User>; // Returns the User object after login
  logout: () => void;
  isAuthenticated: boolean;
}

// Create AuthContext
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  // Load user from localStorage when the component mounts
  useEffect(() => {
    const storedUser = localStorage.getItem("userState");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser)); // Parse and set the user
      } catch (error) {
        console.error("Failed to parse stored user:", error);
        localStorage.removeItem("userState"); // Clear invalid state
      }
    }
  }, []);

  // Login function
  const login = async (
    role: "Admin" | "Therapist" | "Doctor",
    credentials: { username: string; password: string }
  ): Promise<User> => {
    try {
      // Endpoint based on the role
      const endpoint = `/auth/${role.toLowerCase()}/signin`;

      const response = await fetch(`http://127.0.0.1:8000${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
      });

      // Handle unsuccessful responses
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Invalid credentials");
      }

      const data = await response.json();

      // Construct user object
      const userData: User = {
        id: role !== "Admin" ? data.id : undefined, // Only non-Admin roles have an ID
        name: role !== "Admin" ? data.name : undefined, // Only non-Admin roles have a name
        role,
      };

      // Save user to state and localStorage
      setUser(userData);
      localStorage.setItem("userState", JSON.stringify(userData));
      return userData;
    } catch (error) {
      console.error("Login failed:", error);

      // Rethrow the error for components to handle
      throw error instanceof Error ? error : new Error("Login failed");
    }
  };

  // Logout function
  const logout = () => {
    setUser(null);
    localStorage.removeItem("userState"); // Clear user state from localStorage
  };

  // Authentication status
  const isAuthenticated = Boolean(user);

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the AuthContext
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
