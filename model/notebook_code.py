# Import essential libraries for data handling, visualization, and modeling
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
%matplotlib inline
# =====
# Load the dataset into a pandas dataframe
df = pd.read_csv('../StudentsPerformance.csv')
# =====
# Display the first few rows of the dataset
df.head()
# =====
# Check dataset information (data types, nulls, etc.)
df.info()
# =====
df['race/ethnicity'].unique()
# =====
df['parental level of education'].unique()
# =====
df['test preparation course'].unique()
# =====
df['lunch'].unique()
# =====
# Pairplot to observe relationships among features
sns.pairplot(df)
# =====
# Correlation heatmap for numerical features
sns.heatmap(df.drop(['gender','lunch','parental level of education','race/ethnicity','test preparation course'],axis=1).corr(),annot=True,cbar=False)
# =====
sns.boxplot(data=df,x='test preparation course',y='math score')
# =====
sns.boxplot(data=df,x='gender',y='math score',hue='parental level of education')
# =====
sns.boxplot(data=df,x='race/ethnicity',y='math score',hue='gender')
# =====
sns.boxplot(data=df,x='lunch',y='math score',hue='gender')
# =====
# Convert categorical columns to numerical using one-hot encoding
gender = pd.get_dummies(df['gender'],dtype=int,drop_first=True).rename(columns={'male':'gender'})
race = pd.get_dummies(df['race/ethnicity'],dtype=int,drop_first=True)
parent_education = pd.get_dummies(df['parental level of education'],dtype=int,drop_first=True)
lunch = pd.get_dummies(df['lunch'],dtype=int,drop_first=True).rename(columns={'standard':'lunch'})
test_prep = pd.get_dummies(df['test preparation course'],dtype=int,drop_first=True).rename(columns={'none':'test_prep'})
# =====
# Drop original categorical columns and concatenate the new numeric columns
df.drop(['gender','race/ethnicity','parental level of education','lunch','test preparation course'],axis=1,inplace=True)
df = pd.concat([df,gender,race,parent_education,lunch,test_prep],axis=1)
# =====
# Create an interaction feature between Group E and Master's Degree
df['master_group'] = df['group E']*df["master's degree"]
# =====
# Save cleaned data for reuse
df.to_csv('../cleaned_student_scores.csv')
# =====
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LinearRegression
from sklearn import metrics
# =====
# Define features and target
x = df.drop('math score',axis=1)
y = df['math score']
# =====
# Split into training and test sets
x_train,x_test,y_train,y_test = train_test_split(x,y,test_size=0.3,random_state=101)
# =====
# Initialize and train the linear regression model
lm = LinearRegression()
lm.fit(x_train,y_train)
# =====
# observe the coef_ respect to each feature
pd.DataFrame(index=['reading score', 'writing score', 'gender', 'group B','group C', 'group D', 'group E', "bachelor's degree", 'high school',
"master's degree", 'some college', 'some high school', 'lunch','test_prep','master_group'],columns=['Coef_'],data=lm.coef_)
# =====
lm.intercept_
# =====
# Predict and evaluate
prediction = lm.predict(x_test)
# =====
# Plot: Actual vs Predicted
plt.figure(figsize=(8, 6))
plt.scatter(y_test, prediction, alpha=0.7, color="royalblue", edgecolor='k')
plt.xlabel("Actual Math Score")
plt.ylabel("Predicted Math Score")
plt.title("Actual vs Predicted Math Scores")
plt.grid(True)
plt.savefig("../assets/actual_vs_predicted.png", dpi=300)
# =====
#let's check out MSE and RMSE scores
mse = metrics.mean_squared_error(y_test,prediction)
rmse = np.sqrt(mse)
print(f'MSE: {mse}')
print(f'RMSE: {rmse}')
# =====
r2 = metrics.r2_score(y_test,prediction)
print(f'R2: {r2}')
# =====
#let's plot our residuals
sns.histplot((y_test-prediction),kde=True)
# =====

# =====
