import axios from "axios";
import URL from "./API_URL";

const API_URL = URL + "/users";

const login = (username, password) => {
  return axios
    .post(API_URL + "/login", {
      username,
      password,
    })
    .then((response) => {
    console.log(response);

      if (response.data.token) {
        localStorage.setItem("user", JSON.stringify(response.data));
      }

      return response.data;
    });
};

const logout = () => {
  localStorage.removeItem("user");
};

const getCurrentUser = () => {
  return JSON.parse(localStorage.getItem("user"));
};

const authService = {
  login,
  logout,
  getCurrentUser,
};

export default authService;