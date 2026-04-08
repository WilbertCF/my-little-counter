import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "../finanzas-app.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);
