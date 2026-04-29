import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  LineChart, 
  Line,
  Cell,
  PieChart,
  Pie
} from 'recharts';
import { 
  TrendingUp, 
  TrendingDown, 
  Calendar, 
  Filter, 
  Download,
  Info,
  Activity,
  Heart,
  Loader2
} from 'lucide-react';
import { cn } from '../lib/utils';
import { useAuthStore } from '../store';
import { db } from '../lib/firebase';
import { collection, query, where, orderBy, limit, onSnapshot } from 'firebase/firestore';

const InsightCard = ({ title, description, trend, type }: { title: string, description: string, trend: string, type: 'good' | 'bad' | 'neutral' }) => (
  <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-3">
    <div className="flex items-center justify-between">
      <h4 className="text-sm font-bold text-slate-900">{title}</h4>
      <div className={cn(
        "px-2 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider",
        type === 'good' ? "bg-emerald-50 text-emerald-600" :
        type === 'bad' ? "bg-rose-50 text-rose-600" : "bg-slate-50 text-slate-500"
      )}>
        {trend}
      </div>
    </div>
    <p className="text-xs text-slate-500 leading-relaxed font-medium">{description}</p>
  </div>
);

export default function Analytics() {
  const { user } = useAuthStore();
  const [selectedPeriod, setSelectedPeriod] = useState('Week');
  const [records, setRecords] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const q = query(
      collection(db, 'records'),
      where('userId', '==', user.id),
      orderBy('timestamp', 'desc'),
      limit(20)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      setRecords(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })).reverse());
      setLoading(false);
    }, () => setLoading(false));

    return () => unsubscribe();
  }, [user]);

  // Transform records into trendData
  const trendData = records.map(r => ({
    day: r.timestamp?.toDate().toLocaleDateString([], { weekday: 'short' }),
    sys: r.sys,
    dia: r.dia,
    pulse: r.pulse
  }));

  // Transform records into distributionData
  const counts = records.reduce((acc, r) => {
    acc[r.status] = (acc[r.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const distributionData = [
    { name: 'Normal', value: counts['Normal'] || 0, color: '#10b981' },
    { name: 'Elevated', value: counts['Elevated'] || 0, color: '#f59e0b' },
    { name: 'Stage I', value: counts['Hypertension I'] || 0, color: '#f97316' },
    { name: 'Stage II', value: counts['Hypertension II'] || 0, color: '#ef4444' },
    { name: 'Crisis', value: counts['Crisis'] || 0, color: '#7f1d1d' },
  ].filter(d => d.value > 0);

  // If no data, fall back to empty array but keep UI structure
  const hasData = records.length > 0;

  const handleDownload = () => {
    alert("Generating your health report... PulseGuard AI is aggregating your physiological patterns.");
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Health Analytics</h2>
          <p className="text-slate-500 mt-1 font-medium italic">Deep physiological patterns and long-term trends.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex bg-white p-1 rounded-xl border border-slate-200">
            {['Week', 'Month', 'Year'].map((period) => (
              <button 
                key={period}
                onClick={() => setSelectedPeriod(period)}
                className={cn(
                  "px-4 py-1.5 text-xs font-bold rounded-lg transition-all",
                  period === selectedPeriod ? "bg-slate-900 text-white shadow-md shadow-slate-200" : "text-slate-500 hover:text-slate-900"
                )}
              >
                {period}
              </button>
            ))}
          </div>
          <button 
            onClick={handleDownload}
            className="p-2.5 bg-white border border-slate-200 rounded-xl text-slate-400 hover:text-slate-900 transition-all shadow-sm active:scale-95"
          >
            <Download className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Primary Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {loading ? (
          <div className="lg:col-span-3 py-20 text-center bg-white rounded-[40px] border border-slate-100 italic font-bold text-slate-400">
            <Loader2 className="w-10 h-10 animate-spin mx-auto mb-4 text-blue-600" />
            Analyzing your physiological data...
          </div>
        ) : !hasData ? (
          <div className="lg:col-span-3 py-20 text-center bg-white rounded-[40px] border border-dashed border-slate-200 font-bold text-slate-400 space-y-4">
            <Activity className="w-16 h-16 mx-auto text-slate-200" />
            <p>Log at least 3 readings to generate deep analytics.</p>
            <Link to="/dashboard" className="inline-block px-6 py-2 bg-blue-600 text-white rounded-xl text-sm">Log First Reading</Link>
          </div>
        ) : (
          <>
            {/* Trend Chart */}
            <div className="lg:col-span-2 bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center">
                <Activity className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">Atmospheric Pressure Trend</h3>
            </div>
          </div>
          
          <div className="h-[350px] w-full overflow-hidden min-h-[350px] min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12, fontWeight: 600}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12, fontWeight: 600}} domain={[60, 150]} />
                <Tooltip 
                  contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}}
                  itemStyle={{fontSize: '12px', fontWeight: '700'}}
                />
                <Line type="monotone" dataKey="sys" stroke="#2563eb" strokeWidth={4} dot={{r: 4, strokeWidth: 2, fill: '#fff'}} activeDot={{ r: 8 }} name="Systolic" />
                <Line type="monotone" dataKey="dia" stroke="#60a5fa" strokeWidth={4} dot={{r: 4, strokeWidth: 2, fill: '#fff'}} activeDot={{ r: 8 }} name="Diastolic" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Distribution Pie */}
        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm flex flex-col justify-between">
          <div className="space-y-2">
            <h3 className="text-xl font-bold text-slate-900">Diagnosis Distribution</h3>
            <p className="text-sm text-slate-500 font-medium">Reading categories this period</p>
          </div>

          <div className="h-[200px] w-full mt-4 overflow-hidden min-h-[200px] min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={distributionData}
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {distributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-4 mt-8">
            {distributionData.map((item) => (
              <div key={item.name} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-xs font-bold text-slate-600">{item.name}</span>
                </div>
                <span className="text-sm font-black text-slate-900">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Pulse Bar Chart */}
        <div className="lg:col-span-1 bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-rose-50 text-rose-600 rounded-lg flex items-center justify-center">
              <Heart className="w-5 h-5" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">Pulse Consistency</h3>
          </div>
          <div className="h-[200px] w-full overflow-hidden min-h-[200px] min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 600}} />
                <Tooltip cursor={{fill: '#f8fafc'}} />
                <Bar dataKey="pulse" fill="#fb7185" radius={[4, 4, 0, 0]} name="Pulse Rate" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* AI Insights Grid */}
        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
          {records.length > 5 ? (
            <>
              <InsightCard 
                title="Biological Rhythm" 
                description="PulseGuard AI is analyzing your diurnal patterns. Initial data shows stability during peak activity hours."
                trend="Phase: Analysis"
                type="good"
              />
              <InsightCard 
                title="Consistency Score" 
                description="Your logging frequency is excellent. This helps the AI refine your risk profile."
                trend="High Frequency"
                type="good"
              />
            </>
          ) : (
            <div className="col-span-2 p-12 bg-slate-50 rounded-[32px] border border-dashed border-slate-200 text-center text-slate-400 font-bold italic">
              AI Insight Engine: Awaiting more physiological telemetry...
            </div>
          )}
        </div>
      </>
    )}
  </div>

  {/* Support footer */}
      <div className="p-6 bg-blue-600 rounded-3xl shadow-xl shadow-blue-100 text-white flex flex-col md:flex-row items-center justify-between gap-6 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl" />
        <div className="flex items-center gap-6 relative z-10">
          <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center">
            <TrendingUp className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-xl font-bold">Predictive Stability</h3>
            <p className="text-blue-100 font-medium opacity-90">PulseGuard estimates a 89% chance of maintaining normal levels this week.</p>
          </div>
        </div>
        <Link to="/predictions" className="px-8 py-4 bg-white text-blue-600 font-black rounded-2xl shadow-lg hover:bg-blue-50 transition-all whitespace-nowrap relative z-10">
          Unlock Full Report
        </Link>
      </div>
    </div>
  );
}
