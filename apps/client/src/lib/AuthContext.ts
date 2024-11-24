import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
  type FC,
} from "react";
import { checkSession } from "./api";

// Define types for user
interface User {
  id?: string;
  email?: string;
}

// Define the shape of our context
interface AuthContextType {
  isLoggedIn: boolean;
  isLoading: boolean;
  error: string | null;
  user: User | null;
  setIsLoggedIn: (value: boolean) => void;
  setUser: (user: User | null) => void;
  logout: () => void;
  refreshAuthState: () => Promise<void>;
}

// Props type for the provider component
interface AuthProviderProps {
  children: ReactNode;
}

// Create the context with initial default values
const AuthContext = createContext<AuthContextType | null>(null);

// Create the provider component with explicit FC type
export const AuthProvider: FC<AuthProviderProps> = (props) => {
  // State for auth status
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);

  // Logout function
  const logout = () => {
    setIsLoggedIn(false);
    setUser(null);
    setError(null);
  };

  // Refresh auth state function
  const refreshAuthState = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await checkSession();
      const data = await response.json();

      setIsLoggedIn(true);
      setUser(data.user || null);
    } catch (err) {
      setIsLoggedIn(false);
      setUser(null);
      setError(err instanceof Error ? err.message : "Authentication failed");
    } finally {
      setIsLoading(false);
    }
  };

  // Check auth status on mount
  useEffect(() => {
    refreshAuthState();

    // Optional: Set up periodic check
    const intervalId = setInterval(refreshAuthState, 5 * 60 * 1000);
    return () => clearInterval(intervalId);
  }, []);

  const contextValue: AuthContextType = {
    isLoggedIn,
    isLoading,
    error,
    user,
    setIsLoggedIn,
    setUser,
    logout,
    refreshAuthState,
  };

  // Return provider using createElement to avoid JSX syntax issues
  return AuthContext.Provider({
    value: contextValue,
    children: props.children,
  });
};

// Export the context hook
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === null) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

// Export the context itself if needed
export { AuthContext };
