import axios from "axios";
import authHeader from "../../../services/auth-header";
import URL from "../../../services/API_URL";

const API_URL = URL + "/toko";

const getAllToko = () => {
  return axios.get(API_URL + "/", { headers: authHeader() });
};

const getTokoById = (id) => {
  return axios.get(API_URL + `/${id}`, { headers: authHeader() });
};

const updateToko = (data) => {
  return axios.put(API_URL + "/", data, { headers: authHeader() });
};

const tokoService = {
  getAllToko,
  getTokoById,
  updateToko,
};

export default tokoService;
