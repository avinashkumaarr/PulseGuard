import React, { useState, useEffect } from 'react';
import { 
  Heart, 
  TrendingUp, 
  AlertTriangle, 
  Plus, 
  Clock, 
  ChevronRight,
  Activity,
  Zap,
  Loader2
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
import { useAuthStore } from '../store';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { collection, query, where, orderBy, limit, onSnapshot } from 'firebase/firestore';

const mockData = [
  { time: '08:00', sys: 118, dia: 78 },
  { time: '12:00', sys: 125, dia: 82 },
  { time: '16:00', sys: 121, dia: 79 },
  { time: '20:00', sys: 119, dia: 77 },
  { time: '22:00', sys: 115, dia: 75 },
];

const StatCard = ({ title, value, unit, trend, color, icon: Icon }: { title: string, value: string, unit: string, trend?: string, color: string, icon: any }) => (
  <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all group">
    <div className="flex items-center justify-between mb-2">
      <div className={cn("p-2 rounded-xl text-white", color)}>
        <Icon className="w-4 h-4" />
      </div>
      {trend && (
        <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full uppercase tracking-wider">
          {trend}
        </span>
      )}
    </div>
    <div className="space-y-0.5">
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{title}</p>
      <div className="flex items-baseline gap-1">
        <h3 className="text-2xl font-black text-slate-900 tracking-tight">{value}</h3>
        <span className="text-slate-400 font-bold text-[10px] uppercase">{unit}</span>
      </div>
    </div>
  </div>
);

export default function Dashboard() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { user } = useAuthStore();
  const [records, setRecords] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const q = query(
      collection(db, 'records'),
      where('userId', '==', user.id),
      orderBy('timestamp', 'desc'),
      limit(10)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setRecords(docs);
      setLoading(false);
    }, (error) => {
      console.error("Dashboard data fetch failed", error);
      handleFirestoreError(error, OperationType.LIST, 'records');
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const latestReading = records[0];
  const chartData = [...records].reverse().map(r => ({
    time: r.timestamp?.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) || 'Pending',
    sys: r.sys,
    dia: r.dia
  }));

  const formatRelativeTime = (ts: any) => {
    if (!ts) return '';
    const date = ts.toDate();
    const now = new Date();
    const diff = Math.floor((now.getTime() - date.getTime()) / 60000); // minutes
    if (diff < 60) return `${diff}m ago`;
    if (diff < 1440) return `${Math.floor(diff / 60)}h ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="space-y-6">
      {/* Top Banner / Welcome */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight leading-none">Welcome, {user?.name?.split(' ')[0]}.</h2>
          <p className="text-slate-500 mt-2 font-medium text-sm">Your cardiac rhythm is <span className={cn("font-bold", 
            latestReading?.status === 'Normal' ? "text-emerald-600" : 
            latestReading?.status === 'Elevated' ? "text-amber-600" :
            ["Hypertension I", "Hypertension II", "Crisis"].includes(latestReading?.status) ? "text-rose-600" : "text-blue-600"
          )}>{latestReading?.status || 'Stable'}</span>.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center justify-center gap-2 px-6 py-3.5 bg-blue-600 text-white font-bold rounded-2xl shadow-lg shadow-blue-100 hover:bg-blue-700 transition-all active:scale-95 text-sm"
        >
          <Plus className="w-5 h-5" />
          Log Reading
        </button>
      </div>

      <AddReadingModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />

      {/* Main Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          title="Last Reading" 
          value={latestReading ? `${latestReading.sys}/${latestReading.dia}` : 'N/A'} 
          unit="mmHg" 
          trend={latestReading?.status === 'Normal' ? "Optimal" : undefined}
          color="bg-emerald-500" 
          icon={Heart}
        />
        <StatCard 
          title="Avg Pulse" 
          value={latestReading?.pulse?.toString() || '72'} 
          unit="bpm" 
          color="bg-blue-500" 
          icon={Activity}
        />
        <StatCard 
          title="Health Score" 
          value={latestReading?.prediction?.risk_score ? (100 - latestReading.prediction.risk_score).toString() : "92"} 
          unit="/100" 
          color="bg-indigo-500" 
          icon={Zap}
        />
        <div className="bg-slate-900 p-5 rounded-3xl shadow-xl shadow-slate-200 text-white relative overflow-hidden group col-span-2 lg:col-span-1">
          <Zap className="absolute -right-2 -top-2 w-20 h-20 text-white/5 group-hover:text-amber-400/10 transition-colors duration-500" />
          <div className="relative z-10 flex flex-col h-full justify-between gap-3">
            <div>
              <span className="text-[8px] font-black uppercase tracking-[0.2em] text-amber-400">AI INSIGHT</span>
              <p className="mt-1 text-xs font-bold leading-relaxed line-clamp-2">
                {latestReading?.prediction?.explanation || "PulseGuard AI is ready to analyze your next reading."}
              </p>
            </div>
            <Link to="/analytics" className="text-[10px] font-black text-amber-400 hover:text-amber-300 transition-colors flex items-center gap-1 uppercase tracking-wider">
              Health Report <ChevronRight className="w-3 h-3" />
            </Link>
          </div>
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
            {loading ? (
              <div className="h-full flex flex-col items-center justify-center text-slate-400 font-bold italic">
                <Loader2 className="w-8 h-8 animate-spin mb-2" />
                Synchronizing PulseGuard telemetry...
              </div>
            ) : chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorSys" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2563eb" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 600}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 600}} domain={[60, 160]} />
                  <Tooltip 
                    contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}}
                  />
                  <Area type="monotone" dataKey="sys" stroke="#2563eb" strokeWidth={3} fillOpacity={1} fill="url(#colorSys)" />
                  <Area type="monotone" dataKey="dia" stroke="#94a3b8" strokeWidth={2} fill="transparent" />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-slate-400 font-bold italic">
                Log your first reading to see Trends.
              </div>
            )}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-slate-900">Recent Logs</h3>
            <Link to="/records" className="text-sm font-bold text-blue-600 hover:underline">View All</Link>
          </div>
          
          <div className="space-y-4">
            {records.slice(0, 4).map((record) => (
              <Link key={record.id} to="/records" className="flex items-center gap-4 p-4 rounded-2xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100 cursor-pointer group block">
                <div className={cn(
                  "w-12 h-12 rounded-xl flex items-center justify-center font-bold text-sm",
                  record.status === 'Normal' ? "bg-emerald-50 text-emerald-600" : 
                  record.status === 'Elevated' ? "bg-amber-50 text-amber-600" :
                  record.status === 'Hypertension I' ? "bg-orange-50 text-orange-600" :
                  record.status === 'Hypertension II' ? "bg-rose-50 text-rose-600" :
                  "bg-red-50 text-red-600"
                )}>
                  {record.sys}
                </div>
                <div className="flex-1">
                  <p className="font-bold text-slate-900">{record.status} Reading</p>
                  <p className="text-xs text-slate-500 font-medium flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {formatRelativeTime(record.timestamp)}
                  </p>
                </div>
                <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-slate-900 transition-colors" />
              </Link>
            ))}
            {!loading && records.length === 0 && (
              <p className="text-center text-sm text-slate-400 font-medium py-10">No recent logs found.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
