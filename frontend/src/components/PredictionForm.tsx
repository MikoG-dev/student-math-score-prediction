import { useState } from "react";
import { predict, type PredictionInput } from "@/lib/model";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

export function PredictionForm() {
  const [readingScore, setReadingScore] = useState("");
  const [writingScore, setWritingScore] = useState("");
  const [gender, setGender] = useState<PredictionInput["gender"]>("female");
  const [race, setRace] = useState<PredictionInput["raceEthnicity"]>("group A");
  const [education, setEducation] = useState<PredictionInput["parentalEducation"]>("associate's degree");
  const [lunch, setLunch] = useState<PredictionInput["lunch"]>("standard");
  const [testPrep, setTestPrep] = useState<PredictionInput["testPrep"]>("none");
  const [result, setResult] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePredict = async () => {
    const rs = parseFloat(readingScore);
    const ws = parseFloat(writingScore);
    if (isNaN(rs) || isNaN(ws) || rs < 0 || rs > 100 || ws < 0 || ws > 100) return;

    setIsLoading(true);
    setError(null);
    setShowResult(false);
    try {
      const prediction = await predict({
        readingScore: rs,
        writingScore: ws,
        gender,
        raceEthnicity: race,
        parentalEducation: education,
        lunch,
        testPrep,
      });

      setResult(Math.max(0, Math.min(100, prediction)));
      setShowResult(true);
    } catch (err) {
      setError("Failed to connect to the prediction API.");
    } finally {
      setIsLoading(false);
    }
  };

  const isValid =
    readingScore !== "" &&
    writingScore !== "" &&
    !isNaN(parseFloat(readingScore)) &&
    !isNaN(parseFloat(writingScore)) &&
    parseFloat(readingScore) >= 0 &&
    parseFloat(readingScore) <= 100 &&
    parseFloat(writingScore) >= 0 &&
    parseFloat(writingScore) <= 100;

  return (
    <div className="opacity-0 animate-fade-up" style={{ animationDelay: "400ms", animationFillMode: "forwards" }}>
      <div className="rounded-lg bg-card p-6 md:p-8 shadow-sm">
        <h2 className="text-lg font-semibold mb-1">Predict Math Score</h2>
        <p className="text-sm text-muted-foreground mb-6">
          Enter student details to get a predicted math score from the linear regression model.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {/* Numeric inputs */}
          <div className="space-y-2">
            <Label htmlFor="reading" className="text-sm font-medium">Reading Score</Label>
            <Input
              id="reading"
              type="number"
              min={0}
              max={100}
              placeholder="0 – 100"
              value={readingScore}
              onChange={(e) => { setReadingScore(e.target.value); setShowResult(false); }}
              className="font-mono"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="writing" className="text-sm font-medium">Writing Score</Label>
            <Input
              id="writing"
              type="number"
              min={0}
              max={100}
              placeholder="0 – 100"
              value={writingScore}
              onChange={(e) => { setWritingScore(e.target.value); setShowResult(false); }}
              className="font-mono"
            />
          </div>

          {/* Selects */}
          <FieldSelect label="Gender" value={gender} onValueChange={(v) => { setGender(v as any); setShowResult(false); }}
            options={[["female", "Female"], ["male", "Male"]]} />

          <FieldSelect label="Race / Ethnicity" value={race} onValueChange={(v) => { setRace(v as any); setShowResult(false); }}
            options={[["group A", "Group A"], ["group B", "Group B"], ["group C", "Group C"], ["group D", "Group D"], ["group E", "Group E"]]} />

          <FieldSelect label="Parental Education" value={education} onValueChange={(v) => { setEducation(v as any); setShowResult(false); }}
            options={[
              ["associate's degree", "Associate's Degree"],
              ["bachelor's degree", "Bachelor's Degree"],
              ["high school", "High School"],
              ["master's degree", "Master's Degree"],
              ["some college", "Some College"],
              ["some high school", "Some High School"],
            ]} />

          <FieldSelect label="Lunch Type" value={lunch} onValueChange={(v) => { setLunch(v as any); setShowResult(false); }}
            options={[["standard", "Standard"], ["free/reduced", "Free / Reduced"]]} />

          <FieldSelect label="Test Preparation" value={testPrep} onValueChange={(v) => { setTestPrep(v as any); setShowResult(false); }}
            options={[["none", "None"], ["completed", "Completed"]]} />
        </div>

        <div className="mt-8 flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <Button
            onClick={handlePredict}
            disabled={!isValid || isLoading}
            className="px-8 active:scale-[0.97] transition-transform"
          >
            {isLoading ? "Predicting..." : "Predict Score"}
          </Button>

          {error && (
            <div className="text-sm text-destructive opacity-0 animate-scale-in" style={{ animationFillMode: "forwards" }}>
              {error}
            </div>
          )}

          {showResult && result !== null && !error && (
            <div className="flex items-baseline gap-2 opacity-0 animate-scale-in" style={{ animationFillMode: "forwards" }}>
              <span className="text-sm text-muted-foreground">Predicted math score:</span>
              <span className="text-3xl font-bold font-mono tabular-nums text-primary">
                {result.toFixed(1)}
              </span>
              <span className="text-sm text-muted-foreground">/ 100</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function FieldSelect({
  label,
  value,
  onValueChange,
  options,
}: {
  label: string;
  value: string;
  onValueChange: (v: string) => void;
  options: [string, string][];
}) {
  return (
    <div className="space-y-2">
      <Label className="text-sm font-medium">{label}</Label>
      <Select value={value} onValueChange={onValueChange}>
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {options.map(([val, label]) => (
            <SelectItem key={val} value={val}>{label}</SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
