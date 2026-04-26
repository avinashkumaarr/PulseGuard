# PulseGuard AI — Advanced Cardiovascular Intelligence

PulseGuard AI is a high-fidelity health monitoring dashboard designed for proactive cardiovascular care. It leverages artificial intelligence to analyze blood pressure patterns and provide real-time wellness insights.

## Core Features

- **AI-Powered Diagnostics**: Utilizes Google Gemini models to predict health risks and explain physiological trends.
- **Biometric Dashboard**: Visualizes systolic, diastolic, and pulse rate data with high-precision charts.
- **Emergency Ecosystem**: Integrated emergency response system that notifies caretakers via SMS during critical spikes.
- **Privacy-First Data**: Secure health records with multi-factor authentication and AES-256 encryption.
- **Health Analytics**: Longitudinal studies of morning patterns, activity correlations, and sodium sensitivity.

## Technology Stack

- **Frontend**: React 18, Vite, TypeScript
- **Styling**: Tailwind CSS
- **Animations**: Motion (formerly Framer Motion)
- **Charts**: Recharts
- **Icons**: Lucide React
- **ML Integration**: Google Generative AI (Gemini SDK)
- **State Management**: Zustand

## Project Structure

- `src/pages/`: Main application routes (Dashboard, Analytics, Predictions, etc.)
- `src/components/`: Reusable UI components and modals.
- `src/lib/gemini.ts`: AI service layer for health predictions.
- `src/store/`: Central application state.
- `src/lib/utils.ts`: Utility helpers for Tailwind class merging.

## Development Requirements

- Node.js (v18 or higher)
- npm or yarn
- Gemini API Key (set in environment)
