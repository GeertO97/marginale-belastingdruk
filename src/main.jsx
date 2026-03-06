import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { LanguageProvider } from "./LanguageContext.jsx";
import { ThemeProvider } from "./ThemeContext.jsx";
import App from "./App.jsx";
import "./index.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ThemeProvider>
      <LanguageProvider>
        <App />
      </LanguageProvider>
    </ThemeProvider>
  </StrictMode>
);
