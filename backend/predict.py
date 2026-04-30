import sys
import json
import joblib
import warnings

# Suppress warnings
warnings.filterwarnings("ignore")

# Load model
model = joblib.load("model.pkl")

# Get input from Node
data = json.loads(sys.argv[1])

# Predict
prediction = model.predict([data])

# Output result
print(prediction[0])