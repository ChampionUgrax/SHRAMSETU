import React from "react";
import {
  LayoutDashboard,
  Users,
  UserRound,
  ClipboardList,
  ShieldCheck,
  BarChart3,
  Building2,
  AlertTriangle,
  HeartPulse,
  LogOut,
  X,
} from "lucide-react";

import { useNavigate } from "react-router-dom";
import { logout } from "../api/auth";

export default function AdminSidebar({
  activeTab,
  setActiveTab,
  mobileOpen,
  setMobileOpen,
}) {
  const navigate = useNavigate();

  const menu = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
    },
    {
      id: "workers",
      label: "Workers",
      icon: Users,
    },
    {
      id: "customers",
      label: "Customers",
      icon: UserRound,
    },
    {
      id: "bookings",
      label: "Bookings",
      icon: ClipboardList,
    },
    {
      id: "kyc",
      label: "KYC Verification",
      icon: ShieldCheck,
    },
    {
      id: "reports",
      label: "Reports & Analytics",
      icon: BarChart3,
    },
    {
      id: "cooperatives",
      label: "Cooperative Network",
      icon: Building2,
    },
    {
      id: "disputes",
      label: "Disputes",
      icon: AlertTriangle,
    },
    {
      id: "welfare",
      label: "Worker Welfare",
      icon: HeartPulse,
    },
  ];

  function handleLogout() {
    logout();
    setMobileOpen(false);
    navigate("/admin/login");
  }

  return (
    <>
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed
          top-0
          left-0
          bottom-0
          z-50

          h-screen
          min-h-screen
          w-72

          bg-[#0f172a]
          text-white

          flex
          flex-col

          shadow-2xl

          transform
          transition-transform
          duration-300
          ease-in-out

          ${mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
      >
        {/* =========================
            HEADER
        ========================== */}
        <div className="h-20 min-h-20 px-6 flex items-center justify-between border-b border-white/10">
          <div>
            <p className="text-xl font-bold tracking-wide">SHRAMSETU</p>

            <p className="text-xs text-slate-400 mt-1">Cooperative Admin</p>
          </div>

          {/* Mobile close button */}
          <button
            type="button"
            className="lg:hidden p-2 rounded-lg hover:bg-white/10 transition"
            onClick={() => setMobileOpen(false)}
            aria-label="Close admin menu"
          >
            <X size={22} />
          </button>
        </div>

        {/* =========================
            NAVIGATION
        ========================== */}
        <nav className="flex-1 min-h-0 overflow-y-auto p-4 space-y-1">
          {menu.map((item) => {
            const Icon = item.icon;
            const active = activeTab === item.id;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  setActiveTab(item.id);
                  setMobileOpen(false);
                }}
                className={`
                  w-full
                  flex
                  items-center
                  gap-3
                  px-4
                  py-3
                  rounded-xl
                  text-sm
                  font-medium
                  transition-all
                  duration-200

                  ${
                    active
                      ? "bg-white text-slate-900 shadow-md"
                      : "text-slate-300 hover:bg-white/10 hover:text-white"
                  }
                `}
              >
                <Icon
                  size={19}
                  strokeWidth={active ? 2.4 : 2}
                  className="shrink-0"
                />

                <span className="truncate">{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* =========================
            LOGOUT
        ========================== */}
        <div className="mt-auto shrink-0 p-4 border-t border-white/10 bg-[#0f172a]">
          <button
            type="button"
            onClick={handleLogout}
            className="
              w-full
              flex
              items-center
              gap-3
              px-4
              py-3
              rounded-xl
              text-sm
              font-medium
              text-red-300
              hover:bg-red-500/10
              hover:text-red-200
              transition-all
              duration-200
            "
          >
            <LogOut size={19} className="shrink-0" />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
}
