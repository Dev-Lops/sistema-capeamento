import React from 'react'
import ReactDOM from 'react-dom/client'
import { Toaster } from "react-hot-toast";
import App from './App.tsx'

import './index.css'
import {AuthProvider} from "./context/AuthContext.tsx";

ReactDOM.createRoot(
  document.getElementById('root')!
).render(
  <React.StrictMode>
    <AuthProvider>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            borderRadius: "12px",
            background: "#0f172a",
            color: "#f8fafc",
            fontSize: "14px",
          },
        }}
      />
      <App />
    </AuthProvider>
  </React.StrictMode>
)

