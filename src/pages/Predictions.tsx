import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Brain, TrendingUp, AlertTriangle, ChevronRight, Info } from 'lucide-react';
import { cn } from '../lib/utils';

const mockPredictions = [
  {
    date: 'Today, 10:45 AM',
    status: 'Normal',
    score: 92,
    explanation: "Your blood pressure is within the target range. However, we've noticed a slight upward trend in your morning readings compared to last week. Continue monitoring your sodium intake.",
    factors: [
      { name: 'BMI', impact: 'Neutral', value: '24.2' },
      { name: 'Recent Activity', impact: 'Positive', value: 'Moderate' },
      { name: 'Sodium Intake', impact: 'Negative', value: 'Elevated' },
    ]
  },
  {
    date: 'Yesterday, 06:15 PM',
    status: 'Elevated',
    score: 68,
    explanation: "This reading is higher than your usual baseline. This could be due to the moderate alcohol level reported. Rest for 30 minutes and re-measure.",
    factors: [
      { name: 'Alcohol', impact: 'Negative', value: 'Moderate' },
      { name: 'Rest', impact: 'Negative', value: 'Insufficient' },
      { name: 'Hydration', impact: 'Positive', value: 'Good' },
    ]
  }
];

const PredictionCard = ({ prediction }: { prediction: typeof mockPredictions[0], key?: any, index?: number }) => (
  <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden group hover:shadow-md transition-all">
    <div className={cn(
      "px-6 py-4 flex items-center justify-between",
      prediction.status === 'Normal' ? "bg-emerald-50/50" : 
      prediction.status === 'Elevated' ? "bg-amber-50/50" : "bg-rose-50/50"
    )}>
      <div className="flex items-center gap-3">
        <div className={cn(
          "p-2 rounded-xl",
          prediction.status === 'Normal' ? "bg-emerald-100 text-emerald-600" : 
          prediction.status === 'Elevated' ? "bg-amber-100 text-amber-600" : "bg-rose-100 text-rose-600"
        )}>
          <Brain className="w-5 h-5" />
        </div>
        <div>
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Analysis Date</p>
          <p className="text-sm font-bold text-slate-700">{prediction.date}</p>
        </div>
      </div>
      <div className="text-right">
        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Reliability Score</p>
        <p className="text-sm font-black text-slate-900">{prediction.score}%</p>
      </div>
    </div>

    <div className="p-8 space-y-6">
      <div className="flex items-start gap-4">
        <div className={cn(
          "w-3 h-3 rounded-full mt-2 shrink-0 animate-pulse",
          prediction.status === 'Normal' ? "bg-emerald-500 shadow-emerald-200 shadow-lg" : 
          prediction.status === 'Elevated' ? "bg-amber-500 shadow-amber-200 shadow-lg" : "bg-rose-500 shadow-rose-200 shadow-lg"
        )} />
        <div>
          <h3 className="text-xl font-black text-slate-900">Diagnosis: {prediction.status}</h3>
          <p className="text-slate-600 mt-2 leading-relaxed font-medium italic">"{prediction.explanation}"</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {prediction.factors.map((factor, idx) => (
          <div key={idx} className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">{factor.name}</p>
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-slate-700">{factor.value}</span>
              <span className={cn(
                "text-[10px] font-bold px-2 py-0.5 rounded-full",
                factor.impact === 'Positive' ? "bg-emerald-100 text-emerald-600" :
                factor.impact === 'Negative' ? "bg-rose-100 text-rose-600" : "bg-slate-200 text-slate-600"
              )}>
                {factor.impact}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default function Predictions() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">AI Health Predictions</h2>
          <p className="text-slate-500 mt-1 font-medium italic">Our neural network analyzes your lifestyle and readings.</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-700 rounded-xl font-bold text-sm">
          <ShieldCheck className="w-4 h-4" /> System Online
        </div>
      </div>

      <div className="bg-indigo-900 p-8 rounded-3xl shadow-xl shadow-indigo-100 text-white relative overflow-hidden">
        <TrendingUp className="absolute -right-8 -bottom-8 w-64 h-64 text-white/5" />
        <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
          <div className="w-24 h-24 bg-white/10 backdrop-blur-md rounded-3xl flex items-center justify-center border border-white/20">
            <span className="text-3xl font-black">94</span>
          </div>
          <div className="flex-1 text-center md:text-left">
            <h3 className="text-2xl font-bold">Overall Health Index</h3>
            <p className="text-indigo-200 mt-1">Based on 12 parameters including your pulse, weight, and history. You are doing 15% better than last month.</p>
          </div>
          <Link to="/analytics" className="px-6 py-3 bg-white text-indigo-900 font-bold rounded-2xl shadow-lg hover:bg-indigo-50 transition-all">
            See Full Report
          </Link>
        </div>
      </div>

      <div className="space-y-6">
        <div className="flex items-center justify-between px-2">
          <h3 className="text-xl font-bold text-slate-900">Historical Insights</h3>
          <div className="flex gap-2">
            <button className="text-xs font-bold text-slate-400 hover:text-slate-600">Filters</button>
          </div>
        </div>
        
        {mockPredictions.map((p, i) => (
          <PredictionCard key={i} prediction={p} index={i} />
        ))}
        
        <button 
          onClick={() => alert("Loading historical predictions... PulseGuard AI is scanning your cold storage data.")}
          className="w-full py-4 bg-slate-100 text-slate-500 font-bold rounded-2xl hover:bg-slate-200 transition-colors active:scale-95"
        >
          Show Older Predictions
        </button>
      </div>

      <div className="p-6 bg-slate-50 rounded-3xl border border-slate-200 flex gap-4">
        <div className="w-10 h-10 bg-white shadow-sm text-blue-600 rounded-full flex-shrink-0 flex items-center justify-center border border-slate-200">
          <Info className="w-5 h-5" />
        </div>
        <p className="text-xs text-slate-500 leading-relaxed font-medium">
          <span className="font-bold text-slate-700">Disclaimer:</span> PulseGuard AI predictions are for informational purposes only and not a substitute for professional medical advice. Always consult with your healthcare provider for clinical diagnosis.
        </p>
      </div>
    </div>
  );
}
