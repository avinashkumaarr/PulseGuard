import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export interface PredictionRequest {
  systolic: number;
  diastolic: number;
  pulse: number;
  age: number;
  gender: string;
  bmi: number;
  hypertension: boolean;
  smoking: boolean;
  alcohol_level: string;
  activity_level: string;
  last_7_readings: any[];
}

export interface PredictionResponse {
  status: "Normal" | "Elevated" | "Dangerous";
  risk_score: number;
  feature_importances: { [key: string]: number };
  explanation: string;
}

export async function getHealthPrediction(data: PredictionRequest): Promise<PredictionResponse> {
  const prompt = `
    You are a healthcare AI assistant specializing in blood pressure analysis.
    Analyze the following patient data and provide a risk prediction.
    
    Data:
    - Systolic: ${data.systolic} mmHg
    - Diastolic: ${data.diastolic} mmHg
    - Pulse: ${data.pulse} bpm
    - Age: ${data.age}
    - Gender: ${data.gender}
    - BMI: ${data.bmi}
    - Hypertension History: ${data.hypertension}
    - Smoking: ${data.smoking}
    - Alcohol Level: ${data.alcohol_level}
    - Activity Level: ${data.activity_level}
    - Recent Trends: ${JSON.stringify(data.last_7_readings)}

    Classification Rules (AHA Guidelines):
    - Normal: systolic < 120 AND diastolic < 80
    - Elevated: systolic 120–129 AND diastolic < 80
    - High Stage 1: systolic 130–139 OR diastolic 80–89
    - High Stage 2 (Dangerous): systolic ≥ 140 OR diastolic ≥ 90
    - Crisis: systolic > 180 OR diastolic > 120

    Return ONLY a JSON object with:
    - status: "Normal" | "Elevated" | "Dangerous"
    - risk_score: 0-100 (percentage)
    - feature_importances: { [key: string]: number } (explaining which features contributed most to the score)
    - explanation: A detailed, medical-yet-accessible explanation of the reading and its implications.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json"
      }
    });

    const text = response.text || "";
    // Robust cleaning in case markdown is returned
    const cleaned = text.replace(/```json\n?|\n?```/g, '').trim();
    return JSON.parse(cleaned);
  } catch (error) {
    console.error("Gemini Prediction Error:", error);
    throw error;
  }
}
