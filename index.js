import React from "react";
import { createRoot } from "react-dom/client";

import "./static/styles/globals.scss";
import "./static/styles/weather-icons-wind.min.css";
import "./static/styles/weather-icons.min.css";

import App from "./components/App";

createRoot(document.getElementById("root")).render(<App />);
