import React, { useState } from 'react';
import { 
  Phone, 
  MapPin, 
  AlertCircle, 
  User, 
  ShieldAlert, 
  ChevronRight,
  LifeBuoy,
  CheckCircle2
} from 'lucide-react';
import { cn } from '../lib/utils';

const CaretakerCard = ({ caretaker }: { caretaker: any, key?: any }) => (
  <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center justify-between group hover:shadow-md transition-all">
    <div className="flex items-center gap-4">
      <div className="w-14 h-14 bg-slate-50 text-slate-400 rounded-2xl flex items-center justify-center border border-slate-100 overflow-hidden">
        {caretaker.avatar ? (
          <img src={caretaker.avatar} alt={caretaker.name} className="w-full h-full object-cover" />
        ) : (
          <User className="w-6 h-6" />
        )}
      </div>
      <div>
        <div className="flex items-center gap-2">
          <h4 className="font-bold text-slate-900">{caretaker.name}</h4>
          {caretaker.is_primary && (
            <span className="text-[8px] font-black uppercase tracking-widest px-2 py-0.5 bg-rose-100 text-rose-600 rounded-full">Primary</span>
          )}
        </div>
        <p className="text-xs text-slate-500 font-medium">{caretaker.relationship} • {caretaker.phone}</p>
      </div>
    </div>
    <div className="flex gap-2">
      <a 
        href={`tel:${caretaker.phone}`}
        className="p-3 bg-emerald-50 text-emerald-600 rounded-xl hover:bg-emerald-100 transition-colors"
      >
        <Phone className="w-5 h-5" />
      </a>
    </div>
  </div>
);

const HospitalCard = ({ hospital }: { hospital: any, key?: any }) => (
  <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center justify-between group hover:shadow-md transition-all">
    <div className="flex items-center gap-4">
      <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center border border-blue-100">
        <MapPin className="w-6 h-6" />
      </div>
      <div>
        <h4 className="font-bold text-slate-900">{hospital.name}</h4>
        <p className="text-xs text-slate-500 font-medium">{hospital.distance} away • {hospital.address}</p>
      </div>
    </div>
    <a 
      href={`https://www.google.com/maps/search/${encodeURIComponent(hospital.name + ' ' + hospital.address)}`}
      target="_blank"
      rel="noreferrer"
      className="flex items-center gap-1 text-sm font-bold text-blue-600 hover:underline"
    >
      Navigate <ChevronRight className="w-4 h-4" />
    </a>
  </div>
);

export default function Emergency() {
  const [notified, setNotified] = useState(false);
  const primaryCaretaker = {
    name: 'Sarah Doe',
    relationship: 'Spouse',
    phone: '+1 (555) 0123',
    is_primary: true
  };

  const nearbyHospitals = [
    { name: 'St. John’s Medical College Hospital', distance: '1.2 km', address: 'Koramangala, Bengaluru' },
    { name: 'Manipal Hospital Old Airport Road', distance: '3.5 km', address: 'HAL Old Airport Rd, Bengaluru' },
    { name: 'Apollo Hospitals', distance: '5.1 km', address: 'Bannerghatta Road, Bengaluru' }
  ];

  const handleNotify = () => {
    setNotified(true);
    setTimeout(() => setNotified(false), 5000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-10">
      <div className="text-center space-y-4">
        <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-[24px] flex items-center justify-center border border-blue-100 shadow-xl shadow-blue-100/20 mx-auto">
          <LifeBuoy className="w-8 h-8" />
        </div>
        <h2 className="text-3xl font-black text-slate-900 tracking-tight uppercase">Emergency Response</h2>
        <p className="text-slate-500 max-w-md mx-auto font-medium">Quick access to life-saving tools and your support network.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="flex items-center justify-between px-2">
            <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-rose-600" />
              Emergency Contacts
            </h3>
            <button className="text-xs font-bold text-slate-400 hover:text-slate-600">Edit</button>
          </div>
          <CaretakerCard caretaker={primaryCaretaker} />
          <div className="bg-slate-50 p-6 rounded-3xl border border-slate-200">
            <button 
              onClick={handleNotify}
              disabled={notified}
              className={cn(
                "w-full py-4 rounded-2xl font-bold shadow-xl transition-all flex items-center justify-center gap-3 active:scale-[0.98]",
                notified 
                  ? "bg-emerald-600 text-white shadow-emerald-200" 
                  : "bg-slate-900 text-white shadow-slate-200 hover:bg-black"
              )}
            >
              {notified ? (
                <>
                  <CheckCircle2 className="w-6 h-6" />
                  Alerts Dispatched
                </>
              ) : (
                <>
                  <AlertCircle className="w-6 h-6" />
                  Notify All Caretakers
                </>
              )}
            </button>
            <p className={cn(
              "text-[10px] text-center font-bold uppercase tracking-widest mt-4 transition-colors",
              notified ? "text-emerald-600" : "text-slate-500"
            )}>
              {notified ? "SMS messages have been sent" : "This will send SMS to 3 registered contacts"}
            </p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="flex items-center justify-between px-2">
            <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-blue-600" />
              Nearby Facilities
            </h3>
          </div>
          <div className="space-y-4">
            {nearbyHospitals.map((h, i) => <HospitalCard key={i} hospital={h} />)}
          </div>
          <button 
            onClick={() => alert("Connecting to emergency dispatchers (911)... In a real deployment, this would initiate an immediate VoIP/PSTN call.")}
            className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-black transition-all flex items-center justify-center gap-3 active:scale-[0.98]"
          >
            <Phone className="w-5 h-5" />
            Call Emergency Services (911)
          </button>
        </div>
      </div>

      <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-6">
        <h3 className="text-xl font-bold text-slate-900">Medical ID (Simplified)</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Blood Type</p>
            <p className="text-lg font-bold text-slate-900">A Positive</p>
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Allergies</p>
            <p className="text-lg font-bold text-rose-600">Peanuts, Penicillin</p>
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Medications</p>
            <p className="text-lg font-bold text-slate-900">Lisinopril 10mg</p>
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Organ Donor</p>
            <p className="text-lg font-bold text-emerald-600">Yes</p>
          </div>
        </div>
      </div>
    </div>
  );
}
