# predict.py
import sys
import json
import joblib
import pandas as pd
import warnings

warnings.filterwarnings("ignore")

# Load model
model = joblib.load('final_model.pkl')

# Read JSON input from stdin
inputs = json.loads(sys.stdin.read())

# Define expected input order and types
columns = [
    'StateOfOccurrence', 'Location', 'StateOfRegistry', 'Over2250', 'Over5700',
    'ScheduledCommercial', 'Helicopter', 'Airplane', 'Engines', 'EngineType',
    'Latitude', 'Longitude', 'temp_max', 'temp_min', 'precip', 'Altitude',
    'Month', 'DayOfWeek', 'IsWeekend', 'Season', 'PrecipFlag', 'ColdTemp',
    'HotTemp', 'wind_avg', 'Windy', 'IsHelicopter', 'IsScheduled',
    'EngineTypeEnc', 'Hour', 'IsNight', 'TempRange', 'Precip_Wind',
    'Precip_Night', 'Precip_Helicopter', 'Precip_Altitude', 'Wind_Altitude',
    'TempRange_Season'
]

# Create a DataFrame from input
try:
    fix_types = {
        "Engines": float,
        "Altitude": float,
        "PrecipFlag": float,
        "ColdTemp": float,
        "HotTemp": float,
        "Windy": float,
        "IsHelicopter": float,
        "IsScheduled": float,
        "TempRange": float
    }
    df = pd.DataFrame([inputs], columns=columns)
    df = df.astype(fix_types)
except Exception as e:
    print(json.dumps({'error': f'Invalid input format: {str(e)}'}))
    sys.exit(1)

# Predict
try:
    prediction = model.predict_proba(df)[0][1] *100
    print(json.dumps({f'risk_percentage': float(prediction)}))
    print("=== Final Input to Model ===")
    print(df.head())
    print("DTypes:")
    print(df.dtypes)

except Exception as e:
    print(json.dumps({'error': f'Prediction failed: {str(e)}'}))
    sys.exit(1)