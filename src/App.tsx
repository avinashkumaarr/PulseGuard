import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Link, useLocation } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { 
  Activity, 
  LayoutDashboard, 
  ClipboardList, 
  BarChart3, 
  ShieldAlert, 
  Bell, 
  Settings, 
  User as UserIcon, 
  LifeBuoy, 
  LogOut,
  AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuthStore, useUIStore } from './store';
import { auth, db } from './lib/firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { cn } from './lib/utils';

// Pages (to be implemented)
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Records from './pages/Records';
import Analytics from './pages/Analytics';
import Predictions from './pages/Predictions';
import Alerts from './pages/Alerts';
import Emergency from './pages/Emergency';
import Profile from './pages/Profile';
import SettingsPage from './pages/Settings';
import Onboarding from './pages/Onboarding';

const queryClient = new QueryClient();

const StatusBadge = () => {
  const { status } = useUIStore();
  const getStatusColor = () => {
    switch (status.latestStatus) {
      case 'Normal': return 'bg-emerald-500';
      case 'Elevated': return 'bg-amber-500';
      case 'Hypertension I': return 'bg-orange-500';
      case 'Hypertension II': return 'bg-rose-500';
      case 'Crisis': return 'bg-red-600';
      default: return 'bg-emerald-500';
    }
  };

  return (
    <div className="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 rounded-full shadow-sm">
      <div className={cn("w-2 h-2 rounded-full animate-pulse", getStatusColor())} />
      <span className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
        {status.latestStatus === 'Ready' ? 'Monitoring' : status.latestStatus}
      </span>
    </div>
  );
};

const Navigation = () => {
  const location = useLocation();
  const { status } = useUIStore();
  const { user } = useAuthStore();

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Records', path: '/records', icon: ClipboardList },
    { name: 'Analytics', path: '/analytics', icon: BarChart3 },
    { name: 'AI Health', path: '/predictions', icon: ShieldAlert },
    { name: 'Alerts', path: '/alerts', icon: Bell, badge: status.unreadAlertsCount },
    { name: 'Emergency', path: '/emergency', icon: LifeBuoy, urgent: true },
  ];

  return (
    <nav className="fixed left-0 top-0 h-screen w-64 bg-slate-50 border-r border-slate-200 p-6 flex flex-col gap-8">
      <div className="flex items-center gap-3 px-2">
        <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-200">
          <Activity className="text-white w-6 h-6" />
        </div>
        <div>
          <h1 className="font-bold text-slate-900 text-lg leading-none">PulseGuard</h1>
          <span className="text-[10px] text-slate-500 font-medium uppercase tracking-widest tracking-widest">Health AI</span>
        </div>
      </div>

      <div className="flex flex-col gap-1 flex-1">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={cn(
              "flex items-center justify-between px-3 py-2.5 rounded-lg transition-all duration-200 group",
              location.pathname === item.path 
                ? "bg-blue-600 text-white shadow-md shadow-blue-100" 
                : "text-slate-600 hover:bg-slate-200/50 hover:text-slate-900",
              item.urgent && "text-rose-600 font-semibold"
            )}
          >
            <div className="flex items-center gap-3">
              <item.icon className={cn(
                "w-5 h-5",
                location.pathname === item.path ? "text-white" : item.urgent ? "text-rose-500" : "text-slate-400 group-hover:text-slate-600"
              )} />
              <span className="text-sm font-medium">{item.name}</span>
            </div>
            {item.badge && item.badge > 0 && (
              <span className="bg-rose-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                {item.badge}
              </span>
            )}
          </Link>
        ))}
      </div>

      <div className="pt-6 border-t border-slate-200 flex flex-col gap-1">
        <Link to="/profile" className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-600 hover:bg-slate-200/50 hover:text-slate-900">
          <div className="w-5 h-5 rounded-full overflow-hidden bg-slate-100 flex items-center justify-center">
            {user?.avatar ? (
              <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
            ) : (
              <UserIcon className="w-4 h-4 text-slate-400" />
            )}
          </div>
          <span className="text-sm font-medium">Profile</span>
        </Link>
        <Link to="/settings" className="flex items-center gap-3 px-3 py-2 rounded-lg text-slate-600 hover:bg-slate-200/50 hover:text-slate-900">
          <Settings className="w-5 h-5 text-slate-400" />
          <span className="text-sm font-medium">Settings</span>
        </Link>
        <button 
          onClick={() => signOut(auth)}
          className="flex items-center gap-3 px-3 py-2 rounded-lg text-rose-600 hover:bg-rose-50 hover:text-rose-700 transition-colors"
        >
          <LogOut className="w-5 h-5" />
          <span className="text-sm font-medium">Log out</span>
        </button>
      </div>
    </nav>
  );
};

const Header = () => {
  const { user } = useAuthStore();
  return (
    <header className="sticky top-0 z-30 h-20 bg-white/80 backdrop-blur-md border-bottom border-slate-100 px-8 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <StatusBadge />
      </div>
      
      <Link to="/profile" className="flex items-center gap-4 hover:opacity-80 transition-opacity">
        <div className="text-right">
          <p className="text-sm font-semibold text-slate-900">{user?.name || 'User'}</p>
          <p className="text-xs text-slate-500">{user?.email}</p>
        </div>
        <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center border-2 border-white shadow-sm overflow-hidden">
          {user?.avatar ? (
            <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
          ) : (
            <UserIcon className="w-6 h-6 text-slate-400" />
          )}
        </div>
      </Link>
    </header>
  );
};

const ProtectedLayout = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuthStore();
  const location = useLocation();

  if (!user) {
    console.log("[PulseGuard Auth] No user found, redirecting to login");
    return <Navigate to="/login" replace />;
  }

  if (!user.onboarding_complete && location.pathname !== '/onboarding') {
    console.log("[PulseGuard Auth] Onboarding incomplete, redirecting");
    return <Navigate to="/onboarding" replace />;
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Navigation />
      <div className="pl-64">
        <Header />
        <main className="p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
      <Link 
        to="/emergency"
        className={cn(
          "fixed bottom-8 right-8 w-14 h-14 text-white rounded-full flex items-center justify-center shadow-2xl transition-all hover:scale-110 active:scale-95 z-50 group",
          location.pathname === '/emergency'
            ? "bg-emerald-600 shadow-emerald-200"
            : "bg-rose-600 shadow-rose-200 hover:bg-rose-700"
        )}
      >
        <AlertCircle className="w-7 h-7" />
        <span className="absolute right-full mr-4 px-3 py-1.5 bg-slate-900 text-white text-xs font-bold rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-xl">
          {location.pathname === '/emergency' ? 'EMERGENCY HUB' : 'EMERGENCY ALERT'}
        </span>
      </Link>
    </div>
  );
};

export default function App() {
  const { user, setUser } = useAuthStore();

  useEffect(() => {
    console.log("[PulseGuard Auth] Initializing auth listeners at root...");
    
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      console.log(`[PulseGuard Auth] Auth event: ${firebaseUser ? 'SIGNED_IN' : 'SIGNED_OUT'}`);
      if (firebaseUser) {
        // Try to fetch profile from Firestore
        const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
        const userData = userDoc.exists() ? userDoc.data() : {};

        setUser({
          id: firebaseUser.uid,
          email: firebaseUser.email!,
          name: firebaseUser.displayName || (userData as any)?.name || 'User',
          onboarding_complete: (userData as any)?.onboarding_complete || false,
          ...userData
        } as any);
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, [setUser]);

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          
          <Route path="/*" element={
            <ProtectedLayout>
              <Routes>
                <Route path="/onboarding" element={<Onboarding />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/records" element={<Records />} />
                <Route path="/analytics" element={<Analytics />} />
                <Route path="/predictions" element={<Predictions />} />
                <Route path="/alerts" element={<Alerts />} />
                <Route path="/emergency" element={<Emergency />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/settings" element={<SettingsPage />} />
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
              </Routes>
            </ProtectedLayout>
          } />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}
