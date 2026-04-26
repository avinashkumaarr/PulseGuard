import React from 'react';
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
  Heart
} from 'lucide-react';
import { cn } from '../lib/utils';

const trendData = [
  { day: 'Mon', sys: 120, dia: 80, pulse: 72 },
  { day: 'Tue', sys: 125, dia: 82, pulse: 75 },
  { day: 'Wed', sys: 122, dia: 79, pulse: 70 },
  { day: 'Thu', sys: 118, dia: 78, pulse: 71 },
  { day: 'Fri', sys: 132, dia: 88, pulse: 78 },
  { day: 'Sat', sys: 128, dia: 84, pulse: 74 },
  { day: 'Sun', sys: 121, dia: 81, pulse: 72 },
];

const distributionData = [
  { name: 'Normal', value: 65, color: '#10b981' },
  { name: 'Elevated', value: 25, color: '#f59e0b' },
  { name: 'Dangerous', value: 10, color: '#ef4444' },
];

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
  const [selectedPeriod, setSelectedPeriod] = React.useState('Week');

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
          <InsightCard 
            title="Morning Pattern" 
            description="Your systolic reading is typically 8% higher between 6 AM and 9 AM. Consider adjusting your medication timing."
            trend="Attention Required"
            type="neutral"
          />
          <InsightCard 
            title="Activity Correlation" 
            description="High correlation (0.85) between evening activity and resting pulse. Your recovery rate is improving."
            trend="+12% Efficiency"
            type="good"
          />
          <InsightCard 
            title="Sodium Sensitivity" 
            description="Analysis suggests peak readings often follow high-sodium days by 14 hours. Predicted risk: Medium."
            trend="Risk: Low"
            type="good"
          />
          <InsightCard 
            title="Consistency Score" 
            description="Your logging frequency has dropped by 22%. Regular data is crucial for accurate AI predictions."
            trend="-22% Frequency"
            type="bad"
          />
        </div>
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
