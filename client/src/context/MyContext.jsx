import React, { createContext, useState } from "react";

export const MyContext = createContext();

export const MyContextProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);

  return (
    <MyContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        isLoginOpen,
        setIsLoginOpen,
        isRegisterOpen,
        setIsRegisterOpen,
      }}
    >
      {children}
    </MyContext.Provider>
  );
};
