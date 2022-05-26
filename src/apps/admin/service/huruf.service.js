import axios from "axios";
import authHeader from "../../../services/auth-header";

const API_URL = "http://localhost:3001/api/huruf";

const getAllHuruf = () => {
  return axios.get(API_URL + "/", { headers: authHeader() });
}

const getHurufById = (id) => {
  return axios.get(API_URL + `/${id}`, { headers: authHeader() });
}



const hurufService = {
  getAllHuruf,
  getHurufById,
};

export default hurufService;
