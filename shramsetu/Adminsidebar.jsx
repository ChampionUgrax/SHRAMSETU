import React from "react";
import { Routes, Route, useLocation, Navigate } from "react-router-dom";

import Navbar from "./components/Navbar";

import Home from "./pages/Home";
import Services from "./pages/Services";
import ServiceDetails from "./pages/ServiceDetails";
import Booking from "./pages/Booking";

import CustomerDashboard from "./pages/CustomerDashboard";
import WorkerDashboard from "./pages/WorkerDashboard";
import WorkerProfile from "./pages/WorkerProfile";

import AIInsights from "./pages/AIInsights";
import Nearby from "./pages/Nearby";
import Login from "./pages/Login";

import AdminDashboard from "./pages/AdminDashboard";
import AdminLogin from "./pages/Adminlogin";
import AdminWorkers from "./pages/AdminWorkers";

import ProtectedRoutes from "./components/ProtectedRoutes";

import logo from "./assets/logo.png";

export default function App() {
  const location = useLocation();

  // Hide normal Navbar on:
  // 1. Normal Login page
  // 2. Entire Admin portal, including Admin Login
  const hideNavbar =
    location.pathname === "/login" ||
    location.pathname.startsWith("/admin");

  return (
    <div className="min-h-screen flex flex-col bg-[#f7f8fb]">

      {/* Normal Navbar appears only on normal non-login pages */}
      {!hideNavbar && <Navbar />}

      <main className="flex-1">
        <Routes>

          {/* ================= NORMAL USER ROUTES ================= */}

          <Route path="/" element={<Home />} />

          <Route path="/services" element={<Services />} />

          <Route
            path="/service/:id"
            element={<ServiceDetails />}
          />

          <Route
            path="/ai-insights"
            element={<AIInsights />}
          />

          <Route
            path="/nearby"
            element={<Nearby />}
          />

          {/* Normal Login - NO NAVBAR */}
          <Route
            path="/login"
            element={<Login />}
          />

          <Route
            path="/booking"
            element={
              <ProtectedRoutes allowedRoles={["customer"]}>
                <Booking />
              </ProtectedRoutes>
            }
          />

          <Route
            path="/dashboard"
            element={
              <ProtectedRoutes allowedRoles={["customer"]}>
                <CustomerDashboard />
              </ProtectedRoutes>
            }
          />

          <Route
            path="/CustomerDashboard"
            element={
              <Navigate to="/dashboard" replace />
            }
          />

          <Route
            path="/worker-dashboard"
            element={
              <ProtectedRoutes allowedRoles={["worker"]}>
                <WorkerDashboard />
              </ProtectedRoutes>
            }
          />

          <Route
            path="/WorkerDashboard"
            element={
              <Navigate to="/worker-dashboard" replace />
            }
          />

          <Route
            path="/worker-profile"
            element={
              <ProtectedRoutes allowedRoles={["worker"]}>
                <WorkerProfile />
              </ProtectedRoutes>
            }
          />

          <Route
            path="/WorkerProfile"
            element={
              <Navigate to="/worker-profile" replace />
            }
          />

          {/* ================= ADMIN ROUTES ================= */}

          {/* Admin Login - NO NAVBAR */}
          <Route
            path="/admin/login"
            element={<AdminLogin />}
          />

          <Route
            path="/admin"
            element={
              <ProtectedRoutes allowedRoles={["admin"]}>
                <AdminDashboard />
              </ProtectedRoutes>
            }
          />

          <Route
            path="/admin/workers"
            element={
              <ProtectedRoutes allowedRoles={["admin"]}>
                <AdminWorkers />
              </ProtectedRoutes>
            }
          />

          <Route
            path="/admin/customers"
            element={
              <ProtectedRoutes allowedRoles={["admin"]}>
                <Navigate to="/admin" replace />
              </ProtectedRoutes>
            }
          />

          <Route
            path="/admin/bookings"
            element={
              <ProtectedRoutes allowedRoles={["admin"]}>
                <Navigate to="/admin" replace />
              </ProtectedRoutes>
            }
          />

          <Route
            path="/admin/reports"
            element={
              <ProtectedRoutes allowedRoles={["admin"]}>
                <Navigate to="/admin" replace />
              </ProtectedRoutes>
            }
          />

          <Route
            path="/admin/analytics"
            element={
              <ProtectedRoutes allowedRoles={["admin"]}>
                <Navigate to="/admin" replace />
              </ProtectedRoutes>
            }
          />

          <Route
            path="/admin/services"
            element={
              <ProtectedRoutes allowedRoles={["admin"]}>
                <Navigate to="/admin" replace />
              </ProtectedRoutes>
            }
          />

          <Route
            path="/admin/settings"
            element={
              <ProtectedRoutes allowedRoles={["admin"]}>
                <Navigate to="/admin" replace />
              </ProtectedRoutes>
            }
          />

          <Route
            path="/admin/*"
            element={
              <ProtectedRoutes allowedRoles={["admin"]}>
                <Navigate to="/admin" replace />
              </ProtectedRoutes>
            }
          />

          {/* ================= FALLBACK ================= */}

          <Route
            path="*"
            element={<Navigate to="/" replace />}
          />

        </Routes>
      </main>

      {/* Footer also hidden on login/admin portal */}
      {!hideNavbar && (
        <footer className="bg-navy-700 text-navy-100 mt-12">
          {/* Keep your existing footer content here */}
        </footer>
      )}

    </div>
  );
}