import axios from "axios";
import authHeader from "../../../services/auth-header";
import URL from "../../../services/API_URL";

const API_URL = URL + "/huruf";

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
