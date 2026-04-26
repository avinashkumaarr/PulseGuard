import React, { useState } from 'react';
import { 
  Bell, 
  Shield, 
  Eye, 
  Smartphone, 
  Globe, 
  MessageSquare,
  Lock,
  ChevronRight,
  Database
} from 'lucide-react';
import { cn } from '../lib/utils';
import { Link } from 'react-router-dom';

const SettingToggle = ({ label, description, defaultEnabled = false }: { label: string, description: string, defaultEnabled?: boolean }) => {
  const [enabled, setEnabled] = useState(defaultEnabled);
  return (
    <div className="flex items-center justify-between py-6 border-b border-slate-50 last:border-0 hover:bg-slate-50/50 px-4 -mx-4 rounded-2xl transition-all">
      <div className="space-y-1">
        <h4 className="text-sm font-bold text-slate-900">{label}</h4>
        <p className="text-xs text-slate-500 font-medium">{description}</p>
      </div>
      <div 
        onClick={() => setEnabled(!enabled)}
        className={cn(
        "w-12 h-6 rounded-full relative transition-colors cursor-pointer",
        enabled ? "bg-blue-600" : "bg-slate-200"
      )}>
        <div className={cn(
          "absolute top-1 w-4 h-4 bg-white rounded-full transition-transform",
          enabled ? "left-7" : "left-1"
        )} />
      </div>
    </div>
  );
};

const SettingLink = ({ label, icon: Icon, value, to = "#", onClick }: { label: string, icon: any, value?: string, to?: string, onClick?: () => void }) => {
  const content = (
    <div className="flex items-center justify-between py-6 border-b border-slate-50 last:border-0 cursor-pointer group hover:bg-slate-50/50 px-4 -mx-4 rounded-2xl transition-all">
      <div className="flex items-center gap-4">
        <div className="p-2.5 bg-slate-100 text-slate-400 group-hover:bg-white group-hover:text-blue-600 rounded-xl transition-all shadow-sm">
          <Icon className="w-5 h-5" />
        </div>
        <span className="text-sm font-bold text-slate-900">{label}</span>
      </div>
      <div className="flex items-center gap-2">
        {value && <span className="text-xs font-bold text-slate-400">{value}</span>}
        <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-slate-900 transition-all" />
      </div>
    </div>
  );

  if (onClick) {
    return <div onClick={onClick}>{content}</div>;
  }

  return <Link to={to}>{content}</Link>;
};

export default function Settings() {
  const [isDevMode, setIsDevMode] = useState(false);
  const handleAction = (action: string) => {
    alert(`PulseGuard Security: ${action}. This feature is maintained by our health compliance team.`);
  };

  const debugLogs = [
    { time: '12:04:22', event: 'API_HANDSHAKE_SUCCESS', status: 'OK' },
    { time: '12:03:15', event: 'GEMINI_SYNC_COMPLETE', status: '200' },
    { time: '12:01:02', event: 'ENCRYPTION_LAYER_ACTIVE', status: 'AES256' },
    { time: '11:59:45', event: 'HEART_RATE_STREAM', status: 'ACTIVE' },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-10">
      <div className="space-y-2">
        <h2 className="text-3xl font-black text-slate-900 tracking-tight">Preferences</h2>
        <p className="text-slate-500 font-medium italic">Configure how PulseGuard AI interacts with your life.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 text-slate-900">
        {/* Notifications Section */}
        <div className="space-y-6">
          <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] px-2 flex items-center gap-2">
            <Bell className="w-3.5 h-3.5" />
            Communication
          </h3>
          <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm">
            <SettingToggle 
              label="Real-time Alerts" 
              description="Receive push notifications for critical BP spikes."
              defaultEnabled={true}
            />
            <SettingToggle 
              label="AI Insights" 
              description="Weekly analysis and predictive health reports."
              defaultEnabled={true}
            />
            <SettingToggle 
              label="Caretaker SMS" 
              description="Automatically text contacts during emergencies."
              defaultEnabled={true}
            />
          </div>
        </div>

        {/* Security Section */}
        <div className="space-y-6">
          <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] px-2 flex items-center gap-2">
            <Lock className="w-3.5 h-3.5" />
            Privacy & Security
          </h3>
          <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm">
            <SettingLink label="Health Profile" to="/profile" icon={Smartphone} value="Edit" />
            <SettingLink label="Two-Factor Auth" icon={Shield} value="Off" onClick={() => handleAction("Initializing 2FA Setup")} />
            <SettingLink label="Data Encryption" icon={Eye} value="AES-256" onClick={() => handleAction("Rotating Encryption Keys")} />
          </div>
        </div>

        {/* App Settings Section */}
        <div className="space-y-6">
          <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] px-2 flex items-center gap-2">
            <Database className="w-3.5 h-3.5" />
            System & Data
          </h3>
          <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm">
            <SettingLink label="Cloud Sync" icon={Globe} value="Connected" onClick={() => handleAction("Manual Sync in progress")} />
            <SettingLink label="Emergency Hub" to="/emergency" icon={Bell} value="Active" />
            <SettingLink label="Logs History" to="/records" icon={Database} value="Daily" />
          </div>
        </div>

        {/* Help Section */}
        <div className="space-y-6">
          <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] px-2 flex items-center gap-2">
            <MessageSquare className="w-3.5 h-3.5" />
            Support
          </h3>
          <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm">
            <SettingLink label="Health Analytics" to="/analytics" icon={MessageSquare} />
            <SettingLink label="Report a Bug" icon={Bell} onClick={() => handleAction("Bug report form being initialized")} />
            <SettingLink label="Privacy Policy" icon={Lock} onClick={() => handleAction("Opening Privacy Policy Portal")} />
          </div>
        </div>
      </div>

      <div className="p-8 bg-slate-50 border border-slate-200 rounded-[32px] flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="text-center md:text-left">
          <h4 className="font-bold text-slate-900">Developer Mode</h4>
          <p className="text-xs text-slate-500 font-medium">Access low-level API logs and debugging tools.</p>
        </div>
        <button 
          onClick={() => setIsDevMode(!isDevMode)}
          className={cn(
            "px-6 py-2.5 font-bold text-xs rounded-xl transition-all shadow-sm border",
            isDevMode ? "bg-slate-900 text-white border-slate-900" : "bg-white border-slate-200 text-slate-600 hover:bg-slate-100"
          )}>
          {isDevMode ? 'Debugging Active' : 'Enable Debugging'}
        </button>
      </div>

      {isDevMode && (
        <div className="bg-slate-900 p-8 rounded-[32px] shadow-2xl space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <h3 className="text-white font-black text-xs uppercase tracking-widest flex items-center gap-2">
              <Database className="w-4 h-4 text-emerald-400" /> System Debug Console
            </h3>
            <span className="text-[10px] text-emerald-400 font-bold animate-pulse">● LIVE STREAMING</span>
          </div>
          <div className="space-y-2 font-mono text-[10px]">
            {debugLogs.map((log, i) => (
              <div key={i} className="flex items-center gap-3 py-1 group">
                <span className="text-slate-600">[{log.time}]</span>
                <span className="text-blue-400 font-bold">{log.event}</span>
                <span className="text-slate-500 ml-auto group-hover:text-emerald-400 transition-colors uppercase">{log.status}</span>
              </div>
            ))}
          </div>
          <div className="pt-4 flex gap-2">
            <button className="px-4 py-2 bg-slate-800 text-slate-400 rounded-lg font-bold text-[10px] hover:text-white transition-colors">CLEAR LOGS</button>
            <button className="px-4 py-2 bg-slate-800 text-slate-400 rounded-lg font-bold text-[10px] hover:text-white transition-colors">DUMP STATE</button>
          </div>
        </div>
      )}
    </div>
  );
}
