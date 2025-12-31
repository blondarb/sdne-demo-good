import React, { useState, useEffect, useMemo } from 'react';
import { createRoot } from 'react-dom/client';
import { 
  Activity, ChevronRight, AlertCircle, CheckCircle2, User, 
  LayoutDashboard, Tablet, Eye, XCircle, History, MicOff, 
  Settings, MoreVertical, Play, Pause, AlertTriangle, ArrowRight,
  Heart, Wifi, Battery, Zap
} from 'lucide-react';
import { 
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  AreaChart, Area, LineChart, Line 
} from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';

// --- Types ---
type View = 'dashboard' | 'ma_tablet' | 'xr_sim';

// --- Mock Data ---
const mockSessionData = {
  patient: {
    name: "John Doe",
    age: 69,
    mrn: "SDNE-88219",
    provider: "Dr. Sarah Chen"
  },
  modules: [
    { id: '0', name: 'Calibrate', status: 'normal' },
    { id: 'A', name: 'Vision', status: 'normal' },
    { id: 'B', name: 'Motor', status: 'borderline', details: 'Tremor detected (4.8Hz)' },
    { id: 'C', name: 'Gait', status: 'abnormal', details: 'Fall risk: Elevated' },
    { id: 'D', name: 'Balance', status: 'normal' },
    { id: 'G', name: 'Visual Search', status: 'normal' },
    { id: 'H', name: 'Hearing', status: 'invalid', details: 'Ambient noise exceeded' },
    { id: 'J', name: 'Cognitive', status: 'normal' },
  ],
  tremorData: Array.from({ length: 40 }, (_, i) => ({
    time: i,
    amplitude: 2 + Math.sin(i * 0.8) * 1.5 + Math.random() * 0.5
  }))
};

const FLAG_COLORS = {
  normal: { bg: 'bg-emerald-500', text: 'text-emerald-700', border: 'border-emerald-200', light: 'bg-emerald-50' },
  borderline: { bg: 'bg-amber-500', text: 'text-amber-700', border: 'border-amber-200', light: 'bg-amber-50' },
  abnormal: { bg: 'bg-rose-500', text: 'text-rose-700', border: 'border-rose-200', light: 'bg-rose-50' },
  invalid: { bg: 'bg-slate-400', text: 'text-slate-600', border: 'border-slate-200', light: 'bg-slate-100' },
};

// --- View 1: Clinician Dashboard Components ---
const ModuleTile: React.FC<{ module: any, expanded: boolean, onToggle: () => void }> = ({ module, expanded, onToggle }) => {
  const colors = FLAG_COLORS[module.status as keyof typeof FLAG_COLORS];
  return (
    <div className={`border rounded-2xl transition-all duration-300 overflow-hidden ${expanded ? 'col-span-2 row-span-2' : ''} ${colors.border} bg-white shadow-sm hover:shadow-md`}>
      <div className={`p-4 cursor-pointer flex items-center justify-between ${colors.light}`} onClick={onToggle}>
        <div className="flex items-center gap-4">
          <div className={`w-12 h-12 rounded-xl ${colors.bg} flex items-center justify-center text-white font-bold text-xl shadow-sm`}>{module.id}</div>
          <div>
            <h3 className="font-bold text-slate-900">{module.name}</h3>
            <p className={`text-[10px] font-black uppercase tracking-wider ${colors.text}`}>{module.status}</p>
          </div>
        </div>
        <ChevronRight size={18} className={`text-slate-400 transition-transform ${expanded ? 'rotate-90' : ''}`} />
      </div>
      <AnimatePresence>
        {expanded && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="p-6 space-y-4 border-t border-slate-100">
            {module.id === 'C' ? (
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-50 p-4 rounded-xl">
                  <p className="text-[10px] text-slate-500 font-bold uppercase mb-1">Velocity</p>
                  <p className="text-3xl font-bold text-rose-600">0.8 <span className="text-sm font-normal text-slate-400">m/s</span></p>
                </div>
                <div className="bg-slate-50 p-4 rounded-xl">
                  <p className="text-[10px] text-slate-500 font-bold uppercase mb-1">TUG Time</p>
                  <p className="text-3xl font-bold text-slate-900">14.2 <span className="text-sm font-normal text-slate-400">s</span></p>
                </div>
                <div className="col-span-2 bg-rose-50 p-4 rounded-xl flex gap-3 border border-rose-100">
                  <AlertCircle className="text-rose-500 shrink-0" size={20} />
                  <p className="text-xs text-rose-900 leading-relaxed font-medium">PATTERN: FALL_RISK_ELEVATED. Detected decrease in stride frequency.</p>
                </div>
              </div>
            ) : module.id === 'B' ? (
              <div className="space-y-4">
                <div className="h-40 bg-slate-50 rounded-xl p-4 border border-slate-100">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={mockSessionData.tremorData}>
                      <Area type="monotone" dataKey="amplitude" stroke="#f59e0b" fill="#fef3c7" strokeWidth={2} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Dominant Frequency: <span className="text-amber-600">4.8 Hz</span></p>
              </div>
            ) : module.id === 'H' ? (
              <div className="text-center py-8">
                <MicOff className="mx-auto text-slate-300 mb-3" size={32} />
                <p className="text-sm font-bold text-slate-900">Ambient Noise Exceeded</p>
                <p className="text-xs text-slate-500 mt-1 px-4">Recalibration required for PTA validity.</p>
              </div>
            ) : (
              <div className="py-6 flex flex-col items-center justify-center text-center opacity-40">
                <CheckCircle2 className="text-emerald-500 mb-2" size={32} />
                <p className="text-xs font-bold uppercase tracking-widest">Normal Variance</p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const ClinicianDashboard = () => {
  const [expanded, setExpanded] = useState<string | null>('C');
  return (
    <div className="p-8 max-w-7xl mx-auto grid grid-cols-12 gap-8">
      <div className="col-span-12 lg:col-span-4 space-y-6">
        <section className="bg-slate-900 text-white rounded-[32px] p-8 shadow-xl relative overflow-hidden group">
          <div className="relative z-10">
            <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-400 mb-4">Clinical Narrative (AI)</h2>
            <p className="text-xl font-light leading-relaxed">Patient exhibits <span className="text-rose-400 font-bold underline decoration-rose-400/30 underline-offset-4">elevated fall risk</span>. Gait velocity (0.8m/s) is 20% below age-matched cohort.</p>
          </div>
          <Activity className="absolute -bottom-10 -right-10 text-white/5 group-hover:text-white/10" size={240} />
        </section>
        <section className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
          <h3 className="font-bold text-slate-900 flex items-center gap-2 mb-6"><div className="w-2 h-2 rounded-full bg-blue-600" /> Exam Heatmap</h3>
          <div className="grid grid-cols-5 gap-2.5">
            {mockSessionData.modules.map(mod => (
              <div key={mod.id} onClick={() => setExpanded(mod.id)} className={`aspect-square rounded-xl flex items-center justify-center text-white font-bold text-sm cursor-pointer transition-transform hover:scale-105 ${FLAG_COLORS[mod.status as keyof typeof FLAG_COLORS].bg}`}>{mod.id}</div>
            ))}
          </div>
        </section>
      </div>
      <div className="col-span-12 lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-5">
        {mockSessionData.modules.map(mod => (
          <ModuleTile key={mod.id} module={mod} expanded={expanded === mod.id} onToggle={() => setExpanded(expanded === mod.id ? null : mod.id)} />
        ))}
      </div>
    </div>
  );
};

// --- View 2: MA Tablet Components ---
const MATabletView = () => {
  const [sessionActive, setSessionActive] = useState(true);
  const [hr, setHr] = useState(72);

  useEffect(() => {
    const timer = setInterval(() => setHr(prev => prev + (Math.random() > 0.5 ? 1 : -1)), 2000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex h-[calc(100vh-80px)] bg-slate-100 overflow-hidden">
      <aside className="w-80 bg-white border-r border-slate-200 p-6 flex flex-col">
        <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-8">Session Progress</h3>
        <div className="space-y-6 flex-1">
          {['Calibration', 'Vision Alpha', 'Tremor Sync', 'Gait Flow'].map((step, idx) => (
            <div key={idx} className={`flex items-center gap-4 ${idx > 2 ? 'opacity-30' : ''}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-black ${idx < 2 ? 'bg-emerald-500 text-white' : idx === 2 ? 'bg-blue-600 text-white animate-pulse' : 'bg-slate-200 text-slate-500'}`}>
                {idx < 2 ? <CheckCircle2 size={16} /> : idx + 1}
              </div>
              <span className="font-bold text-slate-900 text-sm">{step}</span>
            </div>
          ))}
        </div>
        <div className="bg-slate-900 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <p className="text-[10px] font-black text-slate-400 uppercase">Galaxy Watch Link</p>
            <div className="flex gap-1"><Wifi size={10} className="text-emerald-500" /><Battery size={10} className="text-emerald-500" /></div>
          </div>
          <div className="flex items-center gap-4">
            <Heart className="text-rose-500 animate-pulse" fill="#f43f5e" size={24} />
            <p className="text-3xl font-black">{hr} <span className="text-xs font-normal text-slate-500">BPM</span></p>
          </div>
        </div>
      </aside>
      <main className="flex-1 p-10 flex flex-col gap-8">
        <header className="flex justify-between items-end">
          <div>
            <span className="text-[10px] font-black bg-blue-100 text-blue-700 px-3 py-1 rounded-full uppercase mb-2 inline-block">Session: LIVE</span>
            <h2 className="text-4xl font-black text-slate-900 tracking-tight">3. Tremor Analysis</h2>
          </div>
          <div className="flex gap-3">
            <button className="px-6 py-3 bg-white border border-slate-200 rounded-2xl font-bold text-slate-700 shadow-sm hover:bg-slate-50">Physical Event</button>
            <button onClick={() => setSessionActive(!sessionActive)} className={`px-10 py-3 rounded-2xl font-black shadow-lg flex items-center gap-2 ${sessionActive ? 'bg-amber-100 text-amber-700' : 'bg-blue-600 text-white'}`}>
              {sessionActive ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" />}
              {sessionActive ? 'PAUSE' : 'RESUME'}
            </button>
          </div>
        </header>
        <div className="grid grid-cols-2 gap-8 flex-1">
          <div className="bg-white rounded-[40px] p-10 border border-slate-200 shadow-sm">
             <div className="flex justify-between mb-10">
                <p className="text-xs font-black uppercase text-slate-400 tracking-widest">Hand Tracking Confidence</p>
                <Zap size={16} className="text-amber-500" />
             </div>
             <p className="text-7xl font-black text-slate-900 mb-6">94%</p>
             <div className="w-full h-4 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                <motion.div initial={{ width: 0 }} animate={{ width: '94%' }} className="h-full bg-blue-600" />
             </div>
          </div>
          <div className="bg-slate-950 rounded-[40px] border border-slate-800 p-10 flex flex-col justify-center items-center text-center">
             <div className="w-48 h-48 border-2 border-white/10 rounded-full flex items-center justify-center relative">
                <div className="absolute inset-0 border border-white/5 rounded-full animate-ping opacity-20" />
                <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 2 }} className="w-4 h-4 bg-emerald-400 rounded-full shadow-[0_0_20px_#34d399]" />
             </div>
             <p className="text-white font-bold mt-8">Gaze Tracking Stream</p>
             <p className="text-slate-500 text-xs uppercase tracking-widest mt-2">Active | 90Hz Sampling</p>
          </div>
        </div>
      </main>
    </div>
  );
};

// --- View 3: XR Simulator Components ---
const XRSimulatorView = () => {
  const [step, setStep] = useState<'cal' | 'task'>('cal');
  const [stars, setStars] = useState(Array.from({ length: 20 }, (_, i) => ({ id: i, active: true, x: 10 + Math.random() * 80, y: 10 + Math.random() * 80 })));

  const handlePinch = (id: number) => {
    setStars(prev => prev.map(s => s.id === id ? { ...s, active: false } : s));
  };

  return (
    <div className="h-[calc(100vh-80px)] bg-slate-950 flex flex-col items-center justify-center relative overflow-hidden cursor-crosshair">
      <div className="absolute inset-0 border-[40px] border-slate-900/40 rounded-[80px] pointer-events-none z-50">
        <div className="absolute top-12 left-12 text-[10px] font-black text-white/30 tracking-[0.3em] uppercase">Galaxy XR Platform OS v4.2</div>
      </div>
      
      {step === 'cal' ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center z-10">
          <h2 className="text-5xl font-black text-white mb-6">Bio-Calibration</h2>
          <p className="text-slate-400 mb-16 max-w-md mx-auto">Focus gaze on the central singularity to initialize eye-tracking sensors.</p>
          <div className="w-64 h-64 mx-auto flex items-center justify-center relative">
            <div className="absolute inset-0 border border-white/10 rounded-full animate-spin duration-[8s]" />
            <div className="absolute inset-8 border border-white/5 rounded-full animate-spin duration-[12s] reverse" />
            <motion.div animate={{ scale: [1, 1.5, 1], opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 2 }} className="w-8 h-8 bg-white rounded-full shadow-[0_0_60px_rgba(255,255,255,0.4)]" />
          </div>
          <button onClick={() => setStep('task')} className="mt-20 bg-white text-slate-900 px-12 py-4 rounded-full font-black hover:scale-105 transition-transform flex items-center gap-4 mx-auto">
            START EXAM <ArrowRight size={20} />
          </button>
        </motion.div>
      ) : (
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="w-full h-full max-w-6xl p-16 flex flex-col z-10">
          <div className="flex justify-between items-center mb-10 border-b border-white/10 pb-8">
            <div>
              <h3 className="text-3xl font-black text-white">Module G: Star Cancellation</h3>
              <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mt-1">Spatial Neglect Task | Interaction: PINCH</p>
            </div>
            <div className="text-5xl font-mono text-emerald-400 font-black">
              {stars.filter(s => !s.active).length}/{stars.length}
            </div>
          </div>
          <div className="flex-1 bg-black/40 rounded-[60px] border border-white/5 relative overflow-hidden group">
            {stars.map(star => (
              <button 
                key={star.id} 
                onClick={() => handlePinch(star.id)}
                className={`absolute w-12 h-12 flex items-center justify-center rounded-2xl transition-all duration-500 shadow-xl ${star.active ? 'bg-white/5 text-white/20 hover:bg-white/10' : 'bg-emerald-500 text-white scale-125 rotate-12 shadow-emerald-500/50'}`}
                style={{ left: `${star.x}%`, top: `${star.y}%` }}
              >
                {star.active ? <Activity size={20} /> : <CheckCircle2 size={24} />}
              </button>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
};

// --- App Root ---
export function App() {
  const [view, setView] = useState<View>('dashboard');

  useEffect(() => {
    const loader = document.getElementById('loading-screen');
    if (loader) {
      setTimeout(() => {
        loader.style.opacity = '0';
        setTimeout(() => loader.remove(), 500);
      }, 1000);
    }
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col selection:bg-blue-100 selection:text-blue-900">
      <header className="bg-white border-b border-slate-200 px-8 py-4 flex items-center justify-between sticky top-0 z-50 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="bg-slate-900 text-white p-2.5 rounded-xl shadow-lg"><Activity size={24} /></div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-black text-slate-900 text-xl tracking-tight">SDNE</h1>
              <span className="bg-blue-600 text-white text-[9px] font-black px-1.5 py-0.5 rounded uppercase">Alpha v0.4</span>
            </div>
            <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest leading-none">Samsung Medical Next</p>
          </div>
        </div>
        <nav className="bg-slate-100 p-1 rounded-2xl flex gap-1">
          {[
            { id: 'dashboard', label: 'Review', icon: LayoutDashboard },
            { id: 'ma_tablet', label: 'Supervise', icon: Tablet },
            { id: 'xr_sim', label: 'Simulator', icon: Eye }
          ].map(item => (
            <button key={item.id} onClick={() => setView(item.id as View)} className={`flex items-center gap-2 px-6 py-2.5 rounded-xl transition-all text-xs font-black uppercase tracking-wider ${view === item.id ? 'bg-white text-slate-900 shadow-md' : 'text-slate-500 hover:text-slate-700'}`}>
              <item.icon size={14} /> {item.label}
            </button>
          ))}
        </nav>
        <div className="flex items-center gap-4">
          <div className="text-right hidden sm:block leading-tight">
            <p className="font-bold text-slate-900">{mockSessionData.patient.name}, 69y</p>
            <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">{mockSessionData.patient.mrn}</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center shadow-inner"><User size={24} className="text-slate-400" /></div>
        </div>
      </header>

      <main className="flex-grow">
        <AnimatePresence mode="wait">
          <motion.div key={view} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }}>
            {view === 'dashboard' && <ClinicianDashboard />}
            {view === 'ma_tablet' && <MATabletView />}
            {view === 'xr_sim' && <XRSimulatorView />}
          </motion.div>
        </AnimatePresence>
      </main>

      <footer className="bg-white border-t border-slate-200 py-4 px-10 flex justify-between items-center text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">
        <div className="flex gap-10">
          <span className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]" /> Cloud Core Sync: ACTIVE</span>
          <span className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_8px_#3b82f6]" /> Galaxy Ecosystem: READY</span>
        </div>
        <img src="https://upload.wikimedia.org/wikipedia/commons/2/24/Samsung_Logo.svg" alt="Samsung" className="h-2.5 opacity-30" />
      </footer>
    </div>
  );
}

// Global initialization
const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(<App />);
}
