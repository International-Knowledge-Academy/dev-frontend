// @ts-nocheck
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";

import App from "./App";
import { AuthProvider } from "context/AuthContext";
import { ToastProvider } from "context/ToastContext";
import ToastContainer from "components/toast/ToastContainer";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <BrowserRouter>
    <AuthProvider>
      <ToastProvider>
        <App />
        <ToastContainer />
      </ToastProvider>
    </AuthProvider>
  </BrowserRouter>
);
