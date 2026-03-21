export const MODEL_METRICS = {
  mse: 28.3852,
  rmse: 5.3278,
  mae: 4.18, // approximate — update with your actual MAE
  r2: 0.8561,
};

export interface PredictionInput {
  readingScore: number;
  writingScore: number;
  gender: "female" | "male";
  raceEthnicity: "group A" | "group B" | "group C" | "group D" | "group E";
  parentalEducation:
    | "associate's degree"
    | "bachelor's degree"
    | "high school"
    | "master's degree"
    | "some college"
    | "some high school";
  lunch: "free/reduced" | "standard";
  testPrep: "completed" | "none";
}

export async function predict(input: PredictionInput): Promise<number> {
  const response = await fetch("http://localhost:8000/predict", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(input),
  });

  if (!response.ok) {
    throw new Error("Prediction API request failed.");
  }

  const data = await response.json();
  return data.prediction;
}
