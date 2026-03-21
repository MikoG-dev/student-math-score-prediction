import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LinearRegression
import joblib

def export_model():
    print("Loading raw data...")
    df = pd.read_csv('StudentsPerformance.csv')

    print("Preprocessing data with exact steps from the Jupyter Notebook...")
    gender = pd.get_dummies(df['gender'], dtype=int, drop_first=True).rename(columns={'male':'gender'})
    race = pd.get_dummies(df['race/ethnicity'], dtype=int, drop_first=True)
    parent_education = pd.get_dummies(df['parental level of education'], dtype=int, drop_first=True)
    lunch = pd.get_dummies(df['lunch'], dtype=int, drop_first=True).rename(columns={'standard':'lunch'})
    test_prep = pd.get_dummies(df['test preparation course'], dtype=int, drop_first=True).rename(columns={'none':'test_prep'})

    df.drop(['gender','race/ethnicity','parental level of education','lunch','test preparation course'], axis=1, inplace=True)
    df = pd.concat([df, gender, race, parent_education, lunch, test_prep], axis=1)

    # Master group interaction feature
    df['master_group'] = df['group E'] * df["master's degree"]

    x = df.drop('math score', axis=1)
    y = df['math score']

    print("Splitting and training...")
    x_train, x_test, y_train, y_test = train_test_split(x, y, test_size=0.3, random_state=101)

    lm = LinearRegression()
    lm.fit(x_train, y_train)

    print("Exporting model using joblib...")
    joblib.dump(lm, 'linear_model.joblib')
    joblib.dump(list(x.columns), 'feature_names.joblib')
    print("Export successful! Files created: linear_model.joblib, feature_names.joblib")

if __name__ == "__main__":
    export_model()
