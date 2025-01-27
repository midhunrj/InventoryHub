import { createContext, ReactNode, useContext, useEffect, useState } from "react";

interface AuthContextType {
  userAuthenticated: boolean;
  setUserAuthenticated: (value: boolean) => void;
}


const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuthContext must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [userAuthenticated, setUserAuthenticated] = useState<boolean>(() => {
        const userData = localStorage.getItem("inventoryData");
        return userData ? JSON.parse(userData) : false;
      });
      
      useEffect(() => {
        localStorage.setItem("inventoryData", JSON.stringify(userAuthenticated));
      }, [userAuthenticated]);

  return (
    <AuthContext.Provider
      value={{
        userAuthenticated,
        setUserAuthenticated
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};


export default AuthProvider;
