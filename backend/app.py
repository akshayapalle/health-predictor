from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from models import db, Patient
from ai_service import get_health_prediction
from dotenv import load_dotenv
import os
import re
from datetime import datetime

load_dotenv()

app = Flask(__name__)
CORS(app)

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///patients.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db.init_app(app)

with app.app_context():
    db.create_all()

# ─── Validation Helper ───────────────────────────────────────────────
def validate_patient_data(data):
    errors = []

    if not data.get('full_name') or len(data['full_name'].strip()) < 2:
        errors.append('Full name must be at least 2 characters.')

    email_regex = r'^[\w\.-]+@[\w\.-]+\.\w+$'
    if not re.match(email_regex, data.get('email', '')):
        errors.append('Invalid email address format.')

    try:
        dob = datetime.strptime(data['date_of_birth'], '%Y-%m-%d')
        if dob.date() >= datetime.today().date():
            errors.append('Date of birth cannot be today or a future date.')
    except (ValueError, KeyError):
        errors.append('Invalid date of birth format. Use YYYY-MM-DD.')

    for field in ['glucose', 'haemoglobin', 'cholesterol']:
        try:
            value = float(data[field])
            if value <= 0:
                errors.append(f'{field.capitalize()} must be a positive number.')
        except (ValueError, KeyError):
            errors.append(f'{field.capitalize()} must be a valid number.')

    return errors

# ─── Routes ──────────────────────────────────────────────────────────

# GET all patients
@app.route('/patients', methods=['GET'])
def get_patients():
    patients = Patient.query.all()
    return jsonify([p.to_dict() for p in patients])

# GET single patient
@app.route('/patients/<int:id>', methods=['GET'])
def get_patient(id):
    patient = Patient.query.get_or_404(id)
    return jsonify(patient.to_dict())

# CREATE patient
@app.route('/patients', methods=['POST'])
def create_patient():
    data = request.get_json()

    errors = validate_patient_data(data)
    if errors:
        return jsonify({'errors': errors}), 400

    existing = Patient.query.filter_by(email=data['email']).first()
    if existing:
        return jsonify({'errors': ['A patient with this email already exists.']}), 400

    remarks = get_health_prediction(
        data['full_name'],
        data['glucose'],
        data['haemoglobin'],
        data['cholesterol']
    )

    patient = Patient(
        full_name=data['full_name'],
        date_of_birth=data['date_of_birth'],
        email=data['email'],
        glucose=float(data['glucose']),
        haemoglobin=float(data['haemoglobin']),
        cholesterol=float(data['cholesterol']),
        remarks=remarks
    )

    db.session.add(patient)
    db.session.commit()
    return jsonify(patient.to_dict()), 201

# UPDATE patient
@app.route('/patients/<int:id>', methods=['PUT'])
def update_patient(id):
    patient = Patient.query.get_or_404(id)
    data = request.get_json()

    errors = validate_patient_data(data)
    if errors:
        return jsonify({'errors': errors}), 400

    existing = Patient.query.filter_by(email=data['email']).first()
    if existing and existing.id != id:
        return jsonify({'errors': ['A patient with this email already exists.']}), 400

    remarks = get_health_prediction(
        data['full_name'],
        data['glucose'],
        data['haemoglobin'],
        data['cholesterol']
    )

    patient.full_name = data['full_name']
    patient.date_of_birth = data['date_of_birth']
    patient.email = data['email']
    patient.glucose = float(data['glucose'])
    patient.haemoglobin = float(data['haemoglobin'])
    patient.cholesterol = float(data['cholesterol'])
    patient.remarks = remarks

    db.session.commit()
    return jsonify(patient.to_dict())

# DELETE patient
@app.route('/patients/<int:id>', methods=['DELETE'])
def delete_patient(id):
    patient = Patient.query.get_or_404(id)
    db.session.delete(patient)
    db.session.commit()
    return jsonify({'message': 'Patient deleted successfully.'})

if __name__ == '__main__':
    app.run(debug=True)