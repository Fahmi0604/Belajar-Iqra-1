import axios from "axios";
import authHeader from "./auth-header";
import url from "./API_URL";

const API_URL = url + "/users";

const createUser = (data) => {
  return axios.post(API_URL + "/", data, { headers: authHeader() });
};

const getAllUsers = () => {
  return axios.get(API_URL + "/", { headers: authHeader() });
};

const getUserById = (id) => {
  return axios.get(API_URL + `/${id}`, { headers: authHeader() });
};

const updateGuru = (data) => {
  return axios.put(API_URL + "/update_guru", data, { headers: authHeader() });
};

const updateSiswa = (data) => {
  return axios.put(API_URL + "/update_siswa", data, { headers: authHeader() });
};

const updateFotoProfil = (data) => {
  return axios.put(API_URL + "/update_foto", data, { headers: authHeader() });
};

const updateCoin = (data) => {
  return axios.put(API_URL + "/update_coin", data, { headers: authHeader() });
};

const deleteUser = (data) => {
  return axios.delete(API_URL + "/", { headers: authHeader(), data });
};

const deleteAllUserByIdAngkatan = (data) => {
  return axios.delete(API_URL + "/deleteByIdAngkatan", {
    headers: authHeader(),
    data,
  });
};

const userService = {
  getAllUsers,
  getUserById,
  createUser,
  updateGuru,
  updateSiswa,
  updateFotoProfil,
  updateCoin,
  deleteUser,
  deleteAllUserByIdAngkatan,
};

export default userService;
