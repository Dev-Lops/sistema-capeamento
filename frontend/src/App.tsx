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

import ProtectedRoute from "./components/ProtectedRoute";
import Obras from "./pages/Works.tsx";
import Companies from "./pages/Companies.tsx";
import Teams from "./pages/Teams.tsx";
import Projects from "./pages/Projects.tsx";


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
            <ProtectedRoute
              allowedRoles={[
                "admin",
                "planner",
                "operador",
              ]}
            >
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
                "planner",
              ]}
            >
              <Layout>
                <Activities />
              </Layout>
            </ProtectedRoute>
          }
        />

          <Route
            path="/obras"
            element={
              <ProtectedRoute
                allowedRoles={[
                  "admin",
                  "planner",
                ]}
              >
                <Layout>
                  <Obras />
                </Layout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/works"
            element={
              <Navigate to="/obras" replace />
            }
          />

          <Route
            path="/companies"
            element={
              <ProtectedRoute
                allowedRoles={[
                  "admin",
                  "planner",
                ]}
              >
                <Layout>
                  <Companies />
                </Layout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/teams"
            element={
              <ProtectedRoute
                allowedRoles={[
                  "admin",
                  "planner",
                ]}
              >
                <Layout>
                  <Teams />
                </Layout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/projects"
            element={
              <ProtectedRoute
                allowedRoles={[
                  "admin",
                  "planner",
                ]}
              >
                <Layout>
                  <Projects />
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