import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronRight, ChevronLeft, Heart, User as UserIcon, Shield, Activity, Bell } from 'lucide-react';
import { cn } from '../lib/utils';
import { useAuthStore } from '../store';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { doc, setDoc } from 'firebase/firestore';

const steps = [
  { id: 'profile', title: 'Personal Profile', icon: UserIcon },
  { id: 'medical', title: 'Medical Context', icon: Activity },
  { id: 'emergency', title: 'Rescue & Contacts', icon: Shield },
  { id: 'preferences', title: 'Preferences', icon: Bell },
];

export default function Onboarding() {
  const [currentStep, setCurrentStep] = useState(0);
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();
  const { setUser, user } = useAuthStore();
  const [formData, setFormData] = useState({
    age: '28',
    gender: 'Male',
    height: '175',
    weight: '70',
    bloodType: 'O Positive',
    allergies: 'None',
    conditions: 'None',
    smoking: 'Non-smoker',
    caretakerName: '',
    caretakerPhone: '',
    primaryHospital: '',
    emergencySmsEnabled: true,
    avatar: user?.avatar || ''
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleComplete = async () => {
    if (user && !saving) {
      setSaving(true);
      const path = `users/${user.id}`;
      try {
        const fullUserData = { 
          ...user, 
          ...formData,
          onboarding_complete: true,
          updatedAt: new Date().toISOString()
        };
        
        await setDoc(doc(db, 'users', user.id), fullUserData);
        
        setUser(fullUserData as any);
        navigate('/dashboard');
      } catch (error) {
        console.error("Failed to save onboarding data", error);
        handleFirestoreError(error, OperationType.WRITE, path);
      } finally {
        setSaving(false);
      }
    }
  };

  const next = () => {
    if (currentStep < steps.length - 1) setCurrentStep(currentStep + 1);
    else handleComplete();
  };

  const prev = () => {
    if (currentStep > 0) setCurrentStep(currentStep - 1);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-8 text-slate-900">
      <div className="max-w-2xl w-full bg-white rounded-3xl shadow-xl shadow-slate-200/50 p-12 border border-slate-100 flex flex-col gap-12">
        
        {/* Progress Bar */}
        <div className="flex justify-between items-center relative">
          <div className="absolute top-1/2 left-0 w-full h-1 bg-slate-100 -translate-y-1/2 z-0" />
          <div 
            className="absolute top-1/2 left-0 h-1 bg-blue-600 -translate-y-1/2 z-0 transition-all duration-500" 
            style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
          />
          {steps.map((step, idx) => {
            const Icon = step.icon;
            const active = idx <= currentStep;
            const current = idx === currentStep;
            return (
              <div key={idx} className="relative z-10 flex flex-col items-center gap-3">
                <div className={cn(
                  "w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500",
                  current ? "bg-blue-600 text-white shadow-lg shadow-blue-200 scale-110" :
                  active ? "bg-blue-100 text-blue-600" : "bg-white border-2 border-slate-100 text-slate-300"
                )}>
                  <Icon className="w-6 h-6" />
                </div>
                <span className={cn(
                  "text-[10px] font-bold uppercase tracking-widest absolute -bottom-8 whitespace-nowrap transition-colors duration-500",
                  current ? "text-blue-600" : "text-slate-400"
                )}>
                  {step.title}
                </span>
              </div>
            );
          })}
        </div>

        {/* Content Area */}
        <div className="flex-1 mt-8 min-h-[350px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              <div className="text-center">
                <h2 className="text-3xl font-black text-slate-900 tracking-tight">{steps[currentStep].title}</h2>
                <p className="text-slate-500 mt-2 font-medium italic">Help PulseGuard AI understand your biological environment.</p>
              </div>

              {currentStep === 0 && (
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Age</label>
                    <input 
                      type="number" 
                      value={formData.age}
                      onChange={(e) => handleInputChange('age', e.target.value)}
                      className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-blue-600/5 transition-all text-sm font-bold" 
                      placeholder="28" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Gender</label>
                    <select 
                      value={formData.gender}
                      onChange={(e) => handleInputChange('gender', e.target.value)}
                      className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-blue-600/5 transition-all text-sm font-bold"
                    >
                      <option>Male</option>
                      <option>Female</option>
                      <option>Other</option>
                    </select>
                  </div>
                  <div className="col-span-2 space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Profile Photo URL (Optional)</label>
                    <input 
                      type="text" 
                      value={formData.avatar}
                      onChange={(e) => handleInputChange('avatar', e.target.value)}
                      className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-blue-600/5 transition-all text-sm font-bold" 
                      placeholder="https://images.unsplash.com/photo..." 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Height (cm)</label>
                    <input 
                      type="number" 
                      value={formData.height}
                      onChange={(e) => handleInputChange('height', e.target.value)}
                      className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-blue-600/5 transition-all text-sm font-bold" 
                      placeholder="175" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Weight (kg)</label>
                    <input 
                      type="number" 
                      value={formData.weight}
                      onChange={(e) => handleInputChange('weight', e.target.value)}
                      className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-blue-600/5 transition-all text-sm font-bold" 
                      placeholder="70" 
                    />
                  </div>
                </div>
              )}

              {currentStep === 1 && (
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Blood Type</label>
                    <select 
                      value={formData.bloodType}
                      onChange={(e) => handleInputChange('bloodType', e.target.value)}
                      className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-blue-600/5 transition-all text-sm font-bold"
                    >
                      <option>A Positive</option>
                      <option>A Negative</option>
                      <option>B Positive</option>
                      <option>B Negative</option>
                      <option>O Positive</option>
                      <option>O Negative</option>
                      <option>AB Positive</option>
                      <option>AB Negative</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Smoking Status</label>
                    <select 
                      value={formData.smoking}
                      onChange={(e) => handleInputChange('smoking', e.target.value)}
                      className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-blue-600/5 transition-all text-sm font-bold"
                    >
                      <option>Non-smoker</option>
                      <option>Occasional</option>
                      <option>Regular</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Chronic Conditions</label>
                    <input 
                      type="text" 
                      value={formData.conditions}
                      onChange={(e) => handleInputChange('conditions', e.target.value)}
                      className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-blue-600/5 transition-all text-sm font-bold" 
                      placeholder="e.g. Diabetes, Asthma" 
                    />
                  </div>
                  <div className="space-y-2 h-full">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Allergies</label>
                    <input 
                      type="text" 
                      value={formData.allergies}
                      onChange={(e) => handleInputChange('allergies', e.target.value)}
                      className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-blue-600/5 transition-all text-sm font-bold" 
                      placeholder="e.g. Peanuts, Penicillin" 
                    />
                  </div>
                </div>
              )}

              {currentStep === 2 && (
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Primary Hospital</label>
                    <input 
                      type="text" 
                      value={formData.primaryHospital}
                      onChange={(e) => handleInputChange('primaryHospital', e.target.value)}
                      className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-blue-600/5 transition-all text-sm font-bold" 
                      placeholder="e.g. City General Hospital" 
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Emergency Contact Name</label>
                      <input 
                        type="text" 
                        value={formData.caretakerName}
                        onChange={(e) => handleInputChange('caretakerName', e.target.value)}
                        className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-blue-600/5 transition-all text-sm font-bold" 
                        placeholder="John Doe" 
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Emergency Mobile</label>
                      <input 
                        type="tel" 
                        value={formData.caretakerPhone}
                        onChange={(e) => handleInputChange('caretakerPhone', e.target.value)}
                        className="w-full px-5 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-blue-600/5 transition-all text-sm font-bold" 
                        placeholder="+91 XXXXX XXXXX" 
                      />
                    </div>
                  </div>
                </div>
              )}

              {currentStep === 3 && (
                <div className="space-y-6">
                  <div className="p-6 bg-blue-50/50 rounded-3xl border border-blue-100">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-bold text-slate-900">Emergency SMS Alerts</p>
                        <p className="text-xs text-slate-500 font-medium">Auto-ping {formData.caretakerName || 'emergency contact'} if critical BP is detected.</p>
                      </div>
                      <button 
                        onClick={() => handleInputChange('emergencySmsEnabled', String(!formData.emergencySmsEnabled))}
                        className={cn(
                          "w-12 h-6 rounded-full transition-colors relative",
                          formData.emergencySmsEnabled ? "bg-blue-600" : "bg-slate-200"
                        )}
                      >
                        <div className={cn(
                          "absolute top-1 w-4 h-4 bg-white rounded-full transition-all",
                          formData.emergencySmsEnabled ? "right-1" : "left-1"
                        )} />
                      </button>
                    </div>
                  </div>
                  <div className="p-8 bg-slate-900 rounded-[32px] text-white">
                    <p className="text-sm font-bold leading-relaxed italic text-white/80">
                      "PulseGuard AI will now secure your health telemetry and only share it with {formData.primaryHospital || 'authorized facilities'} during emergencies."
                    </p>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Footer Actions */}
        <div className="flex justify-between items-center pt-8 border-t border-slate-100">
          <button 
            onClick={prev}
            disabled={currentStep === 0}
            className="flex items-center gap-2 px-6 py-3 text-slate-600 font-bold disabled:opacity-0 transition-all hover:text-slate-900"
          >
            <ChevronLeft className="w-5 h-5" />
            Back
          </button>
          <button 
            onClick={next}
            className="group flex items-center gap-3 px-10 py-4 bg-slate-900 text-white rounded-2xl font-bold shadow-xl shadow-slate-200 hover:bg-black transition-all active:scale-[0.98]"
          >
            {currentStep === steps.length - 1 ? 'Start PulseGuard' : 'Next Step'}
            <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
}
