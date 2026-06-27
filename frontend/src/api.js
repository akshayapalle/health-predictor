import axios from 'axios';

const API_BASE_URL = 'http://127.0.0.1:5000';

export const getPatients = async () => {
    const response = await axios.get(`${API_BASE_URL}/patients`);
    return response.data;
};

export const createPatient = async (patientData) => {
    const response = await axios.post(`${API_BASE_URL}/patients`, patientData);
    return response.data;
};

export const updatePatient = async (id, patientData) => {
    const response = await axios.put(`${API_BASE_URL}/patients/${id}`, patientData);
    return response.data;
};

export const deletePatient = async (id) => {
    const response = await axios.delete(`${API_BASE_URL}/patients/${id}`);
    return response.data;
};