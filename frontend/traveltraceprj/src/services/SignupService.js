import axios from "axios";

const API_URL = "http://localhost:8000/";

const login = (email, password) => {
  return axios
    .post(API_URL + "token/", {
      email,
      password,
    })
    .then((response) => {
      if (response.data.access) {
        localStorage.setItem("access_token", response.data.access);
      }

      return response.data;
    });
};

const logout = () => {
  localStorage.removeItem("access_token");
};

const register = async (username, email, password) => {
  try {
    const response = await axios.post(API_URL + "accounts/signup/", {
      username,
      email,
      password,
    });

    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to create account");
  }
};

const getCurrentUser = async () => {
  const accessToken = localStorage.getItem("access_token");

  if (!accessToken) {
    return Promise.reject("No access token found");
  }

  try {
    const response = await axios.get(API_URL + "current_user/", {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });

    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to fetch user information");
  }
};

export default {
  login,
  logout,
  register,
  getCurrentUser,
};
