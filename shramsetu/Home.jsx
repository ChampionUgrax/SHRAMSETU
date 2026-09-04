import React, { useEffect, useMemo, useState } from "react";

import {
  Menu,
  RefreshCw,
  Search,
  CheckCircle2,
  Clock3,
  Users,
  UserRound,
  ClipboardList,
  IndianRupee,
  TrendingUp,
  ShieldCheck,
  Ban,
  Eye,
  XCircle,
  Download,
  AlertTriangle,
  HeartPulse,
  Building2,
  BarChart3,
} from "lucide-react";

import AdminSidebar from "../components/Adminsidebar";

import {
  getAdminSummary,
  listAdminWorkers,
  listAdminCustomers,
  listAdminBookings,
  listAdminActivities,
  listDisputes,
  updateWorkerVerification,
  toggleWorkerSuspension,
  updateAdminBookingStatus,
  updateDispute,
} from "../api/admindashboard";

/* --------------------------------------------------
   HELPERS
-------------------------------------------------- */

function formatCurrency(value) {
  return `₹${Number(value || 0).toLocaleString("en-IN")}`;
}

function formatDate(date) {
  if (!date) return "—";

  return new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function statusClass(status) {
  const value = String(status).toLowerCase();

  if (["verified", "completed", "resolved", "active"].includes(value)) {
    return "bg-green-100 text-green-700";
  }

  if (["pending", "confirmed", "accepted", "open"].includes(value)) {
    return "bg-amber-100 text-amber-700";
  }

  if (["rejected", "cancelled", "suspended", "closed"].includes(value)) {
    return "bg-red-100 text-red-700";
  }

  return "bg-slate-100 text-slate-700";
}

/* --------------------------------------------------
   STAT CARD
-------------------------------------------------- */

function StatCard({ title, value, icon: Icon, description }) {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm text-slate-500">{title}</p>

          <h3 className="text-2xl font-bold text-slate-900 mt-2">{value}</h3>

          {description && (
            <p className="text-xs text-slate-500 mt-2">{description}</p>
          )}
        </div>

        <div className="w-11 h-11 rounded-xl bg-slate-100 flex items-center justify-center">
          <Icon size={21} />
        </div>
      </div>
    </div>
  );
}

/* --------------------------------------------------
   MAIN
-------------------------------------------------- */

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("dashboard");

  const [mobileOpen, setMobileOpen] = useState(false);

  const [summary, setSummary] = useState(null);

  const [workers, setWorkers] = useState([]);

  const [customers, setCustomers] = useState([]);

  const [bookings, setBookings] = useState([]);

  const [activities, setActivities] = useState([]);

  const [disputes, setDisputes] = useState([]);

  const [loading, setLoading] = useState(true);

  const [refreshing, setRefreshing] = useState(false);

  const [search, setSearch] = useState("");

  const [workerFilter, setWorkerFilter] = useState("all");

  const [bookingFilter, setBookingFilter] = useState("all");

  const [customerFilter, setCustomerFilter] = useState("all");

  const [selectedWorker, setSelectedWorker] = useState(null);

  const [selectedCustomer, setSelectedCustomer] = useState(null);

  const [selectedBooking, setSelectedBooking] = useState(null);

  /* --------------------------------------------------
     LOAD DATA
  -------------------------------------------------- */

  async function loadData() {
    try {
      setRefreshing(true);

      const [
        stats,
        workerData,
        customerData,
        bookingData,
        activityData,
        disputeData,
      ] = await Promise.all([
        getAdminSummary(),
        listAdminWorkers(),
        listAdminCustomers(),
        listAdminBookings(),
        listAdminActivities(),
        listDisputes(),
      ]);

      setSummary(stats);
      setWorkers(workerData);
      setCustomers(customerData);
      setBookings(bookingData);
      setActivities(activityData);
      setDisputes(disputeData);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  useEffect(() => {
    loadData();

    const refresh = () => {
      loadData();
    };

    window.addEventListener("shramsetu:data", refresh);

    window.addEventListener("storage", refresh);

    const interval = setInterval(loadData, 5000);

    return () => {
      window.removeEventListener("shramsetu:data", refresh);

      window.removeEventListener("storage", refresh);

      clearInterval(interval);
    };
  }, []);

  /* --------------------------------------------------
     FILTERED WORKERS
  -------------------------------------------------- */

  const filteredWorkers = useMemo(() => {
    return workers.filter((worker) => {
      const matchesSearch =
        !search ||
        `${worker.name} ${worker.phone} ${worker.skill} ${worker.city}`
          .toLowerCase()
          .includes(search.toLowerCase());

      const matchesStatus =
        workerFilter === "all" || worker.verificationStatus === workerFilter;

      return matchesSearch && matchesStatus;
    });
  }, [workers, search, workerFilter]);

  /* --------------------------------------------------
     FILTERED CUSTOMERS
  -------------------------------------------------- */

  const filteredCustomers = useMemo(() => {
    return customers.filter((customer) => {
      const matchesSearch =
        !search ||
        `${customer.name} ${customer.email} ${customer.phone}`
          .toLowerCase()
          .includes(search.toLowerCase());

      let matchesStatus = true;

      if (customerFilter === "active") {
        matchesStatus = customer.status !== "inactive";
      }

      if (customerFilter === "inactive") {
        matchesStatus = customer.status === "inactive";
      }

      return matchesSearch && matchesStatus;
    });
  }, [customers, search, customerFilter]);

  /* --------------------------------------------------
     FILTERED BOOKINGS
  -------------------------------------------------- */

  const filteredBookings = useMemo(() => {
    return bookings.filter((booking) => {
      const text = `
        ${booking.id || ""}
        ${booking.bookingId || ""}
        ${booking.customerName || ""}
        ${booking.workerName || ""}
        ${booking.service || ""}
      `.toLowerCase();

      const matchesSearch = !search || text.includes(search.toLowerCase());

      const status = String(booking.status || "").toLowerCase();

      const matchesStatus = bookingFilter === "all" || status === bookingFilter;

      return matchesSearch && matchesStatus;
    });
  }, [bookings, search, bookingFilter]);

  /* --------------------------------------------------
     WORKER ACTIONS
  -------------------------------------------------- */

  async function verifyWorker(worker) {
    const result = await updateWorkerVerification(
      worker.id,
      "verified",
      "Verified by cooperative admin.",
    );

    if (result.success) {
      await loadData();
      setSelectedWorker(null);
    }
  }

  async function rejectWorker(worker) {
    const result = await updateWorkerVerification(
      worker.id,
      "rejected",
      "KYC rejected by cooperative admin.",
    );

    if (result.success) {
      await loadData();
      setSelectedWorker(null);
    }
  }

  async function toggleSuspension(worker) {
    await toggleWorkerSuspension(worker.id);

    await loadData();
  }

  /* --------------------------------------------------
     BOOKING ACTION
  -------------------------------------------------- */

  async function changeBookingStatus(booking, status) {
    const id = booking.id || booking.bookingId;

    await updateAdminBookingStatus(id, status);

    await loadData();
    setSelectedBooking(null);
  }

  /* --------------------------------------------------
     EXPORT
  -------------------------------------------------- */

  function exportCSV(type) {
    let data = [];

    if (type === "workers") {
      data = workers;
    }

    if (type === "customers") {
      data = customers;
    }

    if (type === "bookings") {
      data = bookings;
    }

    if (!data.length) {
      alert("No data available.");
      return;
    }

    const headers = Object.keys(data[0]);

    const rows = data.map((item) =>
      headers.map((header) => JSON.stringify(item[header] ?? "")).join(","),
    );

    const csv = [headers.join(","), ...rows].join("\n");

    const blob = new Blob([csv], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");

    link.href = url;

    link.download = `shramsetu-${type}-report.csv`;

    link.click();

    URL.revokeObjectURL(url);
  }

  /* --------------------------------------------------
     LOADING
  -------------------------------------------------- */

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="animate-spin mx-auto mb-3" size={28} />

          <p className="text-slate-500">Loading cooperative dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5f7fb] flex">
      <AdminSidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />

      <main className="flex-1 lg:ml-72 min-h-screen">
        {/* HEADER */}

        <header className="bg-white border-b border-slate-200 px-5 lg:px-8 py-4 sticky top-0 z-30">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <button className="lg:hidden" onClick={() => setMobileOpen(true)}>
                <Menu size={24} />
              </button>

              <div>
                <h1 className="text-xl lg:text-2xl font-bold text-slate-900">
                  Cooperative Admin
                </h1>

                <p className="text-xs lg:text-sm text-slate-500">
                  Manage ShramSetu operations
                </p>
              </div>
            </div>

            <button
              onClick={loadData}
              disabled={refreshing}
              className="flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-sm"
            >
              <RefreshCw
                size={16}
                className={refreshing ? "animate-spin" : ""}
              />

              <span className="hidden sm:inline">Refresh</span>
            </button>
          </div>
        </header>

        <div className="p-5 lg:p-8">
          {/* =========================================
              DASHBOARD
          ========================================= */}

          {activeTab === "dashboard" && (
            <DashboardHome
              summary={summary}
              activities={activities}
              workers={workers}
              bookings={bookings}
              onNavigate={setActiveTab}
            />
          )}

          {/* =========================================
              WORKERS
          ========================================= */}

          {activeTab === "workers" && (
            <section>
              <SectionHeader
                title="Worker Management"
                description="Manage registered cooperative workers."
                onExport={() => exportCSV("workers")}
              />

              <Toolbar
                search={search}
                setSearch={setSearch}
                placeholder="Search worker, skill, city..."
              >
                <select
                  value={workerFilter}
                  onChange={(e) => setWorkerFilter(e.target.value)}
                  className="px-3 py-2 border rounded-xl text-sm"
                >
                  <option value="all">All Workers</option>

                  <option value="pending">Pending</option>

                  <option value="verified">Verified</option>

                  <option value="rejected">Rejected</option>
                </select>
              </Toolbar>

              <DataTable>
                <thead>
                  <tr>
                    <th>Worker</th>
                    <th>Skill</th>
                    <th>Location</th>
                    <th>Experience</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredWorkers.map((worker) => (
                    <tr key={worker.id}>
                      <td>
                        <div className="font-semibold">
                          {worker.name || "Unnamed Worker"}
                        </div>

                        <div className="text-xs text-slate-500">
                          {worker.phone}
                        </div>
                      </td>

                      <td>{worker.skill || "—"}</td>

                      <td>{worker.city || "—"}</td>

                      <td>{worker.experience || 0} yrs</td>

                      <td>
                        <span
                          className={`px-2.5 py-1 rounded-full text-xs font-medium ${statusClass(
                            worker.verificationStatus,
                          )}`}
                        >
                          {worker.verificationStatus || "pending"}
                        </span>
                      </td>

                      <td>
                        <div className="flex gap-2">
                          <button
                            onClick={() => setSelectedWorker(worker)}
                            className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200"
                            title="View"
                          >
                            <Eye size={16} />
                          </button>

                          {worker.verificationStatus === "pending" && (
                            <>
                              <button
                                onClick={() => verifyWorker(worker)}
                                className="p-2 rounded-lg bg-green-100 text-green-700 hover:bg-green-200"
                                title="Verify"
                              >
                                <CheckCircle2 size={16} />
                              </button>

                              <button
                                onClick={() => rejectWorker(worker)}
                                className="p-2 rounded-lg bg-red-100 text-red-700 hover:bg-red-200"
                                title="Reject"
                              >
                                <XCircle size={16} />
                              </button>
                            </>
                          )}

                          {worker.verificationStatus === "verified" && (
                            <button
                              onClick={() => toggleSuspension(worker)}
                              className={`p-2 rounded-lg ${
                                worker.suspended
                                  ? "bg-green-100 text-green-700"
                                  : "bg-red-100 text-red-700"
                              }`}
                              title={worker.suspended ? "Activate" : "Suspend"}
                            >
                              {worker.suspended ? (
                                <CheckCircle2 size={16} />
                              ) : (
                                <Ban size={16} />
                              )}
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </DataTable>
            </section>
          )}

          {/* =========================================
              CUSTOMERS
          ========================================= */}

          {activeTab === "customers" && (
            <section>
              <SectionHeader
                title="Customer Management"
                description="View registered customers and their activity."
                onExport={() => exportCSV("customers")}
              />

              <Toolbar
                search={search}
                setSearch={setSearch}
                placeholder="Search customer..."
              >
                <select
                  value={customerFilter}
                  onChange={(e) => setCustomerFilter(e.target.value)}
                  className="px-3 py-2 border rounded-xl text-sm"
                >
                  <option value="all">All Customers</option>

                  <option value="active">Active</option>

                  <option value="inactive">Inactive</option>
                </select>
              </Toolbar>

              <DataTable>
                <thead>
                  <tr>
                    <th>Customer</th>
                    <th>Contact</th>
                    <th>Location</th>
                    <th>Bookings</th>
                    <th>Status</th>
                    <th>Joined</th>
                    <th></th>
                  </tr>
                </thead>

                <tbody>
                  {filteredCustomers.map((customer) => (
                    <tr key={customer.id || customer.email}>
                      <td>
                        <div className="font-semibold">
                          {customer.name || "Customer"}
                        </div>
                      </td>

                      <td>
                        <div className="text-sm">{customer.phone || "—"}</div>

                        <div className="text-xs text-slate-500">
                          {customer.email || "—"}
                        </div>
                      </td>

                      <td>{customer.city || customer.address || "—"}</td>

                      <td>{customer.bookingsCount || 0}</td>

                      <td>
                        <span
                          className={`px-2.5 py-1 rounded-full text-xs ${statusClass(
                            customer.status || "active",
                          )}`}
                        >
                          {customer.status || "active"}
                        </span>
                      </td>

                      <td>
                        {formatDate(customer.createdAt || customer.joinedAt)}
                      </td>

                      <td>
                        <button
                          onClick={() => setSelectedCustomer(customer)}
                          className="p-2 rounded-lg bg-slate-100"
                        >
                          <Eye size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </DataTable>

              {!filteredCustomers.length && (
                <EmptyState text="No registered customers found." />
              )}
            </section>
          )}

          {/* =========================================
              BOOKINGS
          ========================================= */}

          {activeTab === "bookings" && (
            <section>
              <SectionHeader
                title="Booking Management"
                description="Monitor and manage platform bookings."
                onExport={() => exportCSV("bookings")}
              />

              <Toolbar
                search={search}
                setSearch={setSearch}
                placeholder="Search booking, customer, worker..."
              >
                <select
                  value={bookingFilter}
                  onChange={(e) => setBookingFilter(e.target.value)}
                  className="px-3 py-2 border rounded-xl text-sm"
                >
                  <option value="all">All</option>

                  <option value="confirmed">Confirmed</option>

                  <option value="accepted">Accepted</option>

                  <option value="in progress">In Progress</option>

                  <option value="completed">Completed</option>

                  <option value="cancelled">Cancelled</option>
                </select>
              </Toolbar>

              <DataTable>
                <thead>
                  <tr>
                    <th>Booking</th>
                    <th>Customer</th>
                    <th>Worker</th>
                    <th>Service</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th></th>
                  </tr>
                </thead>

                <tbody>
                  {filteredBookings.map((booking) => {
                    const id = booking.id || booking.bookingId;

                    return (
                      <tr key={id}>
                        <td className="font-medium">#{id}</td>

                        <td>
                          {booking.customerName || booking.customer || "—"}
                        </td>

                        <td>{booking.workerName || booking.worker || "—"}</td>

                        <td>{booking.service || booking.serviceName || "—"}</td>

                        <td>
                          {formatCurrency(
                            booking.totalAmount ||
                              booking.amount ||
                              booking.price,
                          )}
                        </td>

                        <td>
                          <span
                            className={`px-2.5 py-1 rounded-full text-xs ${statusClass(
                              booking.status,
                            )}`}
                          >
                            {booking.status || "Unknown"}
                          </span>
                        </td>

                        <td>
                          <button
                            onClick={() => setSelectedBooking(booking)}
                            className="p-2 bg-slate-100 rounded-lg"
                          >
                            <Eye size={16} />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </DataTable>
            </section>
          )}

          {/* =========================================
              KYC
          ========================================= */}

          {activeTab === "kyc" && (
            <KYCPanel
              workers={workers}
              onVerify={verifyWorker}
              onReject={rejectWorker}
              onView={setSelectedWorker}
            />
          )}

          {/* =========================================
              REPORTS
          ========================================= */}

          {activeTab === "reports" && (
            <ReportsPanel
              summary={summary}
              workers={workers}
              customers={customers}
              bookings={bookings}
              onExport={exportCSV}
            />
          )}

          {/* =========================================
              COOPERATIVES
          ========================================= */}

          {activeTab === "cooperatives" && (
            <CooperativePanel workers={workers} />
          )}

          {/* =========================================
              DISPUTES
          ========================================= */}

          {activeTab === "disputes" && (
            <DisputesPanel
              disputes={disputes}
              onUpdate={async (id, status) => {
                await updateDispute(id, status);

                await loadData();
              }}
            />
          )}

          {/* =========================================
              WELFARE
          ========================================= */}

          {activeTab === "welfare" && <WelfarePanel workers={workers} />}
        </div>
      </main>

      {/* WORKER MODAL */}

      {selectedWorker && (
        <WorkerModal
          worker={selectedWorker}
          onClose={() => setSelectedWorker(null)}
          onVerify={() => verifyWorker(selectedWorker)}
          onReject={() => rejectWorker(selectedWorker)}
        />
      )}

      {/* CUSTOMER MODAL */}

      {selectedCustomer && (
        <CustomerModal
          customer={selectedCustomer}
          bookings={bookings}
          onClose={() => setSelectedCustomer(null)}
        />
      )}

      {/* BOOKING MODAL */}

      {selectedBooking && (
        <BookingModal
          booking={selectedBooking}
          onClose={() => setSelectedBooking(null)}
          onChangeStatus={changeBookingStatus}
        />
      )}
    </div>
  );
}

/* ==================================================
   DASHBOARD HOME
================================================== */

function DashboardHome({ summary, activities, workers, bookings, onNavigate }) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Dashboard Overview</h2>

        <p className="text-sm text-slate-500 mt-1">
          Real-time cooperative operations overview.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard
          title="Registered Workers"
          value={summary.totalWorkers}
          icon={Users}
          description={`${summary.verifiedWorkers} verified`}
        />

        <StatCard
          title="Registered Customers"
          value={summary.totalCustomers}
          icon={UserRound}
        />

        <StatCard
          title="Total Bookings"
          value={summary.totalBookings}
          icon={ClipboardList}
          description={`${summary.activeBookings} active`}
        />

        <StatCard
          title="Completed Services"
          value={summary.completedBookings}
          icon={CheckCircle2}
        />

        <StatCard
          title="Pending KYC"
          value={summary.pendingKYC}
          icon={ShieldCheck}
          description="Requires review"
        />

        <StatCard
          title="Cancelled"
          value={summary.cancelledBookings}
          icon={XCircle}
        />

        <StatCard
          title="Platform Revenue"
          value={formatCurrency(summary.revenue)}
          icon={IndianRupee}
        />

        <StatCard
          title="Open Disputes"
          value={summary.openDisputes}
          icon={AlertTriangle}
        />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* QUICK ACTIONS */}

        <div className="lg:col-span-2 bg-white border rounded-2xl p-6">
          <h3 className="font-bold mb-5">Quick Actions</h3>

          <div className="grid sm:grid-cols-2 gap-3">
            <QuickAction
              title="Review KYC"
              description={`${summary.pendingKYC} pending applications`}
              icon={ShieldCheck}
              onClick={() => onNavigate("kyc")}
            />

            <QuickAction
              title="View Workers"
              description={`${summary.totalWorkers} registered workers`}
              icon={Users}
              onClick={() => onNavigate("workers")}
            />

            <QuickAction
              title="Monitor Bookings"
              description={`${summary.activeBookings} active bookings`}
              icon={ClipboardList}
              onClick={() => onNavigate("bookings")}
            />

            <QuickAction
              title="View Reports"
              description="Analytics & performance"
              icon={BarChart3}
              onClick={() => onNavigate("reports")}
            />
          </div>
        </div>

        {/* ACTIVITY */}

        <div className="bg-white border rounded-2xl p-6">
          <h3 className="font-bold mb-5">Recent Activity</h3>

          <div className="space-y-4">
            {activities.slice(0, 6).map((activity) => (
              <div key={activity.id} className="flex gap-3">
                <div className="mt-1">
                  <CheckCircle2 size={16} />
                </div>

                <div>
                  <p className="text-sm">{activity.message}</p>

                  <p className="text-xs text-slate-400 mt-1">
                    {formatDate(activity.createdAt)}
                  </p>
                </div>
              </div>
            ))}

            {!activities.length && (
              <p className="text-sm text-slate-500">No activity yet.</p>
            )}
          </div>
        </div>
      </div>

      {/* KYC PREVIEW */}

      <div className="bg-white border rounded-2xl p-6">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="font-bold">Pending Verification</h3>

            <p className="text-sm text-slate-500">
              Workers waiting for cooperative approval.
            </p>
          </div>

          <button
            onClick={() => onNavigate("kyc")}
            className="text-sm font-semibold"
          >
            View All →
          </button>
        </div>

        <div className="space-y-3">
          {workers
            .filter((worker) => worker.verificationStatus === "pending")
            .slice(0, 5)
            .map((worker) => (
              <div
                key={worker.id}
                className="flex items-center justify-between border rounded-xl p-4"
              >
                <div>
                  <p className="font-semibold">{worker.name}</p>

                  <p className="text-xs text-slate-500">
                    {worker.skill} · {worker.city}
                  </p>
                </div>

                <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-700 text-xs">
                  Pending
                </span>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}

/* ==================================================
   SECTION HEADER
================================================== */

function SectionHeader({ title, description, onExport }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
      <div>
        <h2 className="text-2xl font-bold">{title}</h2>

        <p className="text-sm text-slate-500 mt-1">{description}</p>
      </div>

      <button
        onClick={onExport}
        className="flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-slate-900 text-white text-sm"
      >
        <Download size={16} />
        Export CSV
      </button>
    </div>
  );
}

/* ==================================================
   TOOLBAR
================================================== */

function Toolbar({ search, setSearch, placeholder, children }) {
  return (
    <div className="bg-white border rounded-2xl p-4 mb-5 flex flex-col sm:flex-row gap-3">
      <div className="relative flex-1">
        <Search
          size={18}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
        />

        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={placeholder}
          className="w-full pl-10 pr-4 py-2.5 border rounded-xl outline-none focus:ring-2 focus:ring-slate-200"
        />
      </div>

      {children}
    </div>
  );
}

/* ==================================================
   DATA TABLE
================================================== */

function DataTable({ children }) {
  return (
    <div className="bg-white border rounded-2xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">{children}</table>
      </div>
    </div>
  );
}
/* ==================================================
   KYC PANEL
================================================== */

function KYCPanel({ workers, onVerify, onReject, onView }) {
  const pending = workers.filter(
    (worker) => worker.verificationStatus === "pending",
  );

  return (
    <section>
      <SectionHeader
        title="KYC Verification"
        description="Review and approve cooperative worker registrations."
        onExport={() => {
          const blob = new Blob([JSON.stringify(pending, null, 2)], {
            type: "application/json",
          });

          const url = URL.createObjectURL(blob);

          const a = document.createElement("a");

          a.href = url;
          a.download = "pending-kyc.json";

          a.click();

          URL.revokeObjectURL(url);
        }}
      />

      <div className="grid gap-4">
        {pending.map((worker) => (
          <div key={worker.id} className="bg-white border rounded-2xl p-5">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
              <div>
                <h3 className="font-bold text-lg">{worker.name}</h3>

                <p className="text-sm text-slate-500 mt-1">
                  {worker.skill} · {worker.experience || 0} years experience
                </p>

                <p className="text-sm text-slate-500">{worker.city}</p>
              </div>

              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => onView(worker)}
                  className="px-4 py-2 border rounded-xl text-sm"
                >
                  View Details
                </button>

                <button
                  onClick={() => onVerify(worker)}
                  className="px-4 py-2 rounded-xl bg-green-600 text-white text-sm"
                >
                  Approve
                </button>

                <button
                  onClick={() => onReject(worker)}
                  className="px-4 py-2 rounded-xl bg-red-600 text-white text-sm"
                >
                  Reject
                </button>
              </div>
            </div>
          </div>
        ))}

        {!pending.length && <EmptyState text="No pending KYC applications." />}
      </div>
    </section>
  );
}

/* ==================================================
   REPORTS
================================================== */

function ReportsPanel({ summary, workers, customers, bookings, onExport }) {
  const serviceDemand = {};

  bookings.forEach((booking) => {
    const service = booking.service || booking.serviceName || "Other";

    serviceDemand[service] = (serviceDemand[service] || 0) + 1;
  });

  const topServices = Object.entries(serviceDemand)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6);

  return (
    <section className="space-y-6">
      <SectionHeader
        title="Reports & Analytics"
        description="Monitor marketplace performance and cooperative operations."
        onExport={() => onExport("bookings")}
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard
          title="Revenue"
          value={formatCurrency(summary.revenue)}
          icon={IndianRupee}
        />

        <StatCard
          title="Worker Earnings"
          value={formatCurrency(summary.workerEarnings)}
          icon={Users}
        />

        <StatCard
          title="Completion Rate"
          value={
            summary.totalBookings
              ? `${Math.round(
                  (summary.completedBookings / summary.totalBookings) * 100,
                )}%`
              : "0%"
          }
          icon={TrendingUp}
        />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* SERVICE DEMAND */}

        <div className="bg-white border rounded-2xl p-6">
          <h3 className="font-bold mb-5">Most Demanded Services</h3>

          <div className="space-y-4">
            {topServices.map(([service, count]) => {
              const max = topServices[0]?.[1] || 1;

              const percentage = (count / max) * 100;

              return (
                <div key={service}>
                  <div className="flex justify-between text-sm mb-2">
                    <span>{service}</span>

                    <span className="font-semibold">{count}</span>
                  </div>

                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-slate-900 rounded-full"
                      style={{
                        width: `${percentage}%`,
                      }}
                    />
                  </div>
                </div>
              );
            })}

            {!topServices.length && (
              <EmptyState text="No booking data available." />
            )}
          </div>
        </div>

        {/* WORKER UTILIZATION */}

        <div className="bg-white border rounded-2xl p-6">
          <h3 className="font-bold mb-5">Worker Overview</h3>

          <div className="space-y-4">
            <ReportRow label="Total Workers" value={workers.length} />

            <ReportRow
              label="Verified Workers"
              value={
                workers.filter((w) => w.verificationStatus === "verified")
                  .length
              }
            />

            <ReportRow
              label="Pending Verification"
              value={
                workers.filter((w) => w.verificationStatus === "pending").length
              }
            />

            <ReportRow
              label="Suspended Workers"
              value={workers.filter((w) => w.suspended).length}
            />

            <ReportRow label="Customers" value={customers.length} />

            <ReportRow label="Total Bookings" value={bookings.length} />
          </div>
        </div>
      </div>
    </section>
  );
}

function ReportRow({ label, value }) {
  return (
    <div className="flex justify-between py-3 border-b last:border-0">
      <span className="text-sm text-slate-500">{label}</span>

      <span className="font-bold">{value}</span>
    </div>
  );
}

/* ==================================================
   COOPERATIVE NETWORK
================================================== */

function CooperativePanel({ workers }) {
  const grouped = {};

  workers.forEach((worker) => {
    const cooperative =
      worker.cooperative || worker.cooperativeName || "ShramSetu Cooperative";

    if (!grouped[cooperative]) {
      grouped[cooperative] = [];
    }

    grouped[cooperative].push(worker);
  });

  return (
    <section>
      <SectionHeader
        title="Cooperative Network"
        description="Overview of participating cooperative worker groups."
        onExport={() => {}}
      />

      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
        {Object.entries(grouped).map(([name, members]) => (
          <div key={name} className="bg-white border rounded-2xl p-6">
            <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center mb-4">
              <Building2 size={22} />
            </div>

            <h3 className="font-bold">{name}</h3>

            <p className="text-sm text-slate-500 mt-1">
              {members.length} registered workers
            </p>

            <div className="mt-5 text-sm">
              <div className="flex justify-between">
                <span>Verified</span>

                <b>
                  {
                    members.filter(
                      (worker) => worker.verificationStatus === "verified",
                    ).length
                  }
                </b>
              </div>
            </div>
          </div>
        ))}
      </div>

      {!Object.keys(grouped).length && (
        <EmptyState text="No cooperative network data available." />
      )}
    </section>
  );
}

/* ==================================================
   DISPUTES
================================================== */

function DisputesPanel({ disputes, onUpdate }) {
  return (
    <section>
      <SectionHeader
        title="Dispute Management"
        description="Review customer-worker disputes and resolutions."
        onExport={() => {}}
      />

      <div className="space-y-4">
        {disputes.map((dispute) => (
          <div key={dispute.id} className="bg-white border rounded-2xl p-5">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div>
                <p className="font-bold">
                  {dispute.title || `Dispute #${dispute.id}`}
                </p>

                <p className="text-sm text-slate-500 mt-1">
                  {dispute.description || "No description"}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span
                  className={`px-3 py-1 rounded-full text-xs ${statusClass(
                    dispute.status,
                  )}`}
                >
                  {dispute.status}
                </span>

                {dispute.status !== "resolved" && (
                  <button
                    onClick={() => onUpdate(dispute.id, "resolved")}
                    className="px-3 py-2 bg-green-600 text-white rounded-xl text-sm"
                  >
                    Resolve
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}

        {!disputes.length && <EmptyState text="No disputes reported." />}
      </div>
    </section>
  );
}

/* ==================================================
   WELFARE
================================================== */

function WelfarePanel({ workers }) {
  const verified = workers.filter(
    (worker) => worker.verificationStatus === "verified",
  );

  return (
    <section>
      <SectionHeader
        title="Worker Welfare"
        description="Monitor cooperative worker welfare coverage."
        onExport={() => {}}
      />

      <div className="grid md:grid-cols-3 gap-5">
        <WelfareCard
          title="Workers Covered"
          value={verified.length}
          icon={HeartPulse}
        />

        <WelfareCard
          title="Insurance Status"
          value="Active"
          icon={ShieldCheck}
        />

        <WelfareCard
          title="Emergency Support"
          value="Available"
          icon={AlertTriangle}
        />
      </div>

      <div className="mt-6 bg-white border rounded-2xl p-6">
        <h3 className="font-bold mb-4">Welfare Policy</h3>

        <p className="text-sm text-slate-600 leading-relaxed">
          Cooperative workers can receive insurance coverage, welfare-fund
          assistance and emergency support. Production implementation can
          connect this module to the cooperative's actual welfare records.
        </p>
      </div>
    </section>
  );
}

function WelfareCard({ title, value, icon: Icon }) {
  return (
    <div className="bg-white border rounded-2xl p-6">
      <Icon size={22} />

      <p className="text-sm text-slate-500 mt-4">{title}</p>

      <p className="text-2xl font-bold mt-1">{value}</p>
    </div>
  );
}

/* ==================================================
   QUICK ACTION
================================================== */

function QuickAction({ title, description, icon: Icon, onClick }) {
  return (
    <button
      onClick={onClick}
      className="text-left border rounded-xl p-4 hover:bg-slate-50 transition"
    >
      <Icon size={20} />

      <p className="font-semibold mt-3">{title}</p>

      <p className="text-xs text-slate-500 mt-1">{description}</p>
    </button>
  );
}

/* ==================================================
   MODALS
================================================== */

function WorkerModal({ worker, onClose, onVerify, onReject }) {
  return (
    <Modal onClose={onClose}>
      <h2 className="text-xl font-bold">Worker Verification</h2>

      <div className="mt-5 space-y-4">
        <Detail label="Name" value={worker.name} />

        <Detail label="Phone" value={worker.phone} />

        <Detail label="Skill" value={worker.skill} />

        <Detail label="Experience" value={`${worker.experience || 0} years`} />

        <Detail label="City" value={worker.city} />

        <Detail label="Address" value={worker.address} />

        <Detail label="Services" value={worker.services} />

        <Detail label="Service Area" value={worker.serviceArea} />

        <Detail label="Status" value={worker.verificationStatus} />
      </div>

      {worker.verificationStatus === "pending" && (
        <div className="flex gap-3 mt-6">
          <button
            onClick={onVerify}
            className="flex-1 py-2.5 bg-green-600 text-white rounded-xl"
          >
            Approve KYC
          </button>

          <button
            onClick={onReject}
            className="flex-1 py-2.5 bg-red-600 text-white rounded-xl"
          >
            Reject
          </button>
        </div>
      )}
    </Modal>
  );
}

function CustomerModal({ customer, bookings, onClose }) {
  const customerBookings = bookings.filter(
    (booking) =>
      booking.customerId === customer.id ||
      booking.customerEmail === customer.email,
  );

  return (
    <Modal onClose={onClose}>
      <h2 className="text-xl font-bold">Customer Details</h2>

      <div className="mt-5 space-y-4">
        <Detail label="Name" value={customer.name} />

        <Detail label="Email" value={customer.email} />

        <Detail label="Phone" value={customer.phone} />

        <Detail label="Location" value={customer.city || customer.address} />

        <Detail label="Total Bookings" value={customerBookings.length} />
      </div>
    </Modal>
  );
}

function BookingModal({ booking, onClose, onChangeStatus }) {
  const id = booking.id || booking.bookingId;

  return (
    <Modal onClose={onClose}>
      <h2 className="text-xl font-bold">Booking #{id}</h2>

      <div className="mt-5 space-y-4">
        <Detail
          label="Customer"
          value={booking.customerName || booking.customer}
        />

        <Detail label="Worker" value={booking.workerName || booking.worker} />

        <Detail
          label="Service"
          value={booking.service || booking.serviceName}
        />

        <Detail
          label="Amount"
          value={formatCurrency(
            booking.totalAmount || booking.amount || booking.price,
          )}
        />

        <Detail label="Status" value={booking.status} />
      </div>

      <div className="mt-6">
        <p className="text-sm font-semibold mb-2">Update Status</p>

        <div className="flex flex-wrap gap-2">
          {["Confirmed", "In Progress", "Completed", "Cancelled"].map(
            (status) => (
              <button
                key={status}
                onClick={() => onChangeStatus(booking, status)}
                className="px-3 py-2 border rounded-xl text-sm hover:bg-slate-50"
              >
                {status}
              </button>
            ),
          )}
        </div>
      </div>
    </Modal>
  );
}

/* ==================================================
   MODAL BASE
================================================== */

function Modal({ children, onClose }) {
  return (
    <div className="fixed inset-0 z-[100] bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-6 relative">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 p-2 rounded-lg hover:bg-slate-100"
        >
          <X size={18} />
        </button>

        {children}
      </div>
    </div>
  );
}

/* ==================================================
   DETAIL
================================================== */

function Detail({ label, value }) {
  return (
    <div>
      <p className="text-xs text-slate-400 uppercase">{label}</p>

      <p className="text-sm font-medium mt-1 break-words">{value || "—"}</p>
    </div>
  );
}

/* ==================================================
   EMPTY
================================================== */

function EmptyState({ text }) {
  return (
    <div className="bg-white border rounded-2xl p-10 text-center text-slate-500">
      {text}
    </div>
  );
}
