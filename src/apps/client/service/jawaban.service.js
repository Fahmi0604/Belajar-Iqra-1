import axios from "axios";
import authHeader from "../../../services/auth-header";

const API_URL = "http://localhost:3001/api/jawaban";

const createJawaban = (data) => {
    return axios.post(API_URL + "/", data, { headers: authHeader() });
}

const getAllJawaban = () => {
    return axios.get(API_URL + '/', { headers: authHeader() });
}

const getJawabanById = (data) => {
    return axios.get(API_URL + '/byid', { headers: authHeader(), params: data });
}

const jawabanService = {
    createJawaban,
    getAllJawaban,
    getJawabanById
};

export default jawabanService;
