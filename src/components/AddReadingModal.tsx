import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { X, Activity, Heart, Info, Loader2, ShieldCheck as Shield } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';
import { supabase } from '../lib/supabase';
import { useUIStore } from '../store';

import { getHealthPrediction, PredictionRequest } from '../lib/gemini';

const schema = z.object({
  systolic: z.number().min(60).max(250),
  diastolic: z.number().min(40).max(150),
  pulse: z.number().min(30).max(220),
  notes: z.string().max(500).optional(),
});

type FormData = z.infer<typeof schema>;

export default function AddReadingModal({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [prediction, setPrediction] = React.useState<any>(null);
  const { setLatestStatus } = useUIStore();

  const { register, handleSubmit, formState: { errors }, reset } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      systolic: 120,
      diastolic: 80,
      pulse: 72,
    }
  });

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    setPrediction(null);
    try {
      // 1. Get health profile for prediction (mocked for now)
      const requestData: PredictionRequest = {
        ...data,
        age: 35,
        gender: "Male",
        bmi: 24.5,
        hypertension: false,
        smoking: false,
        alcohol_level: "None",
        activity_level: "Moderate",
        last_7_readings: [],
      };

      // 2. Call ML Prediction (Now using frontend Gemini SDK)
      const predictionData = await getHealthPrediction(requestData);
      setPrediction(predictionData);
      setLatestStatus(predictionData.status);

      // 3. Save to Supabase (Mocked for demo but logic is here)
      /*
      const { data: record, error } = await supabase.from('bp_records').insert({
        systolic: data.systolic,
        diastolic: data.diastolic,
        pulse: data.pulse,
        notes: data.notes,
        recorded_at: new Date().toISOString(),
      }).select().single();
      
      if (record) {
        await supabase.from('predictions').insert({
          bp_record_id: record.id,
          status: predictionData.status,
          risk_score: predictionData.risk_score,
          feature_importances: predictionData.feature_importances,
          explanation: predictionData.explanation,
        });
      }
      */

    } catch (error) {
      console.error("Submission failed:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    reset();
    setPrediction(null);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
          />
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl shadow-slate-900/20 overflow-hidden"
          >
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
                  <Activity className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-900">Log New Reading</h3>
              </div>
              <button onClick={handleClose} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-all">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-8">
              {!prediction ? (
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700 uppercase tracking-wide">Systolic (Top)</label>
                      <div className="relative">
                        <input 
                          type="number" 
                          {...register('systolic', { valueAsNumber: true })}
                          className={cn(
                            "w-full pl-6 pr-16 py-4 bg-slate-50 border rounded-2xl text-2xl font-black text-slate-900 outline-none focus:ring-4 transition-all",
                            errors.systolic ? "border-rose-300 focus:ring-rose-100" : "border-slate-100 focus:ring-blue-100"
                          )}
                        />
                        <span className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-xs uppercase">mmHg</span>
                      </div>
                      {errors.systolic && <p className="text-xs font-bold text-rose-500">{errors.systolic.message}</p>}
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700 uppercase tracking-wide">Diastolic (Bottom)</label>
                      <div className="relative">
                        <input 
                          type="number" 
                          {...register('diastolic', { valueAsNumber: true })}
                          className={cn(
                            "w-full pl-6 pr-16 py-4 bg-slate-50 border rounded-2xl text-2xl font-black text-slate-900 outline-none focus:ring-4 transition-all",
                            errors.diastolic ? "border-rose-300 focus:ring-rose-100" : "border-slate-100 focus:ring-blue-100"
                          )}
                        />
                        <span className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-xs uppercase">mmHg</span>
                      </div>
                      {errors.diastolic && <p className="text-xs font-bold text-rose-500">{errors.diastolic.message}</p>}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 uppercase tracking-wide">Pulse Rate</label>
                    <div className="relative">
                      <input 
                        type="number" 
                        {...register('pulse', { valueAsNumber: true })}
                        className="w-full pl-12 pr-16 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-xl font-bold text-slate-900 outline-none focus:ring-4 focus:ring-blue-100 transition-all"
                      />
                      <Heart className="absolute left-4 top-1/2 -translate-y-1/2 text-rose-500 w-5 h-5" />
                      <span className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-xs uppercase">bpm</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 uppercase tracking-wide">Notes (Optional)</label>
                    <textarea 
                      {...register('notes')}
                      className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-medium text-slate-900 outline-none focus:ring-4 focus:ring-blue-100 transition-all min-h-[100px]"
                      placeholder="How are you feeling? Any physical activity recently?"
                    />
                  </div>

                  <button 
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold shadow-xl shadow-slate-200 hover:bg-black transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Analyzing with PulseGuard AI...
                      </>
                    ) : (
                      <>
                        <Shield className="w-5 h-5" />
                        Submit for Analysis
                      </>
                    )}
                  </button>
                </form>
              ) : (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
                  <div className="flex flex-col items-center text-center gap-4">
                    <div className={cn(
                      "w-20 h-20 rounded-3xl flex items-center justify-center shadow-lg",
                      prediction.status === 'Normal' ? "bg-emerald-50 text-emerald-600 shadow-emerald-100" :
                      prediction.status === 'Elevated' ? "bg-amber-50 text-amber-600 shadow-amber-100" : "bg-rose-50 text-rose-600 shadow-rose-100"
                    )}>
                      <Activity className="w-10 h-10" />
                    </div>
                    <div>
                      <h4 className="text-2xl font-black text-slate-900 uppercase">Status: {prediction.status}</h4>
                      <p className="text-slate-500 font-bold uppercase text-xs tracking-widest mt-1">AI Risk Score: {prediction.risk_score}%</p>
                    </div>
                  </div>

                  <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 space-y-4">
                    <div className="flex items-center gap-2 text-slate-900 font-bold underline underline-offset-4 decoration-blue-500">
                      <Info className="w-4 h-4 text-blue-500" />
                      AI Explanation
                    </div>
                    <p className="text-slate-600 leading-relaxed text-sm italic">
                      "{prediction.explanation}"
                    </p>
                  </div>

                  <div className="space-y-3">
                    <button 
                      onClick={handleClose}
                      className="w-full py-4 bg-blue-600 text-white rounded-2xl font-bold shadow-xl shadow-blue-100 hover:bg-blue-700 transition-all"
                    >
                      Done
                    </button>
                    <button 
                      onClick={() => setPrediction(null)}
                      className="w-full py-2 text-slate-400 font-bold text-xs hover:text-slate-600 transition-colors"
                    >
                      Log another reading
                    </button>
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
