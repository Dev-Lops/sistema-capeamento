import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Layout from "./components/Layout";

import Dashboard from "./pages/Dashboard";

import Activities from "./pages/Activities";

import Login from "./pages/Login";

import ProtectedRoute
from "./components/ProtectedRoute";


function App() {

  return (

    <BrowserRouter>

      <Routes>

        {/* LOGIN */}

        <Route
          path="/login"
          element={<Login />}
        />


        {/* DASHBOARD */}

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>

              <Layout>
                <Dashboard />
              </Layout>

            </ProtectedRoute>
          }
        />


        {/* ACTIVITIES */}

        <Route
          path="/activities"
          element={

            <ProtectedRoute
              allowedRoles={[
                "admin",
                "gestor"
              ]}
            >

              <Layout>
                <Activities />
              </Layout>

            </ProtectedRoute>

          }
        />


        {/* REDIRECT */}

        <Route
          path="*"
          element={
            <Navigate
              to="/dashboard"
            />
          }
        />

      </Routes>

    </BrowserRouter>
  );
}

export default App;