from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

db = SQLAlchemy()

class Patient(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    full_name = db.Column(db.String(100), nullable=False)
    date_of_birth = db.Column(db.String(20), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    glucose = db.Column(db.Float, nullable=False)
    haemoglobin = db.Column(db.Float, nullable=False)
    cholesterol = db.Column(db.Float, nullable=False)
    remarks = db.Column(db.Text, nullable=True)

    def to_dict(self):
        try:
            dob = datetime.strptime(self.date_of_birth, '%Y-%m-%d')
            formatted_dob = dob.strftime('%d/%m/%Y')
        except:
            formatted_dob = self.date_of_birth

        return {
            'id': self.id,
            'full_name': self.full_name,
            'date_of_birth': formatted_dob,
            'email': self.email,
            'glucose': self.glucose,
            'haemoglobin': self.haemoglobin,
            'cholesterol': self.cholesterol,
            'remarks': self.remarks
        }