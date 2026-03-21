import { MODEL_METRICS } from "@/lib/model";
import { MetricCard } from "@/components/MetricCard";
import { PredictionForm } from "@/components/PredictionForm";

const metrics = [
  {
    label: "MSE",
    value: MODEL_METRICS.mse,
    description: "Mean Squared Error",
    colorClass: "bg-metric-mse",
  },
  {
    label: "RMSE",
    value: MODEL_METRICS.rmse,
    description: "Root Mean Squared Error",
    colorClass: "bg-metric-rmse",
  },
  {
    label: "MAE",
    value: MODEL_METRICS.mae,
    description: "Mean Absolute Error",
    colorClass: "bg-metric-mae",
  },
  {
    label: "R² Score",
    value: MODEL_METRICS.r2,
    description: "Coef of determination",
    colorClass: "bg-metric-r2",
  },
];

export default function Index() {
  return (
    <div className="min-h-screen px-4 py-12 md:py-20">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-10 opacity-0 animate-fade-up" style={{ animationFillMode: "forwards" }}>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight leading-tight">
            Student Math Score Predictor
          </h1>
          {/* <p className="mt-2 text-muted-foreground max-w-xl leading-relaxed">
            A linear regression model trained on 1,000 student records to predict math scores
            based on demographics, test preparation, and other academic scores.
          </p> */}
        </div>

        {/* Metric Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {metrics.map((m, i) => (
            <MetricCard key={m.label} {...m} delay={80 + i * 70} />
          ))}
        </div>

        {/* Prediction Form */}
        <PredictionForm />

        
      </div>
    </div>
  );
}
