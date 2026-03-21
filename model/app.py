from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
import joblib
import pandas as pd

app = FastAPI(title="Math Score Predictor API")

# Setup CORS to allow the frontend to access the API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load the exported model and its input feature names
model = joblib.load('linear_model.joblib')
feature_names = joblib.load('feature_names.joblib')

class PredictionInput(BaseModel):
    readingScore: float
    writingScore: float
    gender: str
    raceEthnicity: str
    parentalEducation: str
    lunch: str
    testPrep: str

@app.post("/predict")
def predict(data: PredictionInput):
    # Initialize all features to 0
    input_data = {col: 0 for col in feature_names}
    
    # 1. Numeric Features
    input_data['reading score'] = data.readingScore
    input_data['writing score'] = data.writingScore
    
    # 2. Categorical Features (mimicking drop_first=True one-hot encoding)
    # The reference values (dropped in get_dummies) are:
    # female, group A, associate's degree, free/reduced, completed
    
    if data.gender == "male":
        input_data['gender'] = 1
        
    if data.raceEthnicity != "group A":
        input_data[data.raceEthnicity] = 1
        
    if data.parentalEducation != "associate's degree":
        input_data[data.parentalEducation] = 1
        
    if data.lunch == "standard":
        input_data['lunch'] = 1
        
    if data.testPrep == "none":
        input_data['test_prep'] = 1
        
    # 3. Interaction Feature
    if data.raceEthnicity == "group E" and data.parentalEducation == "master's degree":
        input_data['master_group'] = 1
        
    # Convert perfectly aligned columns DataFrame
    df_input = pd.DataFrame([input_data])
    
    # Generate prediction from loaded model
    prediction = model.predict(df_input)[0]
    
    return {"prediction": float(round(prediction, 2))}
