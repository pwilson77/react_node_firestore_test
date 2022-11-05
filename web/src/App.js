import logo from "./logo.svg";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";
import { Routes, Route, Link, BrowserRouter } from "react-router-dom";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import PrivateRoute from "./routes/PrivateRoute";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
