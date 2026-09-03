import React, { useState, useEffect, useMemo } from "react";
import {
  Plus, Pencil, Trash2, X, DollarSign, Calendar, Package, TrendingUp,
  Search, ChevronUp, ChevronDown, CheckCircle2, Clock, XCircle,
  AlertTriangle, Sparkles, Wallet, CalendarClock, CalendarCheck2,
  StickyNote, Crown, ArrowUpRight
} from "lucide-react";

/* ------------------------------------------------------------------ */
/* Utilities                                                          */
/* ------------------------------------------------------------------ */

const uid = () => Math.random().toString(36).slice(2, 10) + Date.now().toString(36);

const currency = (n) =>
  (Number(n) || 0).toLocaleString("en-US", { style: "currency", currency: "USD" });

const shortDate = (isoDate) => {
  if (!isoDate) return "";
  const d = new Date(isoDate + "T00:00:00");
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
};

const to12h = (t) => {
  if (!t) return "";
  const [h, m] = t.split(":").map(Number);
  const period = h >= 12 ? "PM" : "AM";
  const hour = h % 12 === 0 ? 12 : h % 12;
  return `${hour}:${String(m).padStart(2, "0")} ${period}`;
};

const SERVICES = [
  "Retwists",
  "Full Head Cornrows",
  "Twists / Braids",
  "Wash & Style",
  "Silk Press",
  "Loc Maintenance",
  "Kids Style",
  "Consultation",
];

const PAYMENT_METHODS = ["Cash", "Card", "Zelle", "CashApp", "Venmo"];
const REVENUE_SOURCES = ["Client Service", "Product Sale", "Tip", "Other"];
const INVENTORY_CATEGORIES = ["Styling Product", "Tools", "Hair Care", "Accessories"];

/* ------------------------------------------------------------------ */
/* Seed data                                                          */
/* ------------------------------------------------------------------ */

const seedRevenue = [
  { id: uid(), date: "2026-08-29", source: "Amara J.", service: "Full Head Cornrows", amount: 165, method: "Zelle" },
  { id: uid(), date: "2026-08-28", source: "Destiny R.", service: "Retwists", amount: 95, method: "Cash" },
  { id: uid(), date: "2026-08-27", source: "Product Sale", service: "Edge Control (2)", amount: 36, method: "Card" },
  { id: uid(), date: "2026-08-26", source: "Keisha M.", service: "Silk Press", amount: 85, method: "CashApp" },
  { id: uid(), date: "2026-08-25", source: "Tip", service: "Jasmine T. — Braids", amount: 20, method: "Cash" },
  { id: uid(), date: "2026-08-24", source: "Nia W.", service: "Twists / Braids", amount: 180, method: "Zelle" },
  { id: uid(), date: "2026-08-22", source: "Product Sale", service: "Conditioning Oil (3)", amount: 54, method: "Card" },
  { id: uid(), date: "2026-08-21", source: "Simone P.", service: "Loc Maintenance", amount: 110, method: "Venmo" },
  { id: uid(), date: "2026-08-19", source: "Tasha B.", service: "Wash & Style", amount: 65, method: "Cash" },
  { id: uid(), date: "2026-08-17", source: "Renee C.", service: "Full Head Cornrows", amount: 175, method: "Zelle" },
];

const seedAppointments = [
  { id: uid(), client: "Amara Johnson", service: "Retwists", date: "2026-09-05", time: "10:00", price: 95, status: "Scheduled", notes: "Prefers medium coils." },
  { id: uid(), client: "Brianna Cole", service: "Full Head Cornrows", date: "2026-09-06", time: "13:30", price: 165, status: "Scheduled", notes: "First-time client." },
  { id: uid(), client: "Jasmine Turner", service: "Twists / Braids", date: "2026-09-08", time: "09:00", price: 180, status: "Scheduled", notes: "Wants knotless." },
  { id: uid(), client: "Monique Freeman", service: "Silk Press", date: "2026-09-10", time: "11:00", price: 85, status: "Scheduled", notes: "" },
  { id: uid(), client: "Destiny Reed", service: "Wash & Style", date: "2026-08-28", time: "14:00", price: 65, status: "Completed", notes: "Loved the finish." },
  { id: uid(), client: "Keisha Moore", service: "Silk Press", date: "2026-08-26", time: "12:00", price: 85, status: "Completed", notes: "" },
  { id: uid(), client: "Nia Williams", service: "Twists / Braids", date: "2026-08-24", time: "10:30", price: 180, status: "Completed", notes: "Added length." },
  { id: uid(), client: "Tasha Brooks", service: "Wash & Style", date: "2026-08-19", time: "15:00", price: 65, status: "Completed", notes: "" },
  { id: uid(), client: "Erica Sims", service: "Retwists", date: "2026-08-15", time: "09:30", price: 95, status: "Canceled", notes: "Rescheduling next month." },
  { id: uid(), client: "Renee Carter", service: "Full Head Cornrows", date: "2026-08-17", time: "11:00", price: 175, status: "Completed", notes: "" },
];

const seedInventory = [
  { id: uid(), name: "Edge Control", category: "Styling Product", stock: 14, unitCost: 4.5, sellingPrice: 18 },
  { id: uid(), name: "Foaming Mousse", category: "Styling Product", stock: 9, unitCost: 5.25, sellingPrice: 20 },
  { id: uid(), name: "Conditioning Oil", category: "Hair Care", stock: 3, unitCost: 6.0, sellingPrice: 22 },
  { id: uid(), name: "Parting Combs", category: "Tools", stock: 22, unitCost: 1.1, sellingPrice: 6 },
  { id: uid(), name: "Satin Bonnets", category: "Accessories", stock: 4, unitCost: 3.0, sellingPrice: 15 },
  { id: uid(), name: "Braiding Gel", category: "Styling Product", stock: 11, unitCost: 3.75, sellingPrice: 16 },
  { id: uid(), name: "Scalp Serum", category: "Hair Care", stock: 2, unitCost: 7.5, sellingPrice: 28 },
  { id: uid(), name: "Butterfly Clips", category: "Accessories", stock: 30, unitCost: 0.6, sellingPrice: 4 },
];

/* ------------------------------------------------------------------ */
/* 4-Point Cross Star / Sparkle Component                             */
/* ------------------------------------------------------------------ */

const CrossStar = ({ size = 24, className = "", style = {} }) => (
  <svg
    viewBox="0 0 24 24"
    width={size}
    height={size}
    className={className}
    style={style}
    fill="currentColor"
  >
    <path d="M12 0C12 6.627 6.627 12 0 12C6.627 12 12 17.373 12 24C12 17.373 17.373 12 24 12C17.373 12 12 6.627 12 0Z" />
  </svg>
);

function BackgroundStars() {
  const stars = [
    { top: "6%", left: "4%", size: 22, color: "text-[#ccaa79]", delay: "0s", duration: "4s" },
    { top: "12%", right: "8%", size: 30, color: "text-[#5f0d7a]/30", delay: "1s", duration: "5s" },
    { top: "28%", left: "88%", size: 18, color: "text-[#ccaa79]/80", delay: "2s", duration: "3.5s" },
    { top: "45%", left: "3%", size: 26, color: "text-[#5f0d7a]/20", delay: "1.5s", duration: "6s" },
    { top: "60%", right: "4%", size: 24, color: "text-[#ccaa79]", delay: "0.5s", duration: "4.5s" },
    { top: "78%", left: "6%", size: 20, color: "text-[#ccaa79]/60", delay: "2.5s", duration: "5s" },
    { top: "85%", right: "12%", size: 28, color: "text-[#5f0d7a]/25", delay: "1.2s", duration: "4.2s" },
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
/* Storage Hook & Buttons                                             */
/* ------------------------------------------------------------------ */

function useLocalState(key, seed) {
  const [state, setState] = useState(() => {
    try {
      const raw = window.localStorage?.getItem(key);
      if (raw) return JSON.parse(raw);
    } catch (e) {}
    return seed;
  });
  useEffect(() => {
    try {
      window.localStorage?.setItem(key, JSON.stringify(state));
    } catch (e) {}
  }, [key, state]);
  return [state, setState];
}

const PillButton = ({ children, onClick, variant = "primary", className = "", type = "button", disabled }) => {
  const base = "inline-flex items-center justify-center gap-2 rounded-full font-bold transition-all active:scale-95 disabled:opacity-40 shadow-sm";
  const variants = {
    primary: "bg-gradient-to-r from-[#5f0d7a] to-[#7b149d] text-white hover:from-[#4d0963] hover:to-[#681085] shadow-[#5f0d7a]/25",
    gold: "bg-gradient-to-r from-[#ccaa79] to-[#dfc399] text-[#341e05] hover:brightness-105 shadow-[#ccaa79]/30",
    outlineGold: "bg-white text-[#5f0d7a] border-2 border-[#ccaa79] hover:bg-[#faf4ec]",
    danger: "bg-rose-50 text-rose-600 border border-rose-200 hover:bg-rose-100",
    subtle: "bg-[#f5eef9] text-[#5f0d7a] hover:bg-[#ecdef3]",
  };
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${base} ${variants[variant]} px-5 py-2.5 text-sm ${className}`}
    >
      {children}
    </button>
  );
};

const IconCircleButton = ({ icon: Icon, onClick, variant = "purple", size = "sm", title }) => {
  const sizes = { sm: "w-8 h-8", md: "w-10 h-10" };
  const variants = {
    purple: "bg-[#f4ecfb] text-[#5f0d7a] hover:bg-[#ebdcf6] hover:text-[#4d0963]",
    gold: "bg-[#fbf4ea] text-[#936b28] hover:bg-[#f5e5cf]",
    danger: "bg-rose-50 text-rose-500 hover:bg-rose-100",
  };
  return (
    <button
      type="button"
      title={title}
      onClick={onClick}
      className={`${sizes[size]} ${variants[variant]} rounded-full flex items-center justify-center transition active:scale-90 shrink-0 shadow-sm`}
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
  };
  return (
    <span className={`${tones[tone]} px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap shadow-2xs`}>
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
        <div className="sticky top-0 bg-white/95 backdrop-blur px-6 pt-6 pb-4 flex items-center justify-between border-b border-[#f3e9f8] rounded-t-[32px]">
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
            className="w-9 h-9 rounded-full bg-[#f4ecfb] text-[#5f0d7a] flex items-center justify-center hover:bg-[#ebdcf6] transition active:scale-90"
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
        <p className="font-extrabold text-[#260531] text-lg mb-1">Delete item?</p>
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
/* Main Application                                                   */
/* ------------------------------------------------------------------ */

export default function App() {
  const [tab, setTab] = useState("overview");

  const [revenue, setRevenue] = useLocalState("nn_revenue", seedRevenue);
  const [appointments, setAppointments] = useLocalState("nn_appointments", seedAppointments);
  const [inventory, setInventory] = useLocalState("nn_inventory", seedInventory);

  /* Calculations */
  const totalRevenue = useMemo(() => revenue.reduce((s, r) => s + Number(r.amount || 0), 0), [revenue]);
  const inventoryCostValue = useMemo(
    () => inventory.reduce((s, p) => s + Number(p.unitCost || 0) * Number(p.stock || 0), 0),
    [inventory]
  );
  const activeInventoryValue = useMemo(
    () => inventory.reduce((s, p) => s + Number(p.sellingPrice || 0) * Number(p.stock || 0), 0),
    [inventory]
  );
  const netProfit = totalRevenue - inventoryCostValue;
  const totalAppointments = appointments.length;

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

      {/* Decorative Cross Stars & Ambient Backdrops */}
      <BackgroundStars />
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#5f0d7a]/10 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-1/3 left-10 w-96 h-96 bg-[#ccaa79]/20 rounded-full blur-3xl pointer-events-none -z-10" />

      <Header tab={tab} setTab={setTab} />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 pb-24 pt-6 relative z-10">
        {tab === "overview" && (
          <OverviewTab
            totalRevenue={totalRevenue}
            netProfit={netProfit}
            totalAppointments={totalAppointments}
            activeInventoryValue={activeInventoryValue}
            revenue={revenue}
            setRevenue={setRevenue}
          />
        )}
        {tab === "appointments" && (
          <AppointmentsTab appointments={appointments} setAppointments={setAppointments} />
        )}
        {tab === "inventory" && (
          <InventoryTab inventory={inventory} setInventory={setInventory} />
        )}
      </main>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Header with Rounded Bank-Style Logo                                */
/* ------------------------------------------------------------------ */

function Header({ tab, setTab }) {
  const items = [
    { id: "overview", label: "Overview", icon: Wallet },
    { id: "appointments", label: "Appointments", icon: CalendarClock },
    { id: "inventory", label: "Inventory", icon: Package },
  ];

  return (
    <header className="sticky top-0 z-30 bg-[#faf5fd]/90 backdrop-blur-lg border-b-2 border-[#ccaa79]/30 shadow-xs">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-5 pb-4 flex items-center justify-between gap-4">
        {/* Rounded Bank-Style Brand Logo */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-3xl bg-gradient-to-tr from-[#5f0d7a] via-[#751194] to-[#ccaa79] flex items-center justify-center shrink-0 shadow-lg shadow-[#5f0d7a]/30 relative group">
            <CrossStar size={24} className="text-white drop-shadow-sm transition-transform group-hover:rotate-45" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-[#5f0d7a] uppercase leading-none">
                Naturally <span className="text-[#ccaa79]">Nyla</span>
              </h1>
            </div>
            <div className="flex items-center gap-2 mt-1">
              <span className="inline-block w-2 h-2 rounded-full bg-[#ccaa79]" />
              <p className="text-[11px] font-black uppercase tracking-widest text-[#7a488e]">
                Salon & Beauty Portal
              </p>
            </div>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-2 bg-[#f2e2fa] border border-[#ccaa79]/50 rounded-full px-3.5 py-1.5">
          <Crown size={15} className="text-[#ccaa79]" strokeWidth={2.5} />
          <span className="text-xs font-bold text-[#5f0d7a]">Pro Business Suite</span>
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
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-extrabold whitespace-nowrap transition-all active:scale-95 ${
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
/* Large Fintech Metric Bubbles                                       */
/* ------------------------------------------------------------------ */

function MetricBubble({ label, value, icon: Icon, tone = "purple", sub }) {
  const tones = {
    purple: {
      bg: "bg-gradient-to-br from-[#5f0d7a] via-[#6f118e] to-[#450959] text-white shadow-[#5f0d7a]/30 border-2 border-[#ccaa79]/40",
      chip: "bg-[#ccaa79] text-[#2c1704]",
      sub: "text-[#f3e7fb]",
      valueText: "text-white",
      sparkleColor: "text-[#ccaa79]/60",
    },
    gold: {
      bg: "bg-gradient-to-br from-[#ccaa79] via-[#d6b789] to-[#b7915b] text-[#2e1903] shadow-[#ccaa79]/35 border-2 border-[#5f0d7a]/25",
      chip: "bg-[#5f0d7a] text-white",
      sub: "text-[#4a2e0a]",
      valueText: "text-[#2e1903]",
      sparkleColor: "text-[#5f0d7a]/40",
    },
    whitePurple: {
      bg: "bg-white border-2 border-[#e8d5f3] shadow-[#5f0d7a]/10",
      chip: "bg-[#5f0d7a] text-white",
      sub: "text-[#7a588b]",
      valueText: "text-[#5f0d7a]",
      sparkleColor: "text-[#ccaa79]",
    },
    whiteGold: {
      bg: "bg-white border-2 border-[#eedcb7] shadow-[#ccaa79]/15",
      chip: "bg-[#fbf2e3] text-[#936b28] border border-[#ccaa79]",
      sub: "text-[#8e7454]",
      valueText: "text-[#886221]",
      sparkleColor: "text-[#5f0d7a]/40",
    },
  };
  const t = tones[tone];

  return (
    <div className={`${t.bg} rounded-[32px] p-6 shadow-md relative overflow-hidden flex flex-col justify-between min-h-[160px]`}>
      <CrossStar size={48} className={`absolute -right-3 -top-3 ${t.sparkleColor} opacity-70`} />
      <div className="flex items-center justify-between">
        <div className={`w-11 h-11 rounded-2xl ${t.chip} flex items-center justify-center shadow-xs`}>
          <Icon size={20} strokeWidth={2.5} />
        </div>
        <ArrowUpRight size={18} className="opacity-40" />
      </div>
      <div>
        <p className="text-xs font-black uppercase tracking-wider opacity-85 mb-1">{label}</p>
        <p className={`text-3xl sm:text-4xl font-black ${t.valueText} tracking-tight`}>{value}</p>
        {sub && <p className={`text-xs font-bold ${t.sub} mt-1.5`}>{sub}</p>}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Overview Tab                                                       */
/* ------------------------------------------------------------------ */

const emptyRevenueForm = { date: "", source: "", service: "", amount: "", method: PAYMENT_METHODS[0] };

function OverviewTab({ totalRevenue, netProfit, totalAppointments, activeInventoryValue, revenue, setRevenue }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyRevenueForm);
  const [confirmId, setConfirmId] = useState(null);

  const sorted = useMemo(
    () => [...revenue].sort((a, b) => new Date(b.date) - new Date(a.date)),
    [revenue]
  );

  const openAdd = () => {
    setEditing(null);
    setForm({ ...emptyRevenueForm, date: new Date().toISOString().slice(0, 10), source: "", service: "" });
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
      {/* Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <MetricBubble label="Total Gross" value={currency(totalRevenue)} icon={DollarSign} tone="purple" sub={`${revenue.length} transactions`} />
        <MetricBubble label="Net Profit" value={currency(netProfit)} icon={TrendingUp} tone="gold" sub="Total after supplies" />
        <MetricBubble label="Appointments" value={totalAppointments} icon={Calendar} tone="whitePurple" sub="All recorded visits" />
        <MetricBubble label="Retail Goods" value={currency(activeInventoryValue)} icon={Package} tone="whiteGold" sub="Current shelf value" />
      </div>

      {/* Revenue Header & Action */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-2xl font-black text-[#5f0d7a]">Revenue Stream</h2>
          <p className="text-xs font-bold uppercase tracking-wider text-[#9f7ca6]">Incoming Cash & Transactions</p>
        </div>
        <PillButton onClick={openAdd} variant="primary">
          <Plus size={16} strokeWidth={3} /> Log Revenue
        </PillButton>
      </div>

      {/* Transactions Card Bubble */}
      <div className="bg-white rounded-[32px] border-2 border-[#eedff5] shadow-md overflow-hidden">
        {sorted.length === 0 ? (
          <EmptyState icon={DollarSign} title="No revenue logged yet" desc="Add your first client payment or product sale." />
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

      {/* Modal */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? "Update Transaction" : "Log New Income"} icon={DollarSign}>
        <form onSubmit={save}>
          <Field label="Payment Date">
            <input type="date" required className={inputCls} value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
          </Field>
          <Field label="Client or Source">
            <input
              list="revenue-sources"
              required
              placeholder="e.g. Maya L. or Product Sale"
              className={inputCls}
              value={form.source}
              onChange={(e) => setForm({ ...form, source: e.target.value })}
            />
            <datalist id="revenue-sources">{REVENUE_SOURCES.map((s) => <option key={s} value={s} />)}</datalist>
          </Field>
          <Field label="Service / Item Rendered">
            <input
              list="revenue-services"
              placeholder="e.g. Knotless Braids"
              className={inputCls}
              value={form.service}
              onChange={(e) => setForm({ ...form, service: e.target.value })}
            />
            <datalist id="revenue-services">{SERVICES.map((s) => <option key={s} value={s} />)}</datalist>
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
            <PillButton type="submit" variant="primary" className="flex-1">{editing ? "Update Log" : "Confirm Log"}</PillButton>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        open={!!confirmId}
        message="This will remove the transaction from your overall business revenue calculation."
        onCancel={() => setConfirmId(null)}
        onConfirm={remove}
      />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Appointments Tab                                                   */
/* ------------------------------------------------------------------ */

const emptyApptForm = { client: "", service: SERVICES[0], date: "", time: "", price: "", status: "Scheduled", notes: "" };

const statusStyle = {
  Scheduled: { tone: "purple", icon: Clock },
  Completed: { tone: "green", icon: CheckCircle2 },
  Canceled: { tone: "red", icon: XCircle },
};

function AppointmentsTab({ appointments, setAppointments }) {
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
    setForm({ ...emptyApptForm, date: today, time: "11:00" });
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

  const markCompleted = (id) => {
    setAppointments((prev) => prev.map((a) => (a.id === id ? { ...a, status: "Completed" } : a)));
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
        <div>
          <h2 className="text-2xl font-black text-[#5f0d7a]">Appointment Book</h2>
          <p className="text-xs font-bold uppercase tracking-wider text-[#9f7ca6]">
            {filtered.length} {view === "upcoming" ? "Pending / Upcoming" : "Past / Completed"} Booking{filtered.length === 1 ? "" : "s"}
          </p>
        </div>
        <PillButton onClick={openAdd} variant="primary">
          <Plus size={16} strokeWidth={3} /> Book Appointment
        </PillButton>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="inline-flex bg-white border-2 border-[#eedff5] rounded-full p-1 shadow-xs w-fit">
          {["upcoming", "past"].map((v) => (
            <button
              key={v}
              onClick={() => setView(v)}
              className={`px-5 py-2 rounded-full text-xs font-black uppercase tracking-wider transition-all ${
                view === v
                  ? "bg-[#5f0d7a] text-white shadow-sm"
                  : "text-[#7b5c87] hover:text-[#5f0d7a]"
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
          desc={query ? "Try searching for a different client." : "Add your next client to the calendar."}
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
                  <p className="text-2xl font-black text-[#5f0d7a]">{currency(a.price)}</p>
                  <div className="flex gap-2">
                    {a.status !== "Completed" && (
                      <IconCircleButton icon={CheckCircle2} variant="gold" onClick={() => markCompleted(a.id)} title="Mark as Completed" />
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

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? "Edit Appointment" : "New Appointment"} icon={CalendarCheck2}>
        <form onSubmit={save}>
          <Field label="Client Full Name">
            <input required className={inputCls} value={form.client} onChange={(e) => setForm({ ...form, client: e.target.value })} placeholder="e.g. Amara Johnson" />
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
            <Field label="Fee ($)">
              <input type="number" min="0" step="0.01" required className={inputCls} value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
            </Field>
            <Field label="Booking Status">
              <select className={inputCls} value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                {Object.keys(statusStyle).map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </Field>
          </div>
          <Field label="Stylist Reminders / Notes">
            <textarea rows={2} className={inputCls} value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} placeholder="Hair texture, preferred parts, extensions..." />
          </Field>
          <div className="flex gap-3 mt-4">
            <PillButton type="button" variant="subtle" className="flex-1" onClick={() => setModalOpen(false)}>Cancel</PillButton>
            <PillButton type="submit" variant="primary" className="flex-1">{editing ? "Update Appointment" : "Confirm Booking"}</PillButton>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        open={!!confirmId}
        message="This scheduled appointment will be permanently deleted."
        onCancel={() => setConfirmId(null)}
        onConfirm={remove}
      />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Inventory Tab                                                      */
/* ------------------------------------------------------------------ */

const emptyProductForm = { name: "", category: INVENTORY_CATEGORIES[0], stock: "", unitCost: "", sellingPrice: "" };
const LOW_STOCK = 5;

function InventoryTab({ inventory, setInventory }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyProductForm);
  const [confirmId, setConfirmId] = useState(null);

  const sorted = useMemo(() => [...inventory].sort((a, b) => a.name.localeCompare(b.name)), [inventory]);
  const lowStockCount = inventory.filter((p) => p.stock < LOW_STOCK).length;

  const openAdd = () => {
    setEditing(null);
    setForm(emptyProductForm);
    setModalOpen(true);
  };
  const openEdit = (p) => {
    setEditing(p.id);
    setForm({ name: p.name, category: p.category, stock: p.stock, unitCost: p.unitCost, sellingPrice: p.sellingPrice });
    setModalOpen(true);
  };

  const save = (e) => {
    e.preventDefault();
    if (!form.name || form.stock === "" || form.unitCost === "" || form.sellingPrice === "") return;
    const payload = { ...form, stock: Number(form.stock), unitCost: Number(form.unitCost), sellingPrice: Number(form.sellingPrice) };
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
    setInventory((prev) => prev.map((p) => (p.id === id ? { ...p, stock: Math.max(0, p.stock + delta) } : p)));
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-black text-[#5f0d7a]">Salon Inventory</h2>
          <p className="text-xs font-bold uppercase tracking-wider text-[#9f7ca6]">
            {inventory.length} Stocked Products
            {lowStockCount > 0 && (
              <span className="text-amber-600 font-black"> · {lowStockCount} Need Restocking</span>
            )}
          </p>
        </div>
        <PillButton onClick={openAdd} variant="primary">
          <Plus size={16} strokeWidth={3} /> Add Product
        </PillButton>
      </div>

      {sorted.length === 0 ? (
        <EmptyState icon={Package} title="No inventory found" desc="Add products or tools to track in-house stock." />
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {sorted.map((p) => {
            const low = p.stock < LOW_STOCK;
            return (
              <div
                key={p.id}
                className="bg-white rounded-[32px] border-2 border-[#eedff5] p-5 shadow-sm hover:border-[#ccaa79] transition flex flex-col justify-between gap-4 relative overflow-hidden"
              >
                {low && (
                  <div className="absolute top-3 right-3">
                    <span className="flex items-center gap-1 bg-amber-100 text-amber-900 border border-amber-300 text-[10px] font-black uppercase px-2.5 py-1 rounded-full shadow-2xs">
                      <AlertTriangle size={11} strokeWidth={3} /> Low
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
                    <p className="text-[10px] font-black uppercase tracking-wider text-[#9f7d4e]">Retail</p>
                    <p className="font-black text-[#855e1c] text-sm">{currency(p.sellingPrice)}</p>
                  </div>
                </div>

                {/* Fintech Counter Bubble */}
                <div className="flex items-center justify-between bg-gradient-to-r from-[#5f0d7a] to-[#7f18a2] rounded-2xl p-2 shadow-xs">
                  <button
                    onClick={() => bump(p.id, -1)}
                    className="w-9 h-9 rounded-xl bg-white/20 text-white flex items-center justify-center hover:bg-white/30 active:scale-90 transition"
                  >
                    <ChevronDown size={18} strokeWidth={3} />
                  </button>
                  <div className="text-center">
                    <p className={`font-black text-xl leading-none ${low ? "text-[#fadb9e]" : "text-white"}`}>{p.stock}</p>
                    <p className="text-[9px] font-black text-white/70 uppercase tracking-widest mt-0.5">Units</p>
                  </div>
                  <button
                    onClick={() => bump(p.id, 1)}
                    className="w-9 h-9 rounded-xl bg-white/20 text-white flex items-center justify-center hover:bg-white/30 active:scale-90 transition"
                  >
                    <ChevronUp size={18} strokeWidth={3} />
                  </button>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#f4eaf7]">
                  <IconCircleButton icon={Pencil} variant="purple" onClick={() => openEdit(p)} title="Edit Item" />
                  <IconCircleButton icon={Trash2} variant="danger" onClick={() => setConfirmId(p.id)} title="Delete Item" />
                </div>
              </div>
            );
          })}
        </div>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? "Update Product" : "New Inventory Item"} icon={Package}>
        <form onSubmit={save}>
          <Field label="Product Name">
            <input required className={inputCls} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. Edge Control Wax" />
          </Field>
          <Field label="Category">
            <select className={inputCls} value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
              {INVENTORY_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </Field>
          <Field label="Starting Unit Count">
            <input type="number" min="0" required className={inputCls} value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Cost to You ($)">
              <input type="number" min="0" step="0.01" required className={inputCls} value={form.unitCost} onChange={(e) => setForm({ ...form, unitCost: e.target.value })} />
            </Field>
            <Field label="Client Sell Price ($)">
              <input type="number" min="0" step="0.01" required className={inputCls} value={form.sellingPrice} onChange={(e) => setForm({ ...form, sellingPrice: e.target.value })} />
            </Field>
          </div>
          <div className="flex gap-3 mt-4">
            <PillButton type="button" variant="subtle" className="flex-1" onClick={() => setModalOpen(false)}>Cancel</PillButton>
            <PillButton type="submit" variant="primary" className="flex-1">{editing ? "Save Updates" : "Add to Stock"}</PillButton>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        open={!!confirmId}
        message="This product will be permanently removed from your salon stock list."
        onCancel={() => setConfirmId(null)}
        onConfirm={remove}
      />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Empty State Bubble                                                 */
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