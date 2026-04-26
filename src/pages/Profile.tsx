import React, { useState } from 'react';
import { 
  User, 
  Mail, 
  Droplets, 
  AlertCircle, 
  Activity,
  Edit,
  ShieldCheck,
  ChevronRight,
  Save,
  X,
  Calendar
} from 'lucide-react';
import { useAuthStore } from '../store';
import { cn } from '../lib/utils';
import { Link } from 'react-router-dom';

const InfoRow = ({ label, value, unit, icon: Icon, isEditing, onChange }: { label: string, value: string, unit?: string, icon: any, isEditing?: boolean, onChange?: (val: string) => void }) => (
  <div className="flex items-center justify-between py-4 border-b border-slate-50 last:border-0 group cursor-default">
    <div className="flex items-center gap-3">
      <div className="p-2 bg-slate-50 text-slate-400 rounded-lg group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
        <Icon className="w-4 h-4" />
      </div>
      <span className="text-sm font-bold text-slate-500 uppercase tracking-widest text-[10px]">{label}</span>
    </div>
    <div className="flex items-center gap-1.5">
      {isEditing ? (
        <input 
          type="text" 
          value={value} 
          onChange={(e) => onChange?.(e.target.value)}
          className="text-right text-sm font-bold text-blue-600 bg-blue-50/50 px-2 py-1 rounded outline-none focus:ring-4 focus:ring-blue-100/50 min-w-[60px]"
        />
      ) : (
        <span className="text-sm font-bold text-slate-900">{value}</span>
      )}
      {unit && <span className="text-[10px] font-bold text-slate-400 uppercase">{unit}</span>}
    </div>
  </div>
);

export default function Profile() {
  const { user, setUser } = useAuthStore();
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    age: (user as any)?.age || '32',
    height: (user as any)?.height || '182',
    weight: (user as any)?.weight || '78',
    bloodType: (user as any)?.bloodType || 'A+',
    allergies: (user as any)?.allergies || 'Peanuts'
  });

  const handleSave = () => {
    setUser({ ...user, ...editData } as any);
    setIsEditing(false);
    alert("Profile changes synchronized with PulseGuard Cloud.");
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Hero Profile Section */}
      <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl group-hover:bg-blue-600/10 transition-colors duration-700" />
        
        <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
          <div className="relative">
            <div className="w-32 h-32 bg-slate-100 rounded-[32px] flex items-center justify-center border-4 border-white shadow-xl shadow-slate-200 overflow-hidden">
              <User className="w-16 h-16 text-slate-300" />
            </div>
            <button 
              onClick={() => isEditing ? handleSave() : setIsEditing(true)}
              className={cn(
                "absolute -bottom-2 -right-2 p-2.5 rounded-xl shadow-lg transition-all border-4 border-white",
                isEditing ? "bg-emerald-600 text-white hover:bg-emerald-700" : "bg-blue-600 text-white hover:bg-blue-700"
              )}
            >
              {isEditing ? <Save className="w-4 h-4" /> : <Edit className="w-4 h-4" />}
            </button>
            {isEditing && (
              <button 
                onClick={() => setIsEditing(false)}
                className="absolute -top-2 -right-2 p-2.5 bg-slate-100 text-slate-400 rounded-xl shadow-lg border-4 border-white hover:bg-slate-200"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          
          <div className="text-center md:text-left space-y-2">
            <div className="flex items-center justify-center md:justify-start gap-3">
              <h2 className="text-4xl font-black text-slate-900 tracking-tight">{user?.name}</h2>
              <div className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 border border-emerald-100">
                <ShieldCheck className="w-3 h-3" />
                Verified
              </div>
            </div>
            <p className="text-slate-500 font-medium flex items-center justify-center md:justify-start gap-2">
              <Mail className="w-4 h-4" /> {user?.email}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Personal Details */}
        <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm space-y-6">
          <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Activity className="w-5 h-5 text-blue-600" />
            Biological Data
          </h3>
          <div className="flex flex-col">
            <InfoRow label="Age" value={editData.age} unit="yrs" isEditing={isEditing} onChange={(val) => setEditData(d => ({...d, age: val}))} icon={Calendar} />
            <InfoRow label="Gender" value={(user as any)?.gender || 'Male'} icon={User} />
            <InfoRow label="Height" value={editData.height} unit="cm" isEditing={isEditing} onChange={(val) => setEditData(d => ({...d, height: val}))} icon={Activity} />
            <InfoRow label="Weight" value={editData.weight} unit="kg" isEditing={isEditing} onChange={(val) => setEditData(d => ({...d, weight: val}))} icon={Activity} />
          </div>
        </div>

        {/* Medical ID Summary */}
        <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm space-y-6">
          <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-rose-600" />
            Medical History
          </h3>
          <div className="flex flex-col">
            <InfoRow label="Blood Type" value={editData.bloodType} isEditing={isEditing} onChange={(val) => setEditData(d => ({...d, bloodType: val}))} icon={Droplets} />
            <InfoRow label="Allergies" value={editData.allergies} isEditing={isEditing} onChange={(val) => setEditData(d => ({...d, allergies: val}))} icon={AlertCircle} />
            <InfoRow label="Status" value="System Live" icon={Activity} />
            <InfoRow label="Last Checkup" value="Jan 12, 2024" icon={Calendar} />
          </div>
        </div>
      </div>

      <Link to="/analytics" className="bg-slate-900 p-8 rounded-[40px] shadow-2xl shadow-slate-200 text-white overflow-hidden relative group cursor-pointer block">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-transparent pointer-events-none" />
        <div className="flex items-center justify-between relative z-10">
          <div className="space-y-2">
            <h3 className="text-2xl font-bold">Health History</h3>
            <p className="text-slate-400 text-sm font-medium">View detailed medical background and previous clinical reports.</p>
          </div>
          <ChevronRight className="w-8 h-8 text-slate-600 group-hover:text-white transition-all transform group-hover:translate-x-2" />
        </div>
      </Link>
    </div>
  );
}
