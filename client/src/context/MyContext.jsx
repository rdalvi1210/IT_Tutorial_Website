import { createContext, useState } from "react";
// Create the context object
export const MyContext = createContext();
// Create the provider component
export const MyContextProvider = ({ children }) => {
  const [state, setState] = useState("Initial value");
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  return (
    <MyContext.Provider
      value={{ state, setState, setIsLoginOpen, isLoginOpen }}
    >
      {children}
    </MyContext.Provider>
  );
};
