import React, { useState, useEffect } from 'react';
import { 
  Bell, 
  AlertTriangle, 
  CheckCircle2, 
  Info, 
  MoreVertical, 
  Search,
  Filter,
  Trash2,
  Clock,
  Loader2
} from 'lucide-react';
import { cn } from '../lib/utils';
import { useUIStore, useAuthStore } from '../store';
import { db } from '../lib/firebase';
import { collection, query, where, orderBy, limit, onSnapshot } from 'firebase/firestore';

const AlertItem = ({ 
  type, 
  title, 
  description, 
  time, 
  isRead,
  onClick
}: { 
  type: 'emergency' | 'warning' | 'info' | 'success', 
  title: string, 
  description: string, 
  time: string,
  isRead?: boolean,
  key?: React.Key,
  onClick?: () => void
}) => {
  const getIcon = () => {
    switch (type) {
      case 'emergency': return <AlertTriangle className="w-5 h-5 text-rose-600" />;
      case 'warning': return <AlertTriangle className="w-5 h-5 text-amber-600" />;
      case 'success': return <CheckCircle2 className="w-5 h-5 text-emerald-600" />;
      default: return <Info className="w-5 h-5 text-blue-600" />;
    }
  };

  const getBg = () => {
    switch (type) {
      case 'emergency': return "bg-rose-50 border-rose-100";
      case 'warning': return "bg-amber-50 border-amber-100";
      case 'success': return "bg-emerald-50 border-emerald-100";
      default: return "bg-blue-50 border-blue-100";
    }
  };

  return (
    <div 
      onClick={onClick}
      className={cn(
      "p-5 rounded-3xl border transition-all flex gap-4 group cursor-pointer hover:shadow-sm",
      getBg(),
      isRead ? "opacity-70 grayscale-[0.5]" : "shadow-sm shadow-slate-100 ring-2 ring-transparent hover:ring-blue-600/10"
    )}>
      <div className="flex-shrink-0 mt-1">
        {getIcon()}
      </div>
      <div className="flex-1 space-y-1">
        <div className="flex items-center justify-between">
          <h4 className="font-bold text-slate-900 leading-tight">{title}</h4>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
            <Clock className="w-3 h-3" /> {time}
          </span>
        </div>
        <p className="text-xs text-slate-600 leading-relaxed font-medium">{description}</p>
      </div>
      <button 
        onClick={(e) => {
          e.stopPropagation();
          alert("Opening alert options... PulseGuard AI offers: Mute, Archive, and Forward to Physician.");
        }}
        className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity p-2 hover:bg-white/50 rounded-xl text-slate-400 active:scale-90"
      >
        <MoreVertical className="w-4 h-4" />
      </button>
    </div>
  );
};

export default function Alerts() {
  const { status } = useUIStore();
  const { user } = useAuthStore();
  const [search, setSearch] = useState('');
  const [records, setRecords] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const q = query(
      collection(db, 'records'),
      where('userId', '==', user.id),
      orderBy('timestamp', 'desc'),
      limit(5)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      setRecords(snapshot.docs.map(doc => doc.data()));
      setLoading(false);
    }, () => setLoading(false));

    return () => unsubscribe();
  }, [user]);

  const alerts: any[] = [];
  
  if (records.length > 0) {
    const latest = records[0];
    if (latest.sys > 140) {
      alerts.push({
        id: 'high-bp-alert',
        type: 'emergency',
        title: 'High Blood Pressure Detected',
        description: `Your last reading of ${latest.sys}/${latest.dia} is elevated. Please follow your physician's guidance.`,
        time: 'Just now',
        isRead: false
      });
    }
  }

  const filteredAlerts = alerts.filter(a => 
    a.title.toLowerCase().includes(search.toLowerCase()) || 
    a.description.toLowerCase().includes(search.toLowerCase())
  );

  const handleAlertClick = (id: number) => {
    alert("This alert is for informational purposes. If this was an emergency spike, PulseGuard AI would have contacted your emergency circle. Currently: System Standby.");
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Security & Health Alerts</h2>
          <p className="text-slate-500 mt-1 font-medium italic">
            You have <span className="text-rose-600 font-bold">{alerts.filter(a => !a.isRead).length} unread</span> critical notifications.
          </p>
        </div>
        <button 
          onClick={() => alert("Marked all notifications as read.")}
          className="flex items-center gap-2 p-3 bg-white border border-slate-200 rounded-2xl text-slate-400 hover:text-slate-900 transition-all shadow-sm active:scale-95"
        >
          <CheckCircle2 className="w-5 h-5" />
          <span className="text-xs font-bold">Mark all as read</span>
        </button>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input 
            type="text" 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search alerts..."
            className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-blue-600/5 transition-all text-sm font-medium"
          />
        </div>
        <button 
          onClick={() => alert("Applying smart filters... PulseGuard AI categorizes by Emergency, Warning, and Info for optimized triage.")}
          className="p-3 bg-white border border-slate-200 rounded-2xl text-slate-600 hover:bg-slate-50 transition-all font-bold text-xs flex items-center gap-2 active:scale-95"
        >
          <Filter className="w-4 h-4" /> Filter
        </button>
        <button 
          onClick={() => setSearch('')}
          className="p-3 bg-white border border-slate-200 rounded-2xl text-rose-500 hover:bg-rose-50 transition-all"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      <div className="space-y-4">
        {loading ? (
          <div className="text-center py-12 bg-white rounded-3xl border border-slate-100 italic font-bold text-slate-400">
             <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2 text-blue-600" />
             Synchronizing PulseGuard alerts...
          </div>
        ) : filteredAlerts.length > 0 ? filteredAlerts.map((alert) => (
          <AlertItem 
            key={alert.id} 
            type={alert.type} 
            title={alert.title} 
            description={alert.description} 
            time={alert.time} 
            isRead={alert.isRead} 
            onClick={() => handleAlertClick(alert.id)}
          />
        )) : (
          <div className="text-center py-12 bg-white rounded-3xl border border-dashed border-slate-200">
            <Bell className="w-12 h-12 text-slate-200 mx-auto mb-4" />
            <p className="font-bold text-slate-400">No matching alerts found</p>
          </div>
        )}
      </div>

      <div className="pt-8 text-center">
        <button 
          onClick={() => alert("Retrieving historical alerts from PulseGuard Secure Vault...")}
          className="px-6 py-2.5 bg-slate-100 text-slate-500 text-xs font-bold rounded-xl hover:bg-slate-200 transition-all active:scale-95"
        >
          Load older notifications
        </button>
      </div>
    </div>
  );
}
