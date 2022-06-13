import axios from "axios";
import authHeader from "../../../services/auth-header";
import URL from "../../../services/API_URL";

const API_URL = URL + "/tugas";

const createTugas = (data) => {
    return axios.post(API_URL + "/", data, { headers: authHeader() });
}

const getAllTugas = () => {
    return axios.get(API_URL + "/", { headers: authHeader() });
}

const getTugasById = (id) => {
    return axios.get(API_URL + `/${id}`, { headers: authHeader() });
}

const updateTugas = (data) => {
    return axios.put(API_URL + '/', data, { headers: authHeader() });
}

const deleteTugas = (data) => {
    return axios.delete(API_URL + '/', { headers: authHeader(), data });
}

const tugasService = {
    getAllTugas,
    createTugas,
    getTugasById,
    updateTugas,
    deleteTugas
};

export default tugasService;
