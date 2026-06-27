# Health Predictor - AI-Powered Patient Health Assessment

A full-stack web application that predicts patient health conditions using blood test results and Google Gemini AI.

## Tech Stack

- **Frontend:** React.js
- **Backend:** Python (Flask)
- **Database:** SQLite
- **AI/ML:** Google Gemini API

## Features

- Add, Edit, Delete and View patient records
- Input validation (email format, date of birth, numeric blood values)
- AI-powered health prediction based on Glucose, Haemoglobin and Cholesterol levels
- Clean and responsive user interface

## Project Structure

health-predictor/

├── backend/

│   ├── app.py

│   ├── models.py

│   ├── ai_service.py

│   ├── requirements.txt

│   └── .env.example

└── frontend/

└── src/

├── App.js

├── App.css

└── api.js

## Setup Instructions

### Backend

1. Navigate to backend folder:

cd backend
2. Create and activate virtual environment:

python -m venv venv
venv\Scripts\activate
3. Install dependencies:

pip install -r requirements.txt

4. Create a `.env` file and add your API key:
GEMINI_API_KEY=your_gemini_api_key_here

5. Run the Flask server:

python app.py

### Frontend

1. Navigate to frontend folder:

cd frontend

2. Install dependencies:

npm install

3. Start the React app:

npm start

4. Open your browser at `http://localhost:3000`

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /patients | Get all patients |
| POST | /patients | Create new patient |
| PUT | /patients/:id | Update patient |
| DELETE | /patients/:id | Delete patient |

## Environment Variables

Create a `.env` file in the `backend` folder:

GEMINI_API_KEY=your_gemini_api_key_here