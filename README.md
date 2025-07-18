# ✈️ Flight Risk Scorer

A web-based tool that predicts the **risk percentage of an aircraft flight** based on various features such as weather conditions, aircraft specifications, registration state, and time-related factors.

---

## 🚀 Features

- Predicts crash risk **as a percentage**
- Based on real accident data and machine learning
- Frontend built with **React + Tailwind CSS**
- Backend powered by **Node.js** and **Python (XGBoost model)**
- Simple, responsive UI
- Supports manual and automated input features

---

## 🧠 Model

- Preprocessing with `Pipeline` and `ColumnTransformer`
- Model: `XGBClassifier` with calibrated outputs
- Input features include:
  - Weather: temperature, precipitation, wind
  - Aircraft: weight category, engine type, registration
  - Time: hour, season, weekend, night
  - Interaction features (auto-calculated): e.g., `precip × wind`

---

## 🏗️ Project Structure

```
flight_risk_score/
├── dist/                  # Production build (after `vite build`)
├── src/                   # Frontend React source code
│   └── App.tsx
├── server.js              # Express backend
├── predict.py             # Python script for model inference
├── final_model.pkl        # Trained and serialized model
├── package.json
├── tailwind.config.js
└── README.md              # You're here
```

---

## ⚙️ Setup & Run

### 1. Clone the repo

```bash
git clone <your-repo-url>
cd flight_risk_score
```

### 2. Install dependencies

```bash
npm install
```

### 3. Run frontend (dev purposes)

```bash
npm run dev
```

### 4. Start backend

```bash
node server.js
```

> The app will run at [http://localhost:3001](http://localhost:3001)

---

## 🐍 Python Setup

Ensure Python is installed, then:

```bash
pip install -r requirements.txt
```

**requirements.txt**
```
xgboost
pandas
joblib
scikit-learn==1.6.1
```

---

## 🧠 Notes

- Interaction features are computed automatically from primary inputs
- Backend uses `child_process.spawn` to run Python script
- Ensure `final_model.pkl` was saved using the same scikit-learn version used at runtime
