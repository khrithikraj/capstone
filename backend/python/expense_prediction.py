import sys
import pandas as pd
import pickle
import json
import os

# Get the year from the command line arguments
year_input = int(sys.argv[1])  # The year passed from the frontend

# Load the Pickled model
with open(r"C:\Users\HIRITHIK RAJ\Desktop\Sem 7\Capstone Project\model.pkl", 'rb') as f:  # Replace with the actual path to your pickle file
    model = pickle.load(f)

# Load your data (assuming it’s in a CSV or database format)
data = pd.read_csv(r"C:\Users\HIRITHIK RAJ\Desktop\personal_expenditure4.csv")  # Replace with the actual path to your CSV file

# Data preprocessing
data['Date'] = pd.to_datetime(data['Date'])  # Convert the 'Date' column to datetime format
data['Year'] = data['Date'].dt.year  # Extract the year from the 'Date'
data['Month'] = data['Date'].dt.month  # Extract the month from the 'Date'

# Drop the 'Date' column as it’s no longer needed
data = data.drop(columns=['Date'])

# Group by 'Year', 'Month', and 'Category' and sum the numerical columns
monthly_data = data.groupby(['Year', 'Month', 'Category']).sum().reset_index()

# Extract unique categories from the original data for prediction 
categories = monthly_data['Category'].unique()

# Create a DataFrame with the user-specified year and all months (1 to 12) for each category
future_data = pd.DataFrame([(year_input, month, category) for month in range(1, 13) for category in categories], 
                           columns=['Year', 'Month', 'Category'])

# Convert categorical 'Category' into dummy variables (one-hot encoding)
future_data_dummies = pd.get_dummies(future_data[['Year', 'Month', 'Category']], drop_first=True)

# Predict future budget recommendations using the loaded model
budget_predictions = model.predict(future_data_dummies)

# Add predictions to the future data
future_data['Prediction'] = budget_predictions

# Apply the required transformations to the prediction values
future_data['Prediction'] = future_data['Prediction'].apply(lambda x: abs(x))  # Convert negative values to positive
future_data['Prediction'] = future_data['Prediction'].apply(lambda x: x * 100 if x < 100 else x)  # Multiply values < 100 by 100

# Prepare the predictions for output as a list of dictionaries
predictions = []
for month in range(1, 13):
    month_data = future_data[future_data['Month'] == month]
    for _, row in month_data.iterrows():
        predictions.append({
            'month': f'{year_input}-{month:02d}',  # Format the month as 'YYYY-MM'
            'category': row['Category'],
            'prediction': row['Prediction']  # The transformed prediction value for this category in this month
        })

# Save predictions to a local JSON file
output_file_path = r"C:\Users\HIRITHIK RAJ\Desktop\Sem 7\Capstone Project\Safe\hrithik\expense-tracker_fullstack\frontend\src\Components\PredictionPage\predictions.json"  # Update with your preferred save path
with open(output_file_path, 'w') as json_file:
    json.dump(predictions, json_file, indent=2)

# Output predictions as a JSON string (this will also be sent to the frontend)
print(json.dumps(predictions, indent=2))
