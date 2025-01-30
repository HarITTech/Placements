import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useSelector } from "react-redux";
import Sidebar from "./component/Sidebar";
import Home from "./Pages/home/home";
import Job from "./Pages/home/Job";
import Notification from "./Pages/home/Notification";
import Login from "./Pages/login";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import GAdminRoutes from "./Routes/GAdminRoutes";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode"; // Fix import for jwt-decode
import JobDetails from "./Pages/home/Jobdetails";
import { Internship } from "./Pages/home/Internship";
import TAdminRoutes from "./Routes/TAdminRoutes";
import { Toaster } from "react-hot-toast";
import Event from "./Pages/home/Event";
import Highlight from "./Pages/home/Highlight";
import Training from "./Pages/home/Training";
import Loading from "./component/Loading";
import SmallSidebar from "./component/SmallSidebar";

function App() {
  const { token } = useSelector((state) => state.user);
  const [loading, setLoading] = useState(true);

  const applyBackgroundColor = (role) => {
    if (role === "student") {
      document.body.style.backgroundColor = "rgb(22, 22, 59)";
      localStorage.setItem("backgroundColor", "rgb(22, 22, 59)");
    } else if (role === "global_admin") {
      document.body.style.backgroundColor = "rgb(26, 32, 44)";
      localStorage.setItem("backgroundColor", "rgb(26, 32, 44)");
    } else {
      document.body.style.backgroundColor = "rgba(255, 255, 255, 0)";
      localStorage.removeItem("backgroundColor");
    }
  };

  useEffect(() => {
    const tokenFromCookies = Cookies.get("mpsp") || token;

    if (tokenFromCookies) {
      try {
        const decoded = jwtDecode(tokenFromCookies);

        // Check if the token is expired
        if (decoded.exp * 1000 < Date.now()) {
          Cookies.remove("mpsp");
          localStorage.removeItem("persist:root");
          window.location.href = "/login"; // Redirect to login
        } else {
          applyBackgroundColor(decoded.role);
        }
      } catch (error) {
        console.error("Error decoding token:", error);
        Cookies.remove("mpsp");
        localStorage.removeItem("persist:root");
        window.location.href = "/login"; // Redirect to login
      }
    } else {
      applyBackgroundColor(null);
      localStorage.removeItem("persist:root");
    }

    setLoading(false);
  }, [token]);

  const ProtectedRoute = ({ children, allowedRoles }) => {
    const tokenFromCookies = Cookies.get("mpsp") || token;
    if (!tokenFromCookies) return <Navigate to="/login" />;

    try {
      const decoded = jwtDecode(tokenFromCookies);
      if (decoded.exp * 1000 < Date.now()) {
        Cookies.remove("mpsp");
        return <Navigate to="/login" />;
      }
      if (allowedRoles.includes(decoded.role)) {
        return children;
      }
    } catch (error) {
      console.error("Error decoding token:", error);
      Cookies.remove("mpsp");
      return <Navigate to="/login" />;
    }
    return <Navigate to="/login" />;
  };

  const checkUserRole = () => {
    const tokenFromCookies = Cookies.get("mpsp") || token;
    if (tokenFromCookies) {
      try {
        const decoded = jwtDecode(tokenFromCookies);
        if (decoded.exp * 1000 < Date.now()) {
          Cookies.remove("mpsp");
          return "/login";
        }
        if (
          decoded &&
          decoded.role &&
          ["student", "global_admin", "tnp_admin"].includes(decoded.role)
        ) {
          applyBackgroundColor(decoded.role); // Ensure background color is applied
          if (decoded.role === "student") return "/";
          else if (decoded.role === "global_admin") return "/gadmin/dashboard";
          else if (decoded.role === "tnp_admin") return "/tadmin/dashboard";
        }
      } catch (error) {
        console.error("Error decoding token:", error);
        Cookies.remove("mpsp");
      }
    }
    return "/login";
  };

  if (loading) {
    return (
      <div>
        <Loading />
      </div>
    );
  }

  return (
    <Router>
      <Toaster />
      <Routes>
        <Route
          path="/login"
          element={
            !token && !Cookies.get("mpsp") ? (
              <Login />
            ) : (
              <Navigate to={checkUserRole()} />
            )
          }
        />
         <Route
          path="/"
          element={
            <ProtectedRoute allowedRoles={["student"]}>
              <div className="flex flex-col">
                <SmallSidebar /> {/* Render SmallSidebar for small screens */}
                <div className="flex">
                  <Sidebar /> {/* Render Sidebar for larger screens */}
                  <main className="flex-1 bg-gray-200 p-3 rounded-l-3xl">
                    <Home />
                  </main>
                </div>
              </div>
            </ProtectedRoute>
          }
        />
        <Route
          path="/job"
          element={
            <ProtectedRoute
              allowedRoles={["student", "tnp_admin", "global_admin"]}
            >
              <div className="flex flex-col">
              <SmallSidebar /> {/* Render SmallSidebar for small screens */}
              <div className="flex">
                <Sidebar />
                <main className="flex-1  bg-gray-200 p-2 rounded-l-3xl">
                  <Job />
                </main>
                </div>
              </div>
            </ProtectedRoute>
          }
        />
        <Route
          path="/job/:jobId"
          element={
            <ProtectedRoute
              allowedRoles={["student", "tnp_admin", "global_admin"]}
            >
              <div className="flex flex-col">
              <SmallSidebar /> {/* Render SmallSidebar for small screens */}
              <div className="flex">
                <Sidebar />
                <main className="flex-1 bg-gray-200 p-2 rounded-l-3xl">
                  <JobDetails />
                </main>
                </div>
              </div>
            </ProtectedRoute>
          }
        />
        <Route
          path="/internship"
          element={
            <ProtectedRoute
              allowedRoles={["student", "tnp_admin", "global_admin"]}
            >
              <div className="flex flex-col">
              <SmallSidebar /> {/* Render SmallSidebar for small screens */}
              <div className="flex">
                <Sidebar />
                <main className="flex-1 bg-gray-200 p-2 rounded-l-3xl">
                  <Internship />
                </main>
                </div>
              </div>
            </ProtectedRoute>
          }
        />

        <Route
          path="/training"
          element={
            <ProtectedRoute
              allowedRoles={["student", "tnp_admin", "global_admin"]}
            >
              <div className="flex flex-col">
              <SmallSidebar /> {/* Render SmallSidebar for small screens */}
              <div className="flex">
                <Sidebar />
                <main className="flex-1 bg-gray-200 p-3 rounded-l-3xl">
                  <Training />
                </main>
                </div>
              </div>
            </ProtectedRoute>
          }
        />

        <Route
          path="/notify"
          element={
            <ProtectedRoute
              allowedRoles={["student", "tnp_admin", "global_admin"]}
            >
              <div className="flex flex-col">
              <SmallSidebar /> {/* Render SmallSidebar for small screens */}
              <div className="flex">
                <Sidebar />
                <main className="flex-1 bg-gray-200 p-6 rounded-l-3xl">
                  <Notification />
                </main>
                </div>
              </div>
            </ProtectedRoute>
          }
        />
        <Route
          path="/event"
          element={
            <ProtectedRoute allowedRoles={["student"]}>
              <div className="flex flex-col">
              <SmallSidebar /> {/* Render SmallSidebar for small screens */}
              <div className="flex">
                <Sidebar />
                <main className="flex-1 bg-gray-200 p-6 rounded-l-3xl">
                  <Event />
                </main>
                </div>
              </div>
            </ProtectedRoute>
          }
        />
        {/* <Route
          path="/highlight"
          element={
            <ProtectedRoute allowedRoles={["student"]}>
              <div className="flex">
                <Sidebar />
                <main className="flex-1 bg-gray-200 p-6 rounded-l-3xl">
                  <Highlight />
                </main>
              </div>
            </ProtectedRoute>
          }
        /> */}

        {/* GAdmin Routes */}
        <Route
          path="/gadmin/*"
          element={
            <ProtectedRoute allowedRoles={["global_admin"]}>
              <GAdminRoutes />
            </ProtectedRoute>
          }
        />
        {/* TAdmin Routes */}
        <Route
          path="/tadmin/*"
          element={
            <ProtectedRoute allowedRoles={["tnp_admin"]}>
              <TAdminRoutes />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
      <ToastContainer position="top-center" autoClose={3000} hideProgressBar />
    </Router>
  );
}

export default App;
