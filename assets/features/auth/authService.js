import axios from "axios";
import { API_URL, TOKEN_LOCAL_STORAGE } from "../../data/static_data";

const login = async (data) => {
  const response = await axios.post(`${API_URL}/login_check`, data);

  if (response.data) {
    localStorage.setItem(
      TOKEN_LOCAL_STORAGE,
      JSON.stringify(response.data.token)
    );
  }

  return response.data;
};

//LOGOUT USER
const logout = () => localStorage.removeItem(TOKEN_LOCAL_STORAGE);

//CHECK CURRENT USER
const currentUser = async (token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios.get(`${API_URL}/current-user`, config);
  return response.data;
};

const authService = {
  login,
  logout,
  currentUser,
};

export default authService;
