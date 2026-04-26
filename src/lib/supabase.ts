import { createClient } from '@supabase/supabase-js';

const supabaseUrl = (import.meta as any).env.VITE_SUPABASE_URL;
const supabaseAnonKey = (import.meta as any).env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase credentials missing. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your environment.');
}

export const supabase = createClient(
  supabaseUrl || 'https://cqbkupfezfqcowvmllac.supabase.co',
  supabaseAnonKey || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNxYmt1cGZlemZxY293dm1sbGFjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzcxMjk0MjEsImV4cCI6MjA5MjcwNTQyMX0.V0jtZ2tH7g9qCJaecJxyQyLhkL6TJclV7Kz6xGSuyKQ'
);

export type Tables = {
  health_profiles: {
    user_id: string;
    age: number;
    gender: 'Male' | 'Female' | 'Other';
    height_cm: number;
    weight_kg: number;
    bmi: number;
    hypertension: boolean;
    medications: string[];
    smoking: boolean;
    alcohol_level: 'None' | 'Low' | 'Moderate' | 'High';
    activity_level: 'Sedentary' | 'Light' | 'Moderate' | 'Active';
  };
  bp_records: {
    id: string;
    user_id: string;
    systolic: number;
    diastolic: number;
    pulse: number;
    notes?: string;
    recorded_at: string;
    deleted_at?: string;
  };
  predictions: {
    id: string;
    user_id: string;
    bp_record_id: string;
    status: 'Normal' | 'Elevated' | 'Dangerous';
    risk_score: number;
    feature_importances: Record<string, number>;
    explanation: string;
    created_at: string;
  };
  caretakers: {
    id: string;
    user_id: string;
    name: string;
    phone: string;
    relationship: string;
    is_primary: boolean;
    created_at: string;
  };
  alerts: {
    id: string;
    user_id: string;
    prediction_id: string;
    severity: 'Low' | 'Medium' | 'High' | 'Crisis';
    message: string;
    resolved_at?: string;
    created_at: string;
  };
};
