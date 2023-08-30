import axios from "axios";
import { API_URL } from "../../data/static_data";

const getAllCategories = async () => {
  const response = await axios.get(`${API_URL}/category/all`);
  return response.data;
};

const categoryService = {
  getAllCategories
};

export default categoryService;
