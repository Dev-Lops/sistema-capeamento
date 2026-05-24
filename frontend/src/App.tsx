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
import Works from "./pages/Works.tsx";
import Companies from "./pages/Companies.tsx";
import Teams from "./pages/Teams.tsx";


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
  path="/works"
  element={
    <ProtectedRoute
      allowedRoles={[
        "admin",
        "planner"
      ]}
    >
      <Works />
    </ProtectedRoute>
  }
/>

          <Route
  path="/companies"
  element={
    <ProtectedRoute
      allowedRoles={[
        "admin",
        "planner"
      ]}
    >
      <Companies />
    </ProtectedRoute>
  }
/>

          <Route
  path="/teams"
  element={
    <ProtectedRoute
      allowedRoles={[
        "admin",
        "planner"
      ]}
    >
      <Teams />
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