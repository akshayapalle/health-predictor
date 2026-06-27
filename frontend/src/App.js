import React, { useState, useEffect } from 'react';
import { getPatients, createPatient, updatePatient, deletePatient } from './api';
import './App.css';

const emptyForm = {
  full_name: '',
  date_of_birth: '',
  email: '',
  glucose: '',
  haemoglobin: '',
  cholesterol: ''
};

function App() {
  const [patients, setPatients] = useState([]);
  const [formData, setFormData] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      const data = await getPatients();
      setPatients(data);
    } catch (error) {
      console.error('Error fetching patients:', error);
    }
  };

  const handleSubmit = async () => {
    setErrors([]);
    setLoading(true);
    try {
      if (editingId) {
        await updatePatient(editingId, formData);
      } else {
        await createPatient(formData);
      }
      setShowModal(false);
      setFormData(emptyForm);
      setEditingId(null);
      fetchPatients();
    } catch (error) {
      if (error.response && error.response.data.errors) {
        setErrors(error.response.data.errors);
      } else {
        setErrors(['Something went wrong. Please try again.']);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (patient) => {
    setFormData({
      full_name: patient.full_name,
      date_of_birth: patient.date_of_birth,
      email: patient.email,
      glucose: patient.glucose,
      haemoglobin: patient.haemoglobin,
      cholesterol: patient.cholesterol
    });
    setEditingId(patient.id);
    setErrors([]);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this patient?')) {
      await deletePatient(id);
      fetchPatients();
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const openAddModal = () => {
    setFormData(emptyForm);
    setEditingId(null);
    setErrors([]);
    setShowModal(true);
  };

  return (
    <div className="app">
      {/* Header */}
      <header className="header">
        <div className="header-content">
          <div className="header-left">
            <div className="logo">⚕️</div>
            <div>
              <h1>Health Predictor</h1>
              <p>AI-Powered Patient Health Assessment</p>
            </div>
          </div>
          <button className="btn-add" onClick={openAddModal}>
            + Add Patient
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="main">
        {/* Stats Bar */}
        <div className="stats-bar">
          <div className="stat-card">
            <span className="stat-number">{patients.length}</span>
            <span className="stat-label">Total Patients</span>
          </div>
          <div className="stat-card">
            <span className="stat-number">
              {patients.filter(p => p.remarks).length}
            </span>
            <span className="stat-label">Analysed</span>
          </div>
        </div>

        {/* Table */}
        <div className="table-container">
          {patients.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">🏥</div>
              <h3>No patients yet</h3>
              <p>Click "Add Patient" to get started</p>
            </div>
          ) : (
            <table className="table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Full Name</th>
                  <th>Date of Birth</th>
                  <th>Email</th>
                  <th>Glucose</th>
                  <th>Haemoglobin</th>
                  <th>Cholesterol</th>
                  <th>Remarks</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {patients.map((patient, index) => (
                  <tr key={patient.id}>
                    <td>{index + 1}</td>
                    <td><strong>{patient.full_name}</strong></td>
                    <td>{patient.date_of_birth}</td>
                    <td>{patient.email}</td>
                    <td>{patient.glucose} <span className="unit">mg/dL</span></td>
                    <td>{patient.haemoglobin} <span className="unit">g/dL</span></td>
                    <td>{patient.cholesterol} <span className="unit">mg/dL</span></td>
                    <td>
                      <button
                        className="btn-remarks"
                        onClick={() => setSelectedPatient(patient)}
                      >
                        View Remarks
                      </button>
                    </td>
                    <td>
                      <button className="btn-edit" onClick={() => handleEdit(patient)}>Edit</button>
                      <button className="btn-delete" onClick={() => handleDelete(patient.id)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </main>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingId ? 'Edit Patient' : 'Add New Patient'}</h2>
              <button className="modal-close" onClick={() => setShowModal(false)}>✕</button>
            </div>

            {errors.length > 0 && (
              <div className="error-box">
                {errors.map((err, i) => <p key={i}>⚠ {err}</p>)}
              </div>
            )}

            <div className="form-grid">
              <div className="form-group">
                <label>Full Name</label>
                <input
                  type="text"
                  name="full_name"
                  value={formData.full_name}
                  onChange={handleChange}
                  placeholder="John Doe"
                />
              </div>
              <div className="form-group">
                <label>Date of Birth</label>
                <input
                  type="date"
                  name="date_of_birth"
                  value={formData.date_of_birth}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group full-width">
                <label>Email Address</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="john@example.com"
                />
              </div>
              <div className="form-group">
                <label>Glucose (mg/dL)</label>
                <input
                  type="number"
                  name="glucose"
                  value={formData.glucose}
                  onChange={handleChange}
                  placeholder="90"
                />
              </div>
              <div className="form-group">
                <label>Haemoglobin (g/dL)</label>
                <input
                  type="number"
                  name="haemoglobin"
                  value={formData.haemoglobin}
                  onChange={handleChange}
                  placeholder="14"
                />
              </div>
              <div className="form-group">
                <label>Cholesterol (mg/dL)</label>
                <input
                  type="number"
                  name="cholesterol"
                  value={formData.cholesterol}
                  onChange={handleChange}
                  placeholder="180"
                />
              </div>
            </div>

            <div className="modal-footer">
              <button className="btn-cancel" onClick={() => setShowModal(false)}>Cancel</button>
              <button className="btn-save" onClick={handleSubmit} disabled={loading}>
                {loading ? '⏳ Analysing with AI...' : editingId ? 'Update Patient' : 'Save & Analyse'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Remarks Modal */}
      {selectedPatient && (
        <div className="modal-overlay" onClick={() => setSelectedPatient(null)}>
          <div className="modal remarks-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>AI Health Remarks</h2>
              <button className="modal-close" onClick={() => setSelectedPatient(null)}>✕</button>
            </div>
            <div className="remarks-content">
              <div className="patient-info">
                <p><strong>Patient:</strong> {selectedPatient.full_name}</p>
                <p><strong>Email:</strong> {selectedPatient.email}</p>
              </div>
              <div className="remarks-box">
                <h4>🤖 AI Prediction</h4>
                <p>{selectedPatient.remarks}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;