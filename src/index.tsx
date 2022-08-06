import React from 'react'
import ReactDOM from 'react-dom/client'
import App from "./components/App";

import "./assets/styles/globals.scss";
import "./assets/styles/weather-icons-wind.min.css";
import "./assets/styles/weather-icons.min.css";

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)