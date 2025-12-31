import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { 
  Activity, 
  ChevronRight, 
  AlertCircle, 
  CheckCircle2, 
  User, 
  LayoutDashboard, 
  Tablet, 
  Eye, 
  XCircle, 
  History, 
  MicOff, 
  Settings,
  MoreVertical,
  Play,
  Pause,
  AlertTriangle,
  ArrowRight
} from 'lucide-react';
import { 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  AreaChart, 
  Area 
} from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';

// --- Mock Data ---
const mockSessionData = {
  patient: {
    name: "John Doe",
    age: 69,
    dob: "05/12/1955",
    mrn: "SDNE-88219",
    examDate: "Oct 24, 2023",
    provider: "Dr. Sarah Chen"
  },
  modules: [
    { id: '0', name: 'Calibrate', status: 'normal' },
    { id: 'A', name: 'Vision', status: 'normal' },
    { id: 'B', name: 'Motor', status: 'borderline', details: 'Tremor detected (4.8Hz)' },
    { id: 'C', name: 'Gait', status: 'abnormal', details: 'Fall risk: Elevated' },
    { id: 'D', name: 'Balance', status: 'normal' },
    { id: 'E', name: 'Coordination', status: 'normal' },
    { id: 'F', name: 'Memory', status: 'normal' },
    { id: 'G', name: 'Visual Search', status: 'normal' },
    { id: 'H', name: 'Hearing', status: 'invalid', details: 'Ambient noise exceeded' },
    { id: 'J', name: 'Cognitive', status: 'normal' },
  ],
  tremorData: Array.from({ length: 40 }, (_, i) => ({
    time: i,
    amplitude: 2 + Math.sin(i * 0.8) * 1.5 + Math.random() * 0.5
  }))
};

type View = 'dashboard' | 'ma_tablet' | 'xr_sim';

const FLAG_COLORS = {
  normal: { bg: 'bg-emerald-500', text: 'text-emerald-700', border: 'border-emerald-200', light: 'bg-emerald-50' },
  borderline: { bg: 'bg-amber-500', text: 'text-amber-700', border: 'border-amber-200', light: 'bg-amber-50' },
  abnormal: { bg: 'bg-rose-500', text: 'text-rose-700', border: 'border-rose-200', light: 'bg-rose-50' },
  invalid: { bg: 'bg-slate-400', text: 'text-slate-600', border: 'border-slate-200', light: 'bg-slate-100' },
};

const Header = ({ currentView, setView }: { currentView: View, setView: (v: View) => void }) => (
  <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between sticky top-0 z-50 shadow-sm">
    <div className="flex items-center gap-4">
      <div className="bg-slate-900 text-white p-2 rounded-lg shadow-lg">
        <Activity size={24} />
      </div>
      <div>
        <div className="flex items-center gap-2">
          <h1 className="font-bold text-slate-900 text-lg leading-tight">SDNE</h1>
          <span className="bg-blue-100 text-blue-700 text-[10px] font-black px-1.5 py-0.5 rounded tracking-tighter">ALPHA 0.4</span>
        </div>
        <p className="text-xs text-slate-500 uppercase tracking-widest font-semibold">Samsung Medical Next</p>
      </div>
    </div>
    
    <nav className="hidden md:flex bg-slate-100 p-1 rounded-xl">
      {[
        { id: 'dashboard', label: 'Clinician Review', icon: LayoutDashboard },
        { id: 'ma_tablet', label: 'MA Supervision', icon: Tablet },
        { id: 'xr_sim', label: 'XR Simulator', icon: Eye }
      ].map((item) => (
        <button
          key={item.id}
          onClick={() => setView(item.id as View)}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all text-sm font-medium ${
            currentView === item.id 
              ? 'bg-white text-slate-900 shadow-sm' 
              : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          <item.icon size={16} />
          {item.label}
        </button>
      ))}
    </nav>

    <div className="flex items-center gap-3">
      <div className="text-right hidden sm:block">
        <p className="text-sm font-bold text-slate-900">{mockSessionData.patient.name}</p>
        <p className="text-xs text-slate-500">MRN: {mockSessionData.patient.mrn}</p>
      </div>
      <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center border border-slate-200 overflow-hidden shadow-inner">
        <User size={20} className="text-slate-400" />
      </div>
    </div>
  </header>
);

const ModuleTile: React.FC<{ module: any, expanded: boolean, onToggle: () => void }> = ({ module, expanded, onToggle }) => {
  const colors = FLAG_COLORS[module.status as keyof typeof FLAG_COLORS];
  
  return (
    <div className={`border rounded-2xl transition-all duration-300 overflow-hidden ${expanded ? 'col-span-2 row-span-2' : ''} ${colors.border} bg-white shadow-sm hover:shadow-md`}>
      <div className={`p-4 cursor-pointer flex items-center justify-between ${colors.light}`} onClick={onToggle}>
        <div className="flex items-center gap-4">
          <div className={`w-12 h-12 rounded-xl ${colors.bg} flex items-center justify-center text-white font-bold text-xl shadow-sm`}>{module.id}</div>
          <div>
            <h3 className="font-bold text-slate-900">{module.name}</h3>
            <p className={`text-xs font-bold uppercase tracking-wider ${colors.text}`}>{module.status}</p>
          </div>
        </div>
        <ChevronRight size={20} className={`text-slate-400 transition-transform duration-300 ${expanded ? 'rotate-90' : ''}`} />
      </div>

      <AnimatePresence>
        {expanded && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="p-6 space-y-4 border-t border-slate-100 bg-white">
            {module.id === 'C' && (
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <p className="text-xs text-slate-500 uppercase font-bold mb-1">Gait Velocity</p>
                  <p className="text-3xl font-bold text-rose-600">0.8 <span className="text-sm font-normal text-slate-400">m/s</span></p>
                  <div className="flex items-center gap-1 mt-2 px-2 py-0.5 bg-rose-100 text-rose-700 text-[10px] font-bold rounded w-fit"><AlertTriangle size={10} /> CRITICAL THRESHOLD</div>
                </div>
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <p className="text-xs text-slate-500 uppercase font-bold mb-1">TUG Time</p>
                  <p className="text-3xl font-bold text-slate-900">14.2 <span className="text-sm font-normal text-slate-400">sec</span></p>
                </div>
                <div className="col-span-2 bg-rose-50 border border-rose-100 p-4 rounded-xl flex gap-3 shadow-sm">
                  <AlertCircle className="text-rose-500 shrink-0" size={20} />
                  <div>
                    <p className="text-sm font-bold text-rose-900">PATTERN: FALL_RISK_ELEVATED</p>
                    <p className="text-xs text-rose-700 leading-relaxed">System detected a 14% decrease in stride frequency during gait transitions.</p>
                  </div>
                </div>
              </div>
            )}
            {module.id === 'B' && (
              <div className="space-y-4">
                <div className="h-44 w-full bg-slate-50 rounded-xl p-4 border border-slate-100">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={mockSessionData.tremorData}>
                      <defs><linearGradient id="colorAmp" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#f59e0b" stopOpacity={0.2}/><stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/></linearGradient></defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                      <XAxis dataKey="time" hide />
                      <YAxis hide domain={[0, 6]} />
                      <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                      <Area type="monotone" dataKey="amplitude" stroke="#f59e0b" strokeWidth={2} fillOpacity={1} fill="url(#colorAmp)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex justify-between items-center text-sm px-1">
                  <span className="text-slate-500 font-medium">Dominant Freq: <span className="ml-2 font-bold text-amber-600">4.8 Hz</span></span>
                  <div className="text-[10px] bg-amber-100 text-amber-700 px-3 py-1 rounded-full font-black uppercase">MILD POSTURAL TREMOR</div>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const ClinicianDashboard = () => {
  const [expandedModule, setExpandedModule] = useState<string | null>('C');
  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto grid grid-cols-12 gap-8">
      <div className="col-span-12 lg:col-span-4 space-y-6">
        <section className="bg-slate-900 text-white rounded-[32px] p-8 shadow-2xl relative overflow-hidden group">
          <div className="relative z-10">
            <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-400 mb-4">Automated Clinical Narrative</h2>
            <p className="text-xl font-light leading-relaxed text-slate-200">Patient exhibits <span className="text-rose-400 font-bold underline decoration-rose-400/30 underline-offset-4">elevated fall risk</span>. Gait velocity (0.8m/s) is 20% below age-matched cohort.</p>
          </div>
          <Activity className="absolute -bottom-10 -right-10 text-white/5 group-hover:text-white/10 transition-colors duration-700" size={240} />
        </section>
        <section className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
          <h3 className="font-bold text-slate-900 flex items-center gap-2 mb-6"><div className="w-2 h-2 rounded-full bg-blue-600" /> Exam Heatmap</h3>
          <div className="grid grid-cols-5 gap-2.5">
            {mockSessionData.modules.map(mod => {
              const colors = FLAG_COLORS[mod.status as keyof typeof FLAG_COLORS];
              return (
                <div key={mod.id} className={`aspect-square rounded-xl flex items-center justify-center text-white font-bold text-sm shadow-sm transition-all hover:scale-110 cursor-pointer ${colors.bg}`} onClick={() => setExpandedModule(mod.id)}>{mod.id}</div>
              );
            })}
          </div>
        </section>
      </div>
      <div className="col-span-12 lg:col-span-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {mockSessionData.modules.map(mod => (
            <ModuleTile key={mod.id} module={mod} expanded={expandedModule === mod.id} onToggle={() => setExpandedModule(expandedModule === mod.id ? null : mod.id)} />
          ))}
        </div>
      </div>
    </div>
  );
};

const MATabletView = () => (
  <div className="p-10 text-center">
    <Tablet className="mx-auto text-slate-300 mb-4" size={48} />
    <h2 className="text-2xl font-bold text-slate-900">MA Supervision View</h2>
    <p className="text-slate-500">System Live | Monitoring John Doe</p>
  </div>
);

const XRSimulatorView = () => (
  <div className="p-10 text-center">
    <Eye className="mx-auto text-slate-300 mb-4" size={48} />
    <h2 className="text-2xl font-bold text-slate-900">XR Patient Sim</h2>
    <p className="text-slate-500">Gaze Tracking & Spatial Neglect Task</p>
  </div>
);

export function App() {
  const [view, setView] = useState<View>('dashboard');
  useEffect(() => {
    const loader = document.getElementById('loading-screen');
    if (loader) {
      setTimeout(() => {
        loader.style.opacity = '0';
        setTimeout(() => loader.remove(), 500);
      }, 500);
    }
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Header currentView={view} setView={setView} />
      <main className="flex-grow">
        <AnimatePresence mode="wait">
          <motion.div key={view} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
            {view === 'dashboard' && <ClinicianDashboard />}
            {view === 'ma_tablet' && <MATabletView />}
            {view === 'xr_sim' && <XRSimulatorView />}
          </motion.div>
        </AnimatePresence>
      </main>
      <footer className="bg-white border-t border-slate-200 py-4 px-8 flex justify-between items-center text-[9px] font-black text-slate-400 uppercase tracking-widest">
        <span>SDNE Platform Alpha v0.4</span>
        <img src="https://upload.wikimedia.org/wikipedia/commons/2/24/Samsung_Logo.svg" alt="Samsung" className="h-2 opacity-20" />
      </footer>
    </div>
  );
}

// Mount the app
const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(<App />);
}
