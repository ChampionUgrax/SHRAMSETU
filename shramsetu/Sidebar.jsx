import React, { useEffect, useRef, useState } from "react";
import { Link, NavLink, useNavigate, useLocation } from "react-router-dom";
import {
  Menu,
  X,
  Bell,
  Globe,
  ChevronDown,
  User,
  ShieldCheck,
  Hammer,
} from "lucide-react";

import { LANGUAGES, TRANSLATIONS } from "../data/mockData";
import {
  listNotifications,
  markAllRead as markAllReadApi,
} from "../api";
import logo from "../assets/logo.png";
import { getCurrentUser } from "../api/auth";

function useLocalStorage(key, initial) {
  const [value, setValue] = useState(() => {
    try {
      const stored = localStorage.getItem(key);
      return stored ? JSON.parse(stored) : initial;
    } catch {
      return initial;
    }
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue];
}

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const currentUser = getCurrentUser();
  const userRole = currentUser?.role;

  const [open, setOpen] = useState(false);
  const [lang, setLang] = useLocalStorage("ss_lang", "en");
  const [langOpen, setLangOpen] = useState(false);
  const [roleOpen, setRoleOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);

  const ref = useRef(null);

  const t = TRANSLATIONS[lang] || TRANSLATIONS.en;

  const unread = notifications.filter((n) => !n.read).length;

  // Role based on logged-in user
  const activeRole =
    userRole === "worker"
      ? {
          label: "Worker",
          icon: Hammer,
        }
      : {
          label: "Customer",
          icon: User,
        };

  const RoleIcon = activeRole.icon;

  useEffect(() => {
    listNotifications().then(setNotifications);
  }, []);

  useEffect(() => {
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) {
        setLangOpen(false);
        setRoleOpen(false);
        setNotifOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClick);

    return () => {
      document.removeEventListener("mousedown", handleClick);
    };
  }, []);

  const markAllRead = async () => {
    setNotifications((prev) =>
      prev.map((n) => ({
        ...n,
        read: true,
      }))
    );

    await markAllReadApi();
  };

  const navItem =
    "px-3 py-2 text-sm font-semibold rounded-lg transition-colors";

  /*
   * ROLE-SPECIFIC NAVIGATION
   *
   * Customer:
   * Home | Services | Nearby | Bookings | AI Insights
   *
   * Worker:
   * Home | My Jobs | AI Insights | Profile
   */
  const navLinks =
    userRole === "worker"
      ? [
          { to: "/", label: t.home },
          { to: "/WorkerDashboard", label: "My Jobs" },
          { to: "/ai-insights", label: "AI Insights" },
          { to: "/WorkerProfile", label: "Profile" },
        ]
      : [
          { to: "/", label: t.home },
          { to: "/services", label: t.services },
          { to: "/nearby", label: t.nearby },
          { to: "/CustomerDashboard", label: t.bookings },
          { to: "/ai-insights", label: "AI Insights" },
        ];

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur border-b border-navy-100">
      <div className="container-app flex items-center justify-between h-16">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <img
            src={logo}
            alt="ShramSetu"
            className="w-9 h-9 rounded-lg object-contain"
          />

          <span className="font-display font-extrabold text-navy-700 text-lg tracking-tight">
            SHRAMSETU
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-1">
          {navLinks.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              className={({ isActive }) =>
                `${navItem} ${
                  isActive
                    ? "text-white bg-navy-500"
                    : "text-navy-500 hover:bg-navy-50"
                }`
              }
            >
              {l.label}
            </NavLink>
          ))}
        </nav>

        {/* Desktop Controls */}
        <div
          className="hidden lg:flex items-center gap-2"
          ref={ref}
        >

          {/* Language Selector */}
          <div className="relative">
            <button
              onClick={() => {
                setLangOpen((v) => !v);
                setRoleOpen(false);
                setNotifOpen(false);
              }}
              className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-navy-500 hover:bg-navy-50 rounded-lg"
            >
              <Globe size={16} />

              {LANGUAGES.find((l) => l.code === lang)?.label}

              <ChevronDown size={14} />
            </button>

            {langOpen && (
              <div className="absolute right-0 mt-2 w-40 bg-white rounded-xl shadow-cardHover border border-navy-100 py-1 animate-fade-up">
                {LANGUAGES.map((l) => (
                  <button
                    key={l.code}
                    onClick={() => {
                      setLang(l.code);
                      setLangOpen(false);
                    }}
                    className={`w-full text-left px-4 py-2 text-sm hover:bg-navy-50 ${
                      lang === l.code
                        ? "text-coop-600 font-semibold"
                        : "text-navy-600"
                    }`}
                  >
                    {l.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => {
                setNotifOpen((v) => !v);
                setLangOpen(false);
                setRoleOpen(false);
              }}
              className="relative p-2.5 text-navy-500 hover:bg-navy-50 rounded-lg"
            >
              <Bell size={18} />

              {unread > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-saffron-500 text-white text-[10px] font-bold flex items-center justify-center">
                  {unread}
                </span>
              )}
            </button>

            {notifOpen && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-cardHover border border-navy-100 py-2 animate-fade-up">

                <div className="flex items-center justify-between px-4 py-1.5">
                  <p className="font-semibold text-sm text-navy-700">
                    Notifications
                  </p>

                  <button
                    onClick={markAllRead}
                    className="text-xs text-coop-600 font-semibold hover:underline"
                  >
                    Mark all read
                  </button>
                </div>

                <div className="max-h-72 overflow-y-auto">
                  {notifications.map((n) => (
                    <div
                      key={n.id}
                      className={`px-4 py-2.5 text-sm border-t border-navy-50 ${
                        !n.read ? "bg-coop-50/40" : ""
                      }`}
                    >
                      <p className="text-navy-700">
                        {n.text}
                      </p>

                      <p className="text-xs text-navy-300 mt-0.5">
                        {n.time}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* ROLE PANEL */}
          <div className="relative">
            <button
              onClick={() => {
                setRoleOpen((v) => !v);
                setLangOpen(false);
                setNotifOpen(false);
              }}
              className="flex items-center gap-1.5 px-3 py-2 text-sm font-semibold text-white bg-coop-500 hover:bg-coop-600 rounded-lg"
            >
              <RoleIcon size={16} />

              <span>
                {activeRole.label} Panel
              </span>

              <ChevronDown size={14} />
            </button>

            {roleOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-cardHover border border-navy-100 py-1 animate-fade-up">

                {/* Customer Panel */}
                {userRole === "customer" && (
                  <button
                    onClick={() => {
                      navigate("/dashboard");
                      setRoleOpen(false);
                    }}
                    className="w-full flex items-center gap-2 text-left px-4 py-2.5 text-sm text-coop-600 font-semibold hover:bg-navy-50"
                  >
                    <User size={15} />
                    Customer
                  </button>
                )}

                {/* Worker Panel */}
                {userRole === "worker" && (
                  <button
                    onClick={() => {
                      navigate("/worker-dashboard");
                      setRoleOpen(false);
                    }}
                    className="w-full flex items-center gap-2 text-left px-4 py-2.5 text-sm text-coop-600 font-semibold hover:bg-navy-50"
                  >
                    <Hammer size={15} />
                    Worker
                  </button>
                )}

              </div>
            )}
          </div>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="lg:hidden p-2 text-navy-600"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {open && (
        <div className="lg:hidden border-t border-navy-100 bg-white animate-fade-up">
          <div className="container-app py-3 flex flex-col gap-1">

            {/* Role-specific navigation */}
            {navLinks.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `${navItem} ${
                    isActive
                      ? "text-white bg-navy-500"
                      : "text-navy-500 hover:bg-navy-50"
                  }`
                }
              >
                {l.label}
              </NavLink>
            ))}

            <div className="h-px bg-navy-100 my-2" />

            <p className="px-3 text-xs font-bold text-navy-300 uppercase tracking-wider">
              Current panel · {activeRole.label}
            </p>

            {/* Mobile Customer */}
            {userRole === "customer" && (
              <button
                onClick={() => {
                  navigate("/dashboard");
                  setOpen(false);
                }}
                className={`flex items-center gap-2 text-left px-3 py-2 text-sm rounded-lg hover:bg-navy-50 ${
                  location.pathname === "/dashboard"
                    ? "text-coop-600 font-semibold"
                    : "text-navy-600"
                }`}
              >
                <User size={15} />
                Customer
              </button>
            )}

            {/* Mobile Worker */}
            {userRole === "worker" && (
              <button
                onClick={() => {
                  navigate("/worker-dashboard");
                  setOpen(false);
                }}
                className={`flex items-center gap-2 text-left px-3 py-2 text-sm rounded-lg hover:bg-navy-50 ${
                  location.pathname === "/worker-dashboard"
                    ? "text-coop-600 font-semibold"
                    : "text-navy-600"
                }`}
              >
                <Hammer size={15} />
                Worker
              </button>
            )}

            {/* Admin intentionally remains separate */}
          </div>
        </div>
      )}
    </header>
  );
}

export { useLocalStorage };