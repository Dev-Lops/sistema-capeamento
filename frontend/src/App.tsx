import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Layout from "./components/Layout";

import Dashboard from "./pages/Dashboard";

import Activities from "./pages/Activities";

function App() {

  return (

    <BrowserRouter>

      <Layout>

        <Routes>

          <Route
            path="/"
            element={
              <Navigate
                to="/dashboard"
              />
            }
          />

          <Route
            path="/dashboard"
            element={<Dashboard />}
          />

          <Route
            path="/activities"
            element={<Activities />}
          />

        </Routes>

      </Layout>

    </BrowserRouter>
  );
}

export default App;