import React from "react";
import ReactDOM from "react-dom/client";
import './styles/index.css';
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import Provider from "./context/sharedContext";
import { BrowserRouter } from "react-router-dom";
import ScrollToTop from "./hooks/ScrollToTop";
import axios from "axios";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

if (process.env.REACT_APP_API_BASE_URL) {
  axios.defaults.baseURL = process.env.REACT_APP_API_BASE_URL;
}
root.render(
  <React.StrictMode>
    <Provider>
      <BrowserRouter>
        <ScrollToTop>
          <App />
        </ScrollToTop>
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
