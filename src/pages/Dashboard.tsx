import React, { useState } from 'react';
import { 
  Heart, 
  TrendingUp, 
  AlertTriangle, 
  Plus, 
  Clock, 
  ChevronRight,
  Activity,
  Zap
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip 
} from 'recharts';
import { Link } from 'react-router-dom';
import { cn } from '../lib/utils';
import AddReadingModal from '../components/AddReadingModal';

const mockData = [
  { time: '08:00', sys: 118, dia: 78 },
  { time: '12:00', sys: 125, dia: 82 },
  { time: '16:00', sys: 121, dia: 79 },
  { time: '20:00', sys: 119, dia: 77 },
  { time: '22:00', sys: 115, dia: 75 },
];

const StatCard = ({ title, value, unit, trend, color }: { title: string, value: string, unit: string, trend?: string, color: string }) => (
  <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
    <div className="flex items-center justify-between mb-4">
      <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">{title}</span>
      <div className={cn("w-2 h-2 rounded-full", color)} />
    </div>
    <div className="flex items-baseline gap-2">
      <h3 className="text-4xl font-black text-slate-900">{value}</h3>
      <span className="text-slate-400 font-bold text-sm tracking-tight">{unit}</span>
    </div>
    {trend && (
      <div className="mt-4 flex items-center gap-1.5 text-xs font-bold text-emerald-600 bg-emerald-50 w-fit px-2 py-1 rounded-lg">
        <TrendingUp className="w-3.5 h-3.5" />
        {trend}
      </div>
    )}
  </div>
);

export default function Dashboard() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="space-y-8">
      {/* Top Banner / Welcome */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Good morning, Alex.</h2>
          <p className="text-slate-500 mt-1 font-medium">Your heart health is <span className="text-emerald-600 font-bold">Stable</span> today.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-6 py-3.5 bg-blue-600 text-white font-bold rounded-2xl shadow-lg shadow-blue-100 hover:bg-blue-700 transition-all active:scale-95"
        >
          <Plus className="w-5 h-5" />
          Log Reading
        </button>
      </div>

      <AddReadingModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard title="Last Reading" value="118/72" unit="mmHg" trend="-2.4% from avg" color="bg-emerald-500" />
        <StatCard title="Average Pulse" value="68" unit="bpm" color="bg-emerald-500" />
        <StatCard title="Health Score" value="94" unit="/100" color="bg-emerald-500" />
        <div className="bg-slate-900 p-6 rounded-3xl shadow-xl shadow-slate-200 text-white relative overflow-hidden group">
          <Zap className="absolute -right-4 -top-4 w-32 h-32 text-white/5 group-hover:text-amber-400/10 transition-colors duration-500" />
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-amber-400">AI INSIGHT</span>
          <h3 className="mt-4 text-xl font-bold leading-tight">BP looks good. Next suggested log in 4 hours.</h3>
          <Link to="/predictions" className="mt-6 flex items-center gap-1 text-sm font-bold text-amber-400 hover:text-amber-300 transition-colors">
            View Analysis <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Weekly Chart */}
        <div className="lg:col-span-2 bg-white p-8 rounded-3xl border border-slate-100 shadow-sm flex flex-col gap-8">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold text-slate-900">Weekly Trends</h3>
              <p className="text-sm text-slate-500 font-medium">Continuous tracking of your systolic levels</p>
            </div>
            <select className="bg-slate-50 border-none rounded-xl text-sm font-bold px-4 py-2 outline-none cursor-pointer">
              <option>Last 7 Days</option>
              <option>Last 30 Days</option>
            </select>
          </div>
          
          <div className="h-[300px] w-full overflow-hidden min-h-[300px] min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={mockData}>
                <defs>
                  <linearGradient id="colorSys" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12, fontWeight: 600}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12, fontWeight: 600}} domain={[60, 160]} />
                <Tooltip 
                  contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}}
                />
                <Area type="monotone" dataKey="sys" stroke="#2563eb" strokeWidth={3} fillOpacity={1} fill="url(#colorSys)" />
                <Area type="monotone" dataKey="dia" stroke="#94a3b8" strokeWidth={2} fill="transparent" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-slate-900">Recent Logs</h3>
            <Link to="/records" className="text-sm font-bold text-blue-600 hover:underline">View All</Link>
          </div>
          
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <Link key={i} to="/records" className="flex items-center gap-4 p-4 rounded-2xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100 cursor-pointer group block">
                <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center font-bold text-sm">
                  11{i+2}
                </div>
                <div className="flex-1">
                  <p className="font-bold text-slate-900">Normal Reading</p>
                  <p className="text-xs text-slate-500 font-medium flex items-center gap-1">
                    <Clock className="w-3 h-3" /> Today, {8 + i}:00 AM
                  </p>
                </div>
                <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-slate-900 transition-colors" />
              </Link>
            ))}
          </div>

          <div className="mt-4 p-4 bg-rose-50 rounded-2xl border border-rose-100 flex gap-4">
            <div className="w-10 h-10 bg-rose-100 text-rose-600 rounded-full flex-shrink-0 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-bold text-rose-900 leading-tight">Elevated pattern detected yesterday evening.</p>
              <Link to="/analytics" className="text-xs font-bold text-rose-600 mt-1 inline-block hover:underline">Review Analysis →</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
