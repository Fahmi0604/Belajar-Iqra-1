import axios from "axios";
import authHeader from "../../../services/auth-header";
import URL from "../../../services/API_URL";

const API_URL = URL + "/angkatan";

const createAngkatan = (data) => {
  return axios.post(API_URL + "/", data, { headers: authHeader() });
};

const getAllAngkatan = () => {
  return axios.get(API_URL + "/", { headers: authHeader() });
};

const getAngkatanById = (id) => {
  return axios.get(API_URL + `/${id}`, { headers: authHeader() });
};

const updateAngkatan = (data) => {
  return axios.put(API_URL + "/", data, { headers: authHeader() });
};

const updateStatusAngkatan = (data) => {
  return axios.put(API_URL + "/update_status", data, {
    headers: authHeader(),
  });
};

const deleteAngkatan = (data) => {
  return axios.delete(API_URL + "/", { headers: authHeader(), data });
};

const angkatanService = {
  getAllAngkatan,
  createAngkatan,
  getAngkatanById,
  updateAngkatan,
  updateStatusAngkatan,
  deleteAngkatan,
};

export default angkatanService;
