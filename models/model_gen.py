import numpy as np
from sklearn.ensemble import RandomForestClassifier
import joblib
import os

# Generate fake training data
X = np.random.rand(1000, 4) * [100, 10, 10, 5000]
y = (X[:, 0] > 80) | (X[:, 1] > 7)  # simple failure rule

model = RandomForestClassifier()
model.fit(X, y)

os.makedirs("models", exist_ok=True)
joblib.dump(model, "models/model.pkl")

print("Model trained and saved!")