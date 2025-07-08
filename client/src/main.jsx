import { createRoot } from "react-dom/client";
import App from "./App.jsx";

import { MyContextProvider } from "./context/MyContext.jsx";
import "./index.css";

createRoot(document.getElementById("root")).render(
  <MyContextProvider>
    <App />
  </MyContextProvider>
);
