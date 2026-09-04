// src/api/auth.js

const AUTH_KEY = "ss_auth";

// Demo accounts for prototype
const USERS = {
  customer: {
    email: "customer@shramsetu.in",
    password: "123456",
    name: "Demo Customer",
    role: "customer",
  },

  worker: {
    email: "worker@shramsetu.in",
    password: "123456",
    name: "Demo Worker",
    role: "worker",
  },

  admin: {
    email: "admin@shramsetu.in",
    password: "123456",
    name: "Cooperative Admin",
    role: "admin",
  },
};


/**
 * Login user
 */
export function login(email, password, role) {
  const user = USERS[role];

  if (!user) {
    return {
      success: false,
      message: "Invalid user role.",
    };
  }

  if (
    email.trim().toLowerCase() !== user.email.toLowerCase() ||
    password !== user.password
  ) {
    return {
      success: false,
      message: "Invalid email or password.",
    };
  }

  const session = {
    authenticated: true,
    role: user.role,
    name: user.name,
    email: user.email,
    loginTime: new Date().toISOString(),
  };

  localStorage.setItem(AUTH_KEY, JSON.stringify(session));

  return {
    success: true,
    user: session,
  };
}


/**
 * Get currently logged-in user
 */
export function getCurrentUser() {
  const savedAuth = localStorage.getItem(AUTH_KEY);

  if (!savedAuth) {
    return null;
  }

  try {
    return JSON.parse(savedAuth);
  } catch (error) {
    localStorage.removeItem(AUTH_KEY);
    return null;
  }
}


/**
 * Check whether user is authenticated
 */
export function isAuthenticated() {
  const user = getCurrentUser();

  return Boolean(user?.authenticated);
}


/**
 * Check whether current user has a specific role
 */
export function hasRole(role) {
  const user = getCurrentUser();

  return Boolean(
    user?.authenticated &&
    user?.role === role
  );
}


/**
 * Logout
 */
export function logout() {
  localStorage.removeItem(AUTH_KEY);
}


/**
 * Get dashboard according to role
 */
export function getDashboardPath(role) {
  switch (role) {
    case "customer":
      return "/CustomerDashboard";

    case "worker":
      return "/WorkerDashboard";

    case "admin":
      return "/AdminDashboard";

    default:
      return "/login";
  }
}