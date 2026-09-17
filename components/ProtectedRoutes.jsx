import React from "react";
import { Navigate, useLocation } from "react-router-dom";

export default function ProtectedRoutes({
  children,
  allowedRoles = [],
}) {
  const location = useLocation();

  const savedAuth = localStorage.getItem("ss_auth");

  /*
   * No login session
   */
  if (!savedAuth) {
    if (location.pathname.startsWith("/admin")) {
      return (
        <Navigate
          to="/admin/login"
          replace
          state={{ from: location.pathname }}
        />
      );
    }

    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location.pathname }}
      />
    );
  }

  let auth;

  try {
    auth = JSON.parse(savedAuth);
  } catch (error) {
    localStorage.removeItem("ss_auth");

    if (location.pathname.startsWith("/admin")) {
      return <Navigate to="/admin/login" replace />;
    }

    return <Navigate to="/login" replace />;
  }

  /*
   * Session exists but is not authenticated
   */
  if (!auth?.authenticated) {
    localStorage.removeItem("ss_auth");

    if (location.pathname.startsWith("/admin")) {
      return <Navigate to="/admin/login" replace />;
    }

    return <Navigate to="/login" replace />;
  }

  /*
   * Check role
   */
  if (
    allowedRoles.length > 0 &&
    !allowedRoles.includes(auth.role)
  ) {
    /*
     * Worker trying to access customer/admin page
     */
    if (auth.role === "worker") {
      return <Navigate to="/worker-dashboard" replace />;
    }

    /*
     * Customer trying to access worker/admin page
     */
    if (auth.role === "customer") {
      return <Navigate to="/dashboard" replace />;
    }

    /*
     * Admin trying to access normal portal
     */
    if (auth.role === "admin") {
      return <Navigate to="/admin" replace />;
    }

    return <Navigate to="/login" replace />;
  }

  return children;
}