import { createContext, useState } from "react";

export const MyContext = createContext();

export const MyContextProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [loadingCount, setLoadingCount] = useState(0);

  const startLoading = () => setLoadingCount((prev) => prev + 1);
  const stopLoading = () => setLoadingCount((prev) => Math.max(prev - 1, 0));
  const appLoading = loadingCount > 0;

  return (
    <MyContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        isLoginOpen,
        setIsLoginOpen,
        isRegisterOpen,
        setIsRegisterOpen,
        startLoading,
        stopLoading,
        appLoading,
      }}
    >
      {children}
    </MyContext.Provider>
  );
};
