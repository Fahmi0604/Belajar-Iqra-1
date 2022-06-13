import axios from "axios";
import authHeader from "../../../services/auth-header";
import authHeader2 from "../../../services/auth-header2";

import URL from "../../../services/API_URL";

const API_URL = URL + "/soal";

const createSoal = (data) => {
    return axios.post(API_URL + "/", data, { headers: authHeader() });
}

// api createSoal no 2 disendirikan karena memakai FormData dan juga contentType nya yang berbeda
const createSoal2 = (data) => {
    return axios.post(API_URL + '/createSoal2', data, { headers: authHeader2() });
}

const getSoalByIdTugas = (id) => {
    return axios.get(API_URL + `/${id}`, { headers: authHeader() });
}

const getSoalByIdSoal = (id) => {
    return axios.get(API_URL + `byid/${id}`, { headers: authHeader() });
}

const updateSoal = (data) => {
    return axios.put(API_URL + '/', data, { headers: authHeader() });
}

const deleteSoal = (data) => {
    return axios.delete(API_URL + '/', { headers: authHeader(), data });
}

const soalService = {
    createSoal,
    createSoal2,
    getSoalByIdTugas,
    getSoalByIdSoal,
    updateSoal,
    deleteSoal
};

export default soalService;
