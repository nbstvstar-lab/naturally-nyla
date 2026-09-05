import React, { useState, useEffect, useMemo } from "react";
import {
  Plus, Pencil, Trash2, X, DollarSign, Calendar, Package, TrendingUp,
  TrendingDown, Search, ChevronUp, ChevronDown, CheckCircle2, Clock, XCircle,
  AlertTriangle, Sparkles, Wallet, CalendarClock, CalendarCheck2,
  StickyNote, Crown, ArrowUpRight, ArrowDownRight, ShoppingCart, RefreshCw,
  BarChart3, Award
} from "lucide-react";

/* ------------------------------------------------------------------ */
/* Utilities & Configurations                                         */
/* ------------------------------------------------------------------ */

const uid = () => Math.random().toString(36).slice(2, 10) + Date.now().toString(36);

const currency = (n) =>
  (Number(n) || 0).toLocaleString("en-US", { style: "currency", currency: "USD" });

const shortDate = (isoDate) => {
  if (!isoDate) return "";
  const d = new Date(isoDate + "T00:00:00");
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
};

const formatMonthYear = (yearMonthStr) => {
  if (!yearMonthStr) return "";
  const [y, m] = yearMonthStr.split("-").map(Number);
  const d = new Date(y, m - 1, 1);
  return d.toLocaleDateString("en-US", { month: "long", year: "numeric" });
};

const formatShortMonth = (yearMonthStr) => {
  if (!yearMonthStr) return "";
  const [y, m] = yearMonthStr.split("-").map(Number);
  const d = new Date(y, m - 1, 1);
  return d.toLocaleDateString("en-US", { month: "short", year: "2-digit" });
};

const to12h = (t) => {
  if (!t) return "";
  const [h, m] = t.split(":").map(Number);
  const period = h >= 12 ? "PM" : "AM";
  const hour = h % 12 === 0 ? 12 : h % 12;
  return `${hour}:${String(m).padStart(2, "0")} ${period}`;
};

const SERVICES = [
  "Retwist",
  "Retwist + Style",
  "Cornrows",
  "Half-head Cornrows",
  "Twists/Braids",
  "Other",
];

const PAYMENT_METHODS = ["Zelle", "CashApp", "Cash", "Card", "Venmo"];
const REVENUE_SOURCES = ["Client Service", "Tip", "Product Sale", "Other"];
const INVENTORY_CATEGORIES = ["Hair Products", "Braiding Hair", "Tools & Combs", "Accessories", "Sanitation / Other"];

/* ------------------------------------------------------------------ */
/* 4-Point Cross Star / Sparkle Background                            */
/* ------------------------------------------------------------------ */

const CrossStar = ({ size = 24, className = "", style = {} }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} className={className} style={style} fill="currentColor">
    <path d="M12 0C12 6.627 6.627 12 0 12C6.627 12 12 17.373 12 24C12 17.373 17.373 12 24 12C17.373 12 12 6.627 12 0Z" />
  </svg>
);

function BackgroundStars() {
  const stars = [
    { top: "5%", left: "3%", size: 24, color: "text-[#ccaa79]", delay: "0s", duration: "4s" },
    { top: "12%", right: "6%", size: 32, color: "text-[#5f0d7a]/25", delay: "1s", duration: "5s" },
    { top: "28%", left: "92%", size: 18, color: "text-[#ccaa79]/80", delay: "2s", duration: "3.5s" },
    { top: "45%", left: "2%", size: 26, color: "text-[#5f0d7a]/20", delay: "1.5s", duration: "6s" },
    { top: "62%", right: "4%", size: 24, color: "text-[#ccaa79]", delay: "0.5s", duration: "4.5s" },
    { top: "78%", left: "5%", size: 20, color: "text-[#ccaa79]/60", delay: "2.5s", duration: "5s" },
    { top: "86%", right: "10%", size: 28, color: "text-[#5f0d7a]/25", delay: "1.2s", duration: "4.2s" },
  ];

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {stars.map((s, i) => (
        <div
          key={i}
          className={`absolute ${s.color} animate-pulse`}
          style={{
            top: s.top,
            left: s.left,
            right: s.right,
            animationDelay: s.delay,
            animationDuration: s.duration,
          }}
        >
          <CrossStar size={s.size} />
        </div>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Storage Hook & Micro Components                                    */
/* ------------------------------------------------------------------ */

function useLocalState(key, initialValue) {
  const [state, setState] = useState(() => {
    try {
      const raw = window.localStorage?.getItem(key);
      if (raw) return JSON.parse(raw);
    } catch (e) {}
    return initialValue;
  });
  useEffect(() => {
    try {
      window.localStorage?.setItem(key, JSON.stringify(state));
    } catch (e) {}
  }, [key, state]);
  return [state, setState];
}

const PillButton = ({ children, onClick, variant = "primary", className = "", type = "button", disabled }) => {
  const base = "inline-flex items-center justify-center gap-2 rounded-full font-bold transition-all active:scale-95 disabled:opacity-40 shadow-sm cursor-pointer";
  const variants = {
    primary: "bg-gradient-to-r from-[#5f0d7a] to-[#7b149d] text-white hover:from-[#4d0963] hover:to-[#681085] shadow-[#5f0d7a]/25",
    gold: "bg-gradient-to-r from-[#ccaa79] to-[#dfc399] text-[#341e05] hover:brightness-105 shadow-[#ccaa79]/30",
    danger: "bg-rose-50 text-rose-600 border border-rose-200 hover:bg-rose-100",
    subtle: "bg-[#f5eef9] text-[#5f0d7a] hover:bg-[#ecdef3]",
  };
  return (
    <button type={type} onClick={onClick} disabled={disabled} className={`${base} ${variants[variant]} px-5 py-2.5 text-sm ${className}`}>
      {children}
    </button>
  );
};

const IconCircleButton = ({ icon: Icon, onClick, variant = "purple", size = "sm", title }) => {
  const sizes = { sm: "w-8 h-8", md: "w-10 h-10" };
  const variants = {
    purple: "bg-[#f4ecfb] text-[#5f0d7a] hover:bg-[#ebdcf6]",
    gold: "bg-[#fbf4ea] text-[#936b28] hover:bg-[#f5e5cf]",
    green: "bg-emerald-50 text-emerald-600 hover:bg-emerald-100",
    danger: "bg-rose-50 text-rose-500 hover:bg-rose-100",
  };
  return (
    <button
      type="button"
      title={title}
      onClick={onClick}
      className={`${sizes[size]} ${variants[variant]} rounded-full flex items-center justify-center transition active:scale-90 shrink-0 shadow-2xs cursor-pointer`}
    >
      <Icon size={size === "sm" ? 15 : 18} strokeWidth={2.4} />
    </button>
  );
};

const Badge = ({ children, tone = "purple" }) => {
  const tones = {
    purple: "bg-[#f4ecfb] text-[#5f0d7a] border border-[#e8d5f3]",
    gold: "bg-[#fbf5eb] text-[#8e6524] border border-[#ecd9be]",
    green: "bg-emerald-50 text-emerald-700 border border-emerald-200",
    red: "bg-rose-50 text-rose-600 border border-rose-200",
    amber: "bg-amber-50 text-amber-800 border border-amber-200",
  };
  return (
    <span className={`${tones[tone]} px-3 py-0.5 rounded-full text-xs font-bold whitespace-nowrap shadow-2xs`}>
      {children}
    </span>
  );
};

function Modal({ open, onClose, title, children, icon: Icon }) {
  if (!open) return null;
  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-[#1e0527]/60 backdrop-blur-[3px] p-0 sm:p-4"
      onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="bg-white w-full sm:max-w-lg rounded-t-[32px] sm:rounded-[32px] max-h-[90vh] overflow-y-auto shadow-2xl border-2 border-[#ccaa79]/40 animate-[slideUp_0.25s_ease-out]">
        <div className="sticky top-0 bg-white/95 backdrop-blur px-6 pt-6 pb-4 flex items-center justify-between border-b border-[#f3e9f8] rounded-t-[32px] z-10">
          <div className="flex items-center gap-3">
            {Icon && (
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#5f0d7a] to-[#8c1ba8] text-[#ccaa79] flex items-center justify-center shadow-md shadow-[#5f0d7a]/20">
                <Icon size={20} strokeWidth={2.5} />
              </div>
            )}
            <h3 className="text-xl font-black text-[#260531]">{title}</h3>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-[#f4ecfb] text-[#5f0d7a] flex items-center justify-center hover:bg-[#ebdcf6] transition active:scale-90 cursor-pointer"
          >
            <X size={18} strokeWidth={2.5} />
          </button>
        </div>
        <div className="p-6 pt-5">{children}</div>
      </div>
    </div>
  );
}

const Field = ({ label, children }) => (
  <label className="block mb-4">
    <span className="block text-xs font-black uppercase tracking-wider text-[#5f0d7a] mb-1.5">{label}</span>
    {children}
  </label>
);

const inputCls =
  "w-full rounded-2xl border-2 border-[#eeddf4] bg-[#fdfcff] px-4 py-3 text-sm font-bold text-[#2a0836] outline-none focus:border-[#5f0d7a] focus:bg-white focus:ring-4 focus:ring-[#ccaa79]/20 transition";

function ConfirmDialog({ open, message, onCancel, onConfirm }) {
  if (!open) return null;
  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-[#1e0527]/60 backdrop-blur-[3px] p-4"
      onMouseDown={(e) => { if (e.target === e.currentTarget) onCancel(); }}
    >
      <div className="bg-white rounded-[28px] p-6 w-full max-w-sm shadow-2xl border-2 border-rose-200 text-center">
        <div className="w-14 h-14 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center mx-auto mb-3 border border-rose-100">
          <Trash2 size={24} />
        </div>
        <p className="font-extrabold text-[#260531] text-lg mb-1">Confirm Deletion</p>
        <p className="text-xs text-[#7d688a] mb-5 font-semibold">{message}</p>
        <div className="flex gap-3">
          <PillButton variant="subtle" className="flex-1" onClick={onCancel}>Cancel</PillButton>
          <PillButton variant="danger" className="flex-1" onClick={onConfirm}>Delete</PillButton>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Main Application Container                                         */
/* ------------------------------------------------------------------ */

export default function App() {
  const [tab, setTab] = useState("overview");

  const [revenue, setRevenue] = useLocalState("nn_revenue_v2", []);
  const [appointments, setAppointments] = useLocalState("nn_appointments_v2", []);
  const [inventory, setInventory] = useLocalState("nn_inventory_v2", []);

  const [completingAppt, setCompletingAppt] = useState(null);

  /* Calculations */
  const totalRevenue = useMemo(() => revenue.reduce((s, r) => s + Number(r.amount || 0), 0), [revenue]);
  const totalSupplyExpenses = useMemo(
    () => inventory.reduce((s, p) => s + Number(p.totalSpent || 0), 0),
    [inventory]
  );
  const netProfit = totalRevenue - totalSupplyExpenses;
  const totalAppointments = appointments.length;

  /* Monthly Revenue Grouping */
  const now = new Date();
  const currentMonthKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  const prevDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const prevMonthKey = `${prevDate.getFullYear()}-${String(prevDate.getMonth() + 1).padStart(2, "0")}`;

  const monthlyData = useMemo(() => {
    const map = {};
    revenue.forEach((r) => {
      const ym = (r.date || "").slice(0, 7);
      if (!ym) return;
      if (!map[ym]) map[ym] = { revenue: 0, count: 0 };
      map[ym].revenue += Number(r.amount || 0);
      map[ym].count += 1;
    });
    return map;
  }, [revenue]);

  const currentMonthRevenue = monthlyData[currentMonthKey]?.revenue || 0;
  const prevMonthRevenue = monthlyData[prevMonthKey]?.revenue || 0;
  const monthDiff = currentMonthRevenue - prevMonthRevenue;
  const monthDiffPct = prevMonthRevenue > 0 ? ((monthDiff / prevMonthRevenue) * 100).toFixed(0) : null;

  /* Finalize appointment completion & tip */
  const handleFinalizeCompletion = ({ apptId, tip, paymentMethod, date }) => {
    const appt = appointments.find((a) => a.id === apptId);
    if (!appt) return;

    const base = Number(appt.price) || 0;
    const tipVal = Number(tip) || 0;
    const finalAmount = base + tipVal;

    setAppointments((prev) =>
      prev.map((a) => (a.id === apptId ? { ...a, status: "Completed", tip: tipVal } : a))
    );

    const newRev = {
      id: uid(),
      date: date || new Date().toISOString().slice(0, 10),
      source: appt.client,
      service: `${appt.service}${tipVal > 0 ? ` (+$${tipVal} tip)` : ""}`,
      amount: finalAmount,
      method: paymentMethod,
      apptId: appt.id,
    };
    setRevenue((prev) => [newRev, ...prev]);
    setCompletingAppt(null);
  };

  return (
    <div
      className="min-h-screen w-full relative overflow-hidden bg-[#faf5fd] text-[#2a0836]"
      style={{ fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif" }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@500;600;700;800;900&display=swap');
        @keyframes slideUp { from { transform: translateY(20px); opacity: 0.3 } to { transform: translateY(0); opacity: 1 } }
        ::selection { background: #ccaa79; color: #2e083c; }
      `}</style>

      <BackgroundStars />
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#5f0d7a]/10 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-1/3 left-10 w-96 h-96 bg-[#ccaa79]/20 rounded-full blur-3xl pointer-events-none -z-10" />

      <Header tab={tab} setTab={setTab} />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 pb-24 pt-6 relative z-10">
        {tab === "overview" && (
          <OverviewTab
            totalRevenue={totalRevenue}
            currentMonthRevenue={currentMonthRevenue}
            monthDiff={monthDiff}
            monthDiffPct={monthDiffPct}
            netProfit={netProfit}
            totalAppointments={totalAppointments}
            revenue={revenue}
            setRevenue={setRevenue}
            onOpenPerformance={() => setTab("performance")}
          />
        )}
        {tab === "performance" && (
          <PerformanceTab monthlyData={monthlyData} revenue={revenue} />
        )}
        {tab === "appointments" && (
          <AppointmentsTab
            appointments={appointments}
            setAppointments={setAppointments}
            onPromptCompletion={(appt) => setCompletingAppt(appt)}
          />
        )}
        {tab === "inventory" && (
          <InventoryTab inventory={inventory} setInventory={setInventory} />
        )}
      </main>

      {completingAppt && (
        <CompleteAppointmentModal
          appt={completingAppt}
          onClose={() => setCompletingAppt(null)}
          onConfirm={handleFinalizeCompletion}
        />
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Header Component                                                   */
/* ------------------------------------------------------------------ */

function Header({ tab, setTab }) {
  const items = [
    { id: "overview", label: "Overview", icon: Wallet },
    { id: "performance", label: "Monthly Tracker", icon: BarChart3 },
    { id: "appointments", label: "Appointments", icon: CalendarClock },
    { id: "inventory", label: "Supplies & Inventory", icon: Package },
  ];

  return (
    <header className="sticky top-0 z-30 bg-[#faf5fd]/90 backdrop-blur-lg border-b-2 border-[#ccaa79]/30 shadow-xs">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-5 pb-4 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-3xl bg-gradient-to-tr from-[#5f0d7a] via-[#751194] to-[#ccaa79] flex items-center justify-center shrink-0 shadow-lg shadow-[#5f0d7a]/30 group">
            <CrossStar size={24} className="text-white drop-shadow-sm transition-transform group-hover:rotate-45" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-[#5f0d7a] uppercase leading-none">
              Naturally <span className="text-[#ccaa79]">Nyla</span>
            </h1>
            <div className="flex items-center gap-2 mt-1">
              <span className="inline-block w-2 h-2 rounded-full bg-[#ccaa79]" />
              <p className="text-[11px] font-black uppercase tracking-widest text-[#7a488e]">
                Salon Business Suite
              </p>
            </div>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-2 bg-[#f2e2fa] border border-[#ccaa79]/50 rounded-full px-3.5 py-1.5">
          <Crown size={15} className="text-[#ccaa79]" strokeWidth={2.5} />
          <span className="text-xs font-bold text-[#5f0d7a]">Pro Hair Financials</span>
        </div>
      </div>

      <nav className="max-w-6xl mx-auto px-4 sm:px-6 pb-3 flex gap-2.5 overflow-x-auto no-scrollbar">
        {items.map((it) => {
          const active = tab === it.id;
          const Icon = it.icon;
          return (
            <button
              key={it.id}
              onClick={() => setTab(it.id)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-extrabold whitespace-nowrap transition-all active:scale-95 cursor-pointer ${
                active
                  ? "bg-gradient-to-r from-[#5f0d7a] to-[#7e14a0] text-white shadow-md shadow-[#5f0d7a]/30 ring-2 ring-[#ccaa79]/40"
                  : "bg-white text-[#5f0d7a] border-2 border-[#eedef5] hover:border-[#ccaa79]"
              }`}
            >
              <Icon size={16} strokeWidth={2.5} />
              {it.label}
            </button>
          );
        })}
      </nav>
    </header>
  );
}

/* ------------------------------------------------------------------ */
/* Overview Tab                                                       */
/* ------------------------------------------------------------------ */

const emptyRevenueForm = { date: "", source: "", service: SERVICES[0], amount: "", method: PAYMENT_METHODS[0] };

function OverviewTab({
  totalRevenue,
  currentMonthRevenue,
  monthDiff,
  monthDiffPct,
  netProfit,
  totalAppointments,
  revenue,
  setRevenue,
  onOpenPerformance,
}) {
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyRevenueForm);
  const [confirmId, setConfirmId] = useState(null);

  const sorted = useMemo(() => [...revenue].sort((a, b) => new Date(b.date) - new Date(a.date)), [revenue]);

  const openAdd = () => {
    setEditing(null);
    setForm({ ...emptyRevenueForm, date: new Date().toISOString().slice(0, 10), source: "" });
    setModalOpen(true);
  };

  const openEdit = (r) => {
    setEditing(r.id);
    setForm({ date: r.date, source: r.source, service: r.service, amount: r.amount, method: r.method });
    setModalOpen(true);
  };

  const save = (e) => {
    e.preventDefault();
    if (!form.date || !form.source || !Number(form.amount)) return;
    if (editing) {
      setRevenue((prev) => prev.map((r) => (r.id === editing ? { ...r, ...form, amount: Number(form.amount) } : r)));
    } else {
      setRevenue((prev) => [{ id: uid(), ...form, amount: Number(form.amount) }, ...prev]);
    }
    setModalOpen(false);
  };

  const remove = () => {
    setRevenue((prev) => prev.filter((r) => r.id !== confirmId));
    setConfirmId(null);
  };

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-gradient-to-br from-[#5f0d7a] via-[#6f118e] to-[#450959] text-white rounded-[32px] p-6 shadow-md border-2 border-[#ccaa79]/40 relative overflow-hidden flex flex-col justify-between min-h-[160px]">
          <CrossStar size={44} className="absolute -right-2 -top-2 text-[#ccaa79]/60 opacity-80" />
          <div className="w-10 h-10 rounded-2xl bg-[#ccaa79] text-[#2c1704] flex items-center justify-center font-bold">
            <DollarSign size={20} strokeWidth={2.6} />
          </div>
          <div>
            <p className="text-xs font-black uppercase tracking-wider text-purple-200 mb-1">Total Revenue</p>
            <p className="text-3xl sm:text-4xl font-black text-white tracking-tight">{currency(totalRevenue)}</p>
            <p className="text-xs font-bold text-[#f2ddbe] mt-1">{revenue.length} transactions logged</p>
          </div>
        </div>

        <div
          onClick={onOpenPerformance}
          className="bg-gradient-to-br from-[#ccaa79] via-[#d6b789] to-[#b7915b] text-[#2e1903] rounded-[32px] p-6 shadow-md border-2 border-[#5f0d7a]/25 relative overflow-hidden flex flex-col justify-between min-h-[160px] cursor-pointer hover:brightness-105 transition"
        >
          <CrossStar size={44} className="absolute -right-2 -top-2 text-[#5f0d7a]/30 opacity-70" />
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-2xl bg-[#5f0d7a] text-white flex items-center justify-center font-bold">
              <TrendingUp size={20} strokeWidth={2.6} />
            </div>
            {monthDiff >= 0 ? (
              <span className="inline-flex items-center gap-1 bg-[#2e1903] text-[#ccaa79] px-2.5 py-1 rounded-full text-xs font-black">
                <ArrowUpRight size={13} strokeWidth={3} /> {monthDiffPct ? `+${monthDiffPct}%` : "Up"}
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 bg-rose-900 text-white px-2.5 py-1 rounded-full text-xs font-black">
                <ArrowDownRight size={13} strokeWidth={3} /> {monthDiffPct ? `${monthDiffPct}%` : "Down"}
              </span>
            )}
          </div>
          <div>
            <p className="text-xs font-black uppercase tracking-wider text-[#4a2e0a] mb-1">This Month</p>
            <p className="text-3xl sm:text-4xl font-black text-[#2e1903] tracking-tight">{currency(currentMonthRevenue)}</p>
            <p className="text-xs font-black text-[#50330d] mt-1">
              {monthDiff >= 0 ? `+$${monthDiff.toFixed(0)} vs last month →` : `-$${Math.abs(monthDiff).toFixed(0)} vs last month →`}
            </p>
          </div>
        </div>

        <div className="bg-white rounded-[32px] p-6 shadow-md border-2 border-[#eeddf4] relative overflow-hidden flex flex-col justify-between min-h-[160px]">
          <div className="w-10 h-10 rounded-2xl bg-[#f4ecfb] text-[#5f0d7a] flex items-center justify-center">
            <Sparkles size={20} strokeWidth={2.4} />
          </div>
          <div>
            <p className="text-xs font-black uppercase tracking-wider text-[#8b6999] mb-1">Net Earnings</p>
            <p className="text-3xl font-black text-[#5f0d7a] tracking-tight">{currency(netProfit)}</p>
            <p className="text-xs font-bold text-[#9d7da9] mt-1">Total after supplies</p>
          </div>
        </div>

        <div className="bg-white rounded-[32px] p-6 shadow-md border-2 border-[#eeddf4] relative overflow-hidden flex flex-col justify-between min-h-[160px]">
          <div className="w-10 h-10 rounded-2xl bg-[#faf4ea] text-[#936b28] flex items-center justify-center">
            <Calendar size={20} strokeWidth={2.4} />
          </div>
          <div>
            <p className="text-xs font-black uppercase tracking-wider text-[#9f7d4e] mb-1">Appointments</p>
            <p className="text-3xl font-black text-[#855e1c] tracking-tight">{totalAppointments}</p>
            <p className="text-xs font-bold text-[#8e7454] mt-1">Bookings on file</p>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-2xl font-black text-[#5f0d7a]">Revenue Stream</h2>
          <p className="text-xs font-bold uppercase tracking-wider text-[#9f7ca6]">Cash, Card & Online Client Payments</p>
        </div>
        <PillButton onClick={openAdd} variant="primary">
          <Plus size={16} strokeWidth={3} /> Log Revenue
        </PillButton>
      </div>

      <div className="bg-white rounded-[32px] border-2 border-[#eedff5] shadow-md overflow-hidden">
        {sorted.length === 0 ? (
          <EmptyState icon={DollarSign} title="No revenue logged yet" desc="Completed appointments and manual sales will appear here." />
        ) : (
          <div className="divide-y-2 divide-[#faf3fc]">
            {sorted.map((r) => (
              <div key={r.id} className="flex items-center gap-4 px-6 py-4 hover:bg-[#faf4fd] transition group">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#5f0d7a] to-[#8c1ba8] text-[#ccaa79] flex items-center justify-center shrink-0 shadow-sm shadow-[#5f0d7a]/20">
                  <DollarSign size={20} strokeWidth={2.6} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-black text-[#280533] text-base truncate">{r.source}</p>
                  <p className="text-xs text-[#8e689f] font-bold truncate">{r.service}</p>
                </div>
                <div className="hidden sm:flex shrink-0 mr-2">
                  <Badge tone="gold">{r.method}</Badge>
                </div>
                <div className="text-right shrink-0 w-28">
                  <p className="font-black text-[#5f0d7a] text-lg leading-tight">{currency(r.amount)}</p>
                  <p className="text-[11px] text-[#ccaa79] font-black uppercase">{shortDate(r.date)}</p>
                </div>
                <div className="flex gap-1.5 shrink-0 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition">
                  <IconCircleButton icon={Pencil} variant="purple" onClick={() => openEdit(r)} title="Edit" />
                  <IconCircleButton icon={Trash2} variant="danger" onClick={() => setConfirmId(r.id)} title="Delete" />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? "Update Transaction" : "Log Income"} icon={DollarSign}>
        <form onSubmit={save}>
          <Field label="Payment Date">
            <input type="date" required className={inputCls} value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
          </Field>
          <Field label="Client or Source">
            <input
              required
              placeholder="e.g. Maya L. or Product Sale"
              className={inputCls}
              value={form.source}
              onChange={(e) => setForm({ ...form, source: e.target.value })}
            />
          </Field>
          <Field label="Service / Description">
            <input
              list="service-list"
              required
              placeholder="e.g. Retwist"
              className={inputCls}
              value={form.service}
              onChange={(e) => setForm({ ...form, service: e.target.value })}
            />
            <datalist id="service-list">{SERVICES.map((s) => <option key={s} value={s} />)}</datalist>
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Amount ($)">
              <input type="number" min="0" step="0.01" required className={inputCls} value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} />
            </Field>
            <Field label="Payment Method">
              <select className={inputCls} value={form.method} onChange={(e) => setForm({ ...form, method: e.target.value })}>
                {PAYMENT_METHODS.map((m) => <option key={m} value={m}>{m}</option>)}
              </select>
            </Field>
          </div>
          <div className="flex gap-3 mt-4">
            <PillButton type="button" variant="subtle" className="flex-1" onClick={() => setModalOpen(false)}>Cancel</PillButton>
            <PillButton type="submit" variant="primary" className="flex-1">{editing ? "Update Log" : "Confirm Entry"}</PillButton>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        open={!!confirmId}
        message="This record will be permanently deleted from your revenue history."
        onCancel={() => setConfirmId(null)}
        onConfirm={remove}
      />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Dedicated Performance & Bar Graph Tab                              */
/* ------------------------------------------------------------------ */

function PerformanceTab({ monthlyData, revenue }) {
  const sortedMonthsChronological = useMemo(() => Object.keys(monthlyData).sort(), [monthlyData]);
  const sortedMonthsNewestFirst = useMemo(() => Object.keys(monthlyData).sort().reverse(), [monthlyData]);

  const maxMonthlyRevenue = useMemo(() => {
    const values = Object.values(monthlyData).map((m) => m.revenue);
    return Math.max(...values, 100);
  }, [monthlyData]);

  const bestMonth = useMemo(() => {
    let best = null;
    let highest = 0;
    Object.entries(monthlyData).forEach(([k, v]) => {
      if (v.revenue > highest) {
        highest = v.revenue;
        best = k;
      }
    });
    return { month: best, revenue: highest };
  }, [monthlyData]);

  const avgMonthlyRevenue = useMemo(() => {
    const monthsCount = sortedMonthsChronological.length;
    if (monthsCount === 0) return 0;
    const total = Object.values(monthlyData).reduce((s, v) => s + v.revenue, 0);
    return total / monthsCount;
  }, [monthlyData, sortedMonthsChronological]);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-black text-[#5f0d7a]">Monthly Performance Tracker</h2>
          <p className="text-xs font-bold uppercase tracking-wider text-[#9f7ca6]">
            Visual Revenue Trends & Month-by-Month Analytics
          </p>
        </div>
      </div>

      {sortedMonthsChronological.length === 0 ? (
        <EmptyState
          icon={BarChart3}
          title="No Monthly Data Available"
          desc="Log appointments or payments in your revenue stream to generate visual bar graphs and growth trends."
        />
      ) : (
        <>
          {/* Key Metric Highlights */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            <div className="bg-white rounded-[32px] border-2 border-[#eedff5] p-5 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#5f0d7a] to-[#8c1ba8] text-[#ccaa79] flex items-center justify-center shrink-0 shadow-sm">
                <Award size={22} strokeWidth={2.5} />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-wider text-[#9f7ca6]">Best Month</p>
                <p className="text-xl font-black text-[#5f0d7a]">{currency(bestMonth.revenue)}</p>
                <p className="text-xs font-bold text-[#ccaa79]">{formatMonthYear(bestMonth.month)}</p>
              </div>
            </div>

            <div className="bg-white rounded-[32px] border-2 border-[#eedff5] p-5 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-[#faf4ea] text-[#936b28] flex items-center justify-center shrink-0">
                <TrendingUp size={22} strokeWidth={2.5} />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-wider text-[#9f7d4e]">Monthly Average</p>
                <p className="text-xl font-black text-[#855e1c]">{currency(avgMonthlyRevenue)}</p>
                <p className="text-xs font-bold text-[#a68656]">Across active months</p>
              </div>
            </div>

            <div className="bg-white rounded-[32px] border-2 border-[#eedff5] p-5 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-[#f4ecfb] text-[#5f0d7a] flex items-center justify-center shrink-0">
                <Calendar size={22} strokeWidth={2.5} />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-wider text-[#9f7ca6]">Tracked Months</p>
                <p className="text-xl font-black text-[#5f0d7a]">{sortedMonthsChronological.length}</p>
                <p className="text-xs font-bold text-[#a484af]">History on record</p>
              </div>
            </div>
          </div>

          {/* Bar Graph Card */}
          <div className="bg-white rounded-[32px] border-2 border-[#eedff5] p-6 sm:p-8 shadow-md mb-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-lg font-black text-[#5f0d7a]">Revenue Bar Chart</h3>
                <p className="text-xs font-bold text-[#9f7ca6]">Monthly earnings overview</p>
              </div>
              <div className="flex items-center gap-3 text-xs font-bold">
                <span className="inline-flex items-center gap-1.5 text-[#5f0d7a]">
                  <span className="w-3 h-3 rounded-md bg-[#5f0d7a]" /> Standard
                </span>
                <span className="inline-flex items-center gap-1.5 text-[#8f6929]">
                  <span className="w-3 h-3 rounded-md bg-[#ccaa79]" /> Peak Month
                </span>
              </div>
            </div>

            {/* Structured Bars (Less Rounded) */}
            <div className="flex items-end justify-between gap-3 sm:gap-6 h-64 pt-8 pb-3 border-b-2 border-[#f5ebf8] overflow-x-auto no-scrollbar">
              {sortedMonthsChronological.map((ym) => {
                const data = monthlyData[ym];
                const rev = data.revenue;
                const heightPct = Math.max(10, Math.round((rev / maxMonthlyRevenue) * 100));
                const isPeak = rev === bestMonth.revenue && rev > 0;

                return (
                  <div key={ym} className="flex-1 min-w-[58px] max-w-[80px] flex flex-col items-center h-full justify-end group">
                    <div className="opacity-80 group-hover:opacity-100 transition mb-2 text-center">
                      <span className="text-[11px] font-black text-[#5f0d7a] bg-[#faf3fd] px-1.5 py-0.5 rounded-md border border-[#ecd9f6] whitespace-nowrap">
                        ${rev >= 1000 ? `${(rev / 1000).toFixed(1)}k` : rev}
                      </span>
                    </div>

                    {/* Adjusted Rounding: rounded-xl outer track, rounded-lg inner fill */}
                    <div className="w-full bg-[#faf3fd] rounded-xl h-full flex items-end p-1 border border-[#f0dfef]">
                      <div
                        style={{ height: `${heightPct}%` }}
                        className={`w-full rounded-lg transition-all duration-700 ease-out shadow-xs flex items-center justify-center ${
                          isPeak
                            ? "bg-gradient-to-t from-[#ccaa79] to-[#ebd7b7] border-2 border-white"
                            : "bg-gradient-to-t from-[#5f0d7a] via-[#7b149d] to-[#9922c2]"
                        }`}
                      >
                        {isPeak && <Sparkles size={12} className="text-[#3b2708] mb-1 opacity-80" />}
                      </div>
                    </div>

                    <p className="text-xs font-black text-[#7a588b] mt-3 uppercase tracking-wider whitespace-nowrap">
                      {formatShortMonth(ym)}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Detailed Monthly Statement */}
          <div className="bg-white rounded-[32px] border-2 border-[#eedff5] p-6 shadow-md">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-black text-[#5f0d7a]">Detailed Monthly Statement</h3>
                <p className="text-xs font-bold text-[#9f7ca6]">Month-over-month growth calculations</p>
              </div>
              <Badge tone="purple">{sortedMonthsNewestFirst.length} Total Months</Badge>
            </div>

            <div className="divide-y-2 divide-[#faf4fd]">
              {sortedMonthsNewestFirst.map((ym, index) => {
                const current = monthlyData[ym]?.revenue || 0;
                const nextOlderMonthKey = sortedMonthsNewestFirst[index + 1];
                const older = nextOlderMonthKey ? monthlyData[nextOlderMonthKey]?.revenue || 0 : null;
                const diff = older !== null ? current - older : null;
                const pct = older && older > 0 ? ((diff / older) * 100).toFixed(0) : null;
                const isBest = current === bestMonth.revenue && current > 0;

                return (
                  <div key={ym} className="py-4 flex items-center justify-between hover:bg-[#faf4fd] px-3 rounded-2xl transition">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-2xl flex items-center justify-center font-black ${
                        isBest ? "bg-[#faf4ea] text-[#936b28] border border-[#ccaa79]" : "bg-[#f4ecfb] text-[#5f0d7a]"
                      }`}>
                        {isBest ? <Award size={18} /> : <Calendar size={18} />}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-extrabold text-[#280533] text-base">{formatMonthYear(ym)}</p>
                          {isBest && <Badge tone="gold">Top Month</Badge>}
                        </div>
                        <p className="text-xs text-[#9f7ca6] font-bold">{monthlyData[ym]?.count} transactions logged</p>
                      </div>
                    </div>

                    <div className="text-right">
                      <p className="font-black text-[#5f0d7a] text-lg leading-tight">{currency(current)}</p>
                      {diff !== null ? (
                        <p className={`text-xs font-black inline-flex items-center gap-1 ${diff >= 0 ? "text-emerald-600" : "text-rose-500"}`}>
                          {diff >= 0 ? <TrendingUp size={12} strokeWidth={3} /> : <TrendingDown size={12} strokeWidth={3} />}
                          {diff >= 0 ? `+$${diff.toFixed(0)}` : `-$${Math.abs(diff).toFixed(0)}`} {pct ? `(${pct}%)` : ""}
                        </p>
                      ) : (
                        <span className="text-[11px] text-[#ccaa79] font-bold">First recorded month</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Appointments Tab                                                   */
/* ------------------------------------------------------------------ */

const emptyApptForm = { client: "", service: SERVICES[0], date: "", time: "11:00", price: "", status: "Scheduled", notes: "" };

const statusStyle = {
  Scheduled: { tone: "purple", icon: Clock },
  Completed: { tone: "green", icon: CheckCircle2 },
  Canceled: { tone: "red", icon: XCircle },
};

function AppointmentsTab({ appointments, setAppointments, onPromptCompletion }) {
  const [view, setView] = useState("upcoming");
  const [query, setQuery] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyApptForm);
  const [confirmId, setConfirmId] = useState(null);

  const today = new Date().toISOString().slice(0, 10);

  const filtered = useMemo(() => {
    let list = appointments.filter((a) =>
      view === "upcoming" ? a.date >= today && a.status !== "Completed" : a.date < today || a.status === "Completed"
    );
    if (query.trim()) {
      const q = query.trim().toLowerCase();
      list = list.filter((a) => a.client.toLowerCase().includes(q));
    }
    return list.sort((a, b) =>
      view === "upcoming" ? new Date(a.date + "T" + a.time) - new Date(b.date + "T" + b.time) : new Date(b.date + "T" + b.time) - new Date(a.date + "T" + a.time)
    );
  }, [appointments, view, query, today]);

  const openAdd = () => {
    setEditing(null);
    setForm({ ...emptyApptForm, date: today });
    setModalOpen(true);
  };

  const openEdit = (a) => {
    setEditing(a.id);
    setForm({ client: a.client, service: a.service, date: a.date, time: a.time, price: a.price, status: a.status, notes: a.notes || "" });
    setModalOpen(true);
  };

  const save = (e) => {
    e.preventDefault();
    if (!form.client || !form.date || !form.time || !Number(form.price)) return;
    if (editing) {
      setAppointments((prev) => prev.map((a) => (a.id === editing ? { ...a, ...form, price: Number(form.price) } : a)));
    } else {
      setAppointments((prev) => [{ id: uid(), ...form, price: Number(form.price) }, ...prev]);
    }
    setModalOpen(false);
  };

  const remove = () => {
    setAppointments((prev) => prev.filter((a) => a.id !== confirmId));
    setConfirmId(null);
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
        <div>
          <h2 className="text-2xl font-black text-[#5f0d7a]">Appointment Book</h2>
          <p className="text-xs font-bold uppercase tracking-wider text-[#9f7ca6]">
            {filtered.length} {view === "upcoming" ? "Pending / Scheduled" : "Past / Completed"} Client{filtered.length === 1 ? "" : "s"}
          </p>
        </div>
        <PillButton onClick={openAdd} variant="primary">
          <Plus size={16} strokeWidth={3} /> Book Appointment
        </PillButton>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="inline-flex bg-white border-2 border-[#eedff5] rounded-full p-1 shadow-xs w-fit">
          {["upcoming", "past"].map((v) => (
            <button
              key={v}
              onClick={() => setView(v)}
              className={`px-5 py-2 rounded-full text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
                view === v ? "bg-[#5f0d7a] text-white shadow-sm" : "text-[#7b5c87] hover:text-[#5f0d7a]"
              }`}
            >
              {v}
            </button>
          ))}
        </div>
        <div className="relative flex-1 max-w-sm">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#ccaa79]" />
          <input
            className="w-full rounded-full border-2 border-[#eedff5] bg-white pl-11 pr-4 py-2.5 text-sm font-bold text-[#2a0836] outline-none focus:border-[#5f0d7a] focus:ring-2 focus:ring-[#ccaa79]/30 transition shadow-xs"
            placeholder="Search by client name..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={CalendarClock}
          title={view === "upcoming" ? "No upcoming bookings" : "No past bookings"}
          desc={query ? "No client matches your search." : "Add a client appointment to keep your schedule organized."}
        />
      ) : (
        <div className="grid sm:grid-cols-2 gap-4">
          {filtered.map((a) => {
            const st = statusStyle[a.status] || statusStyle.Scheduled;
            const StIcon = st.icon;
            return (
              <div
                key={a.id}
                className="bg-white rounded-[32px] border-2 border-[#eedff5] p-6 shadow-sm hover:border-[#ccaa79] transition flex flex-col justify-between gap-4 relative overflow-hidden"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#5f0d7a] to-[#7f18a2] text-[#ccaa79] flex items-center justify-center font-black text-base shrink-0 shadow-sm">
                      {a.client.split(" ").map((p) => p[0]).slice(0, 2).join("")}
                    </div>
                    <div className="min-w-0">
                      <p className="font-black text-[#280533] text-lg leading-tight truncate">{a.client}</p>
                      <p className="text-xs text-[#ccaa79] font-black uppercase tracking-wide truncate">{a.service}</p>
                    </div>
                  </div>
                  <Badge tone={st.tone}>
                    <span className="inline-flex items-center gap-1"><StIcon size={12} strokeWidth={3} />{a.status}</span>
                  </Badge>
                </div>

                <div className="flex items-center gap-4 text-xs font-bold text-[#5f0d7a] bg-[#faf3fd] border border-[#f1e2f7] rounded-2xl px-4 py-3">
                  <span className="flex items-center gap-1.5"><Calendar size={15} className="text-[#ccaa79]" />{shortDate(a.date)}</span>
                  <span className="flex items-center gap-1.5"><Clock size={15} className="text-[#ccaa79]" />{to12h(a.time)}</span>
                </div>

                {a.notes && (
                  <p className="text-xs text-[#7e5d8a] font-semibold flex items-start gap-1.5 bg-[#fdfaf5] p-2.5 rounded-xl border border-[#faecd8]">
                    <StickyNote size={14} className="text-[#ccaa79] mt-0.5 shrink-0" /> {a.notes}
                  </p>
                )}

                <div className="flex items-center justify-between pt-2 border-t border-[#f4eaf7]">
                  <div>
                    <p className="text-2xl font-black text-[#5f0d7a]">{currency(a.price)}</p>
                    {a.tip ? <p className="text-[11px] font-bold text-emerald-600">+${a.tip} tip</p> : null}
                  </div>
                  <div className="flex items-center gap-2">
                    {a.status !== "Completed" && (
                      <button
                        onClick={() => onPromptCompletion(a)}
                        className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 px-3 py-1.5 rounded-full text-xs font-black transition active:scale-95 shadow-2xs cursor-pointer"
                      >
                        <CheckCircle2 size={14} strokeWidth={2.8} /> Complete & Pay
                      </button>
                    )}
                    <IconCircleButton icon={Pencil} variant="purple" onClick={() => openEdit(a)} title="Edit" />
                    <IconCircleButton icon={Trash2} variant="danger" onClick={() => setConfirmId(a.id)} title="Delete" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? "Edit Appointment" : "New Booking"} icon={CalendarCheck2}>
        <form onSubmit={save}>
          <Field label="Client Full Name">
            <input required className={inputCls} value={form.client} onChange={(e) => setForm({ ...form, client: e.target.value })} placeholder="e.g. Maya Lynn" />
          </Field>
          <Field label="Selected Service">
            <select className={inputCls} value={form.service} onChange={(e) => setForm({ ...form, service: e.target.value })}>
              {SERVICES.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Date">
              <input type="date" required className={inputCls} value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
            </Field>
            <Field label="Time">
              <input type="time" required className={inputCls} value={form.time} onChange={(e) => setForm({ ...form, time: e.target.value })} />
            </Field>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Base Price ($)">
              <input type="number" min="0" step="0.01" required className={inputCls} value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
            </Field>
            <Field label="Status">
              <select className={inputCls} value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                {Object.keys(statusStyle).map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </Field>
          </div>
          <Field label="Client Reminders / Notes">
            <textarea rows={2} className={inputCls} value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} placeholder="Parts preference, hair length, scalp needs..." />
          </Field>
          <div className="flex gap-3 mt-4">
            <PillButton type="button" variant="subtle" className="flex-1" onClick={() => setModalOpen(false)}>Cancel</PillButton>
            <PillButton type="submit" variant="primary" className="flex-1">{editing ? "Update Appointment" : "Save Booking"}</PillButton>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        open={!!confirmId}
        message="This appointment will be permanently deleted."
        onCancel={() => setConfirmId(null)}
        onConfirm={remove}
      />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Complete Appointment & Add Tip Modal                               */
/* ------------------------------------------------------------------ */

function CompleteAppointmentModal({ appt, onClose, onConfirm }) {
  const [tip, setTip] = useState("");
  const [paymentMethod, setPaymentMethod] = useState(PAYMENT_METHODS[0]);
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));

  const basePrice = Number(appt.price) || 0;
  const tipAmount = Number(tip) || 0;
  const totalAmount = basePrice + tipAmount;

  const handleSubmit = (e) => {
    e.preventDefault();
    onConfirm({
      apptId: appt.id,
      tip: tipAmount,
      paymentMethod,
      date,
    });
  };

  return (
    <Modal open={true} onClose={onClose} title="Complete & Collect Payment" icon={CheckCircle2}>
      <form onSubmit={handleSubmit}>
        <div className="bg-[#faf3fd] p-4 rounded-2xl border border-[#f1e2f7] mb-4">
          <p className="font-extrabold text-[#5f0d7a] text-lg">{appt.client}</p>
          <p className="text-xs font-black text-[#ccaa79] uppercase">{appt.service}</p>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-2">
          <div className="bg-white border-2 border-[#eedff5] p-3 rounded-2xl text-center">
            <p className="text-[10px] font-black uppercase text-[#9f7ca6]">Base Service</p>
            <p className="text-xl font-black text-[#5f0d7a]">{currency(basePrice)}</p>
          </div>
          <div className="bg-[#fbf7ee] border-2 border-[#f6e5c8] p-3 rounded-2xl text-center">
            <p className="text-[10px] font-black uppercase text-[#9f7d4e]">Total + Tip</p>
            <p className="text-xl font-black text-[#855e1c]">{currency(totalAmount)}</p>
          </div>
        </div>

        <Field label="Add Tip ($)">
          <input
            type="number"
            min="0"
            step="0.01"
            className={inputCls}
            placeholder="0.00"
            value={tip}
            onChange={(e) => setTip(e.target.value)}
          />
        </Field>

        <div className="grid grid-cols-2 gap-3">
          <Field label="Payment Method">
            <select className={inputCls} value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
              {PAYMENT_METHODS.map((m) => <option key={m} value={m}>{m}</option>)}
            </select>
          </Field>
          <Field label="Date Received">
            <input type="date" required className={inputCls} value={date} onChange={(e) => setDate(e.target.value)} />
          </Field>
        </div>

        <div className="flex gap-3 mt-4">
          <PillButton type="button" variant="subtle" className="flex-1" onClick={onClose}>Cancel</PillButton>
          <PillButton type="submit" variant="primary" className="flex-1">
            Log {currency(totalAmount)}
          </PillButton>
        </div>
      </form>
    </Modal>
  );
}

/* ------------------------------------------------------------------ */
/* Inventory & Supply Expenses Tab                                    */
/* ------------------------------------------------------------------ */

const emptySupplyForm = { name: "", category: INVENTORY_CATEGORIES[0], stock: "", minStock: "2", unitCost: "", totalSpent: "" };

function InventoryTab({ inventory, setInventory }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptySupplyForm);
  const [confirmId, setConfirmId] = useState(null);
  const [restockItem, setRestockItem] = useState(null);
  const [restockUnits, setRestockUnits] = useState("1");

  const sorted = useMemo(() => [...inventory].sort((a, b) => a.name.localeCompare(b.name)), [inventory]);
  const needsRestockList = inventory.filter((p) => Number(p.stock) <= Number(p.minStock || 2));
  const totalSpentAllSupplies = useMemo(() => inventory.reduce((s, p) => s + Number(p.totalSpent || 0), 0), [inventory]);

  const openAdd = () => {
    setEditing(null);
    setForm(emptySupplyForm);
    setModalOpen(true);
  };

  const openEdit = (p) => {
    setEditing(p.id);
    setForm({
      name: p.name,
      category: p.category,
      stock: p.stock,
      minStock: p.minStock || "2",
      unitCost: p.unitCost || "",
      totalSpent: p.totalSpent || "",
    });
    setModalOpen(true);
  };

  const save = (e) => {
    e.preventDefault();
    if (!form.name || form.stock === "") return;

    const unitC = Number(form.unitCost) || 0;
    const stockQty = Number(form.stock) || 0;
    const spentTotal = form.totalSpent !== "" ? Number(form.totalSpent) : unitC * stockQty;

    const payload = {
      name: form.name,
      category: form.category,
      stock: stockQty,
      minStock: Number(form.minStock) || 2,
      unitCost: unitC,
      totalSpent: spentTotal,
    };

    if (editing) {
      setInventory((prev) => prev.map((p) => (p.id === editing ? { ...p, ...payload } : p)));
    } else {
      setInventory((prev) => [{ id: uid(), ...payload }, ...prev]);
    }
    setModalOpen(false);
  };

  const remove = () => {
    setInventory((prev) => prev.filter((p) => p.id !== confirmId));
    setConfirmId(null);
  };

  const bump = (id, delta) => {
    setInventory((prev) => prev.map((p) => (p.id === id ? { ...p, stock: Math.max(0, Number(p.stock) + delta) } : p)));
  };

  const handleRestockSubmit = (e) => {
    e.preventDefault();
    const addedUnits = Number(restockUnits) || 0;
    if (!restockItem || addedUnits <= 0) return;

    const costToAdd = addedUnits * (Number(restockItem.unitCost) || 0);

    setInventory((prev) =>
      prev.map((p) =>
        p.id === restockItem.id
          ? {
              ...p,
              stock: Number(p.stock) + addedUnits,
              totalSpent: Number(p.totalSpent || 0) + costToAdd,
            }
          : p
      )
    );
    setRestockItem(null);
    setRestockUnits("1");
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-black text-[#5f0d7a]">Supplies & Restock Tracker</h2>
          <p className="text-xs font-bold uppercase tracking-wider text-[#9f7ca6]">
            Total Supply Costs: <span className="text-[#5f0d7a]">{currency(totalSpentAllSupplies)}</span>
            {needsRestockList.length > 0 && (
              <span className="text-amber-600 font-black"> · {needsRestockList.length} items need restock</span>
            )}
          </p>
        </div>
        <PillButton onClick={openAdd} variant="primary">
          <Plus size={16} strokeWidth={3} /> Add New Supply Item
        </PillButton>
      </div>

      {sorted.length === 0 ? (
        <EmptyState icon={ShoppingCart} title="No supplies entered" desc="Keep track of hair products, tools, and what you need to rebuy." />
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {sorted.map((p) => {
            const isLow = Number(p.stock) <= Number(p.minStock || 2);
            return (
              <div
                key={p.id}
                className="bg-white rounded-[32px] border-2 border-[#eedff5] p-5 shadow-sm hover:border-[#ccaa79] transition flex flex-col justify-between gap-4 relative overflow-hidden"
              >
                {isLow && (
                  <div className="absolute top-3 right-3">
                    <span className="flex items-center gap-1 bg-amber-100 text-amber-900 border border-amber-300 text-[10px] font-black uppercase px-2.5 py-1 rounded-full shadow-2xs">
                      <AlertTriangle size={11} strokeWidth={3} /> Needs Restock
                    </span>
                  </div>
                )}

                <div>
                  <Badge tone="gold">{p.category}</Badge>
                  <p className="font-black text-[#280533] text-lg mt-2 truncate">{p.name}</p>
                </div>

                <div className="grid grid-cols-2 gap-2 text-center">
                  <div className="bg-[#faf3fd] border border-[#f1e2f7] rounded-2xl py-2.5">
                    <p className="text-[10px] font-black uppercase tracking-wider text-[#9572a1]">Unit Cost</p>
                    <p className="font-black text-[#5f0d7a] text-sm">{currency(p.unitCost)}</p>
                  </div>
                  <div className="bg-[#fbf7ee] border border-[#f6e5c8] rounded-2xl py-2.5">
                    <p className="text-[10px] font-black uppercase tracking-wider text-[#9f7d4e]">Total Spent</p>
                    <p className="font-black text-[#855e1c] text-sm">{currency(p.totalSpent)}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between bg-gradient-to-r from-[#5f0d7a] to-[#7f18a2] rounded-2xl p-2 shadow-xs">
                  <button
                    onClick={() => bump(p.id, -1)}
                    className="w-9 h-9 rounded-xl bg-white/20 text-white flex items-center justify-center hover:bg-white/30 active:scale-90 transition cursor-pointer"
                  >
                    <ChevronDown size={18} strokeWidth={3} />
                  </button>
                  <div className="text-center">
                    <p className={`font-black text-xl leading-none ${isLow ? "text-[#fadb9e]" : "text-white"}`}>{p.stock}</p>
                    <p className="text-[9px] font-black text-white/70 uppercase tracking-widest mt-0.5">
                      {isLow ? `Reorder (≤${p.minStock})` : "In stock"}
                    </p>
                  </div>
                  <button
                    onClick={() => bump(p.id, 1)}
                    className="w-9 h-9 rounded-xl bg-white/20 text-white flex items-center justify-center hover:bg-white/30 active:scale-90 transition cursor-pointer"
                  >
                    <ChevronUp size={18} strokeWidth={3} />
                  </button>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-[#f4eaf7]">
                  <button
                    onClick={() => { setRestockItem(p); setRestockUnits("1"); }}
                    className="inline-flex items-center gap-1 text-xs font-black text-[#ccaa79] hover:text-[#b28c55] cursor-pointer"
                  >
                    <RefreshCw size={13} strokeWidth={2.5} /> Log Restock
                  </button>
                  <div className="flex items-center gap-2">
                    <IconCircleButton icon={Pencil} variant="purple" onClick={() => openEdit(p)} title="Edit Item" />
                    <IconCircleButton icon={Trash2} variant="danger" onClick={() => setConfirmId(p.id)} title="Delete Item" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? "Edit Supply Item" : "Add Supply / Expense"} icon={Package}>
        <form onSubmit={save}>
          <Field label="Supply Name">
            <input required className={inputCls} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. Edge Control, Pre-stretched Hair" />
          </Field>
          <Field label="Category">
            <select className={inputCls} value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
              {INVENTORY_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Current Units On Hand">
              <input type="number" min="0" required className={inputCls} value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} />
            </Field>
            <Field label="Restock Alert (When ≤)">
              <input type="number" min="0" required className={inputCls} value={form.minStock} onChange={(e) => setForm({ ...form, minStock: e.target.value })} />
            </Field>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Cost per Unit ($)">
              <input type="number" min="0" step="0.01" className={inputCls} value={form.unitCost} onChange={(e) => setForm({ ...form, unitCost: e.target.value })} placeholder="e.g. 5.50" />
            </Field>
            <Field label="Total Spent So Far ($)">
              <input type="number" min="0" step="0.01" className={inputCls} value={form.totalSpent} onChange={(e) => setForm({ ...form, totalSpent: e.target.value })} placeholder="Optional override" />
            </Field>
          </div>
          <div className="flex gap-3 mt-4">
            <PillButton type="button" variant="subtle" className="flex-1" onClick={() => setModalOpen(false)}>Cancel</PillButton>
            <PillButton type="submit" variant="primary" className="flex-1">{editing ? "Update Supply" : "Save Item"}</PillButton>
          </div>
        </form>
      </Modal>

      {restockItem && (
        <Modal open={true} onClose={() => setRestockItem(null)} title={`Restock ${restockItem.name}`} icon={RefreshCw}>
          <form onSubmit={handleRestockSubmit}>
            <p className="text-xs text-[#7e5d8a] font-bold mb-4">
              Enter how many units you just bought. If you have a unit cost recorded ({currency(restockItem.unitCost)}), it will automatically add to your total supply expenses.
            </p>
            <Field label="Units Purchased">
              <input
                type="number"
                min="1"
                required
                className={inputCls}
                value={restockUnits}
                onChange={(e) => setRestockUnits(e.target.value)}
              />
            </Field>
            <div className="flex gap-3 mt-4">
              <PillButton type="button" variant="subtle" className="flex-1" onClick={() => setRestockItem(null)}>Cancel</PillButton>
              <PillButton type="submit" variant="gold" className="flex-1">Add to Stock</PillButton>
            </div>
          </form>
        </Modal>
      )}

      <ConfirmDialog
        open={!!confirmId}
        message="This item will be permanently removed from your supply tracker."
        onCancel={() => setConfirmId(null)}
        onConfirm={remove}
      />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Empty State Component                                              */
/* ------------------------------------------------------------------ */

function EmptyState({ icon: Icon, title, desc }) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-16 px-6">
      <div className="w-16 h-16 rounded-3xl bg-[#f4ecfb] text-[#5f0d7a] border-2 border-[#ccaa79]/40 flex items-center justify-center mb-4 shadow-sm">
        <Icon size={28} strokeWidth={2.4} />
      </div>
      <p className="font-black text-[#5f0d7a] text-lg mb-1">{title}</p>
      <p className="text-xs text-[#8c6799] font-bold max-w-xs">{desc}</p>
    </div>
  );
}