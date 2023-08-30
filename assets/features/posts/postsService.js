import axios from "axios";
import { API_URL } from "../../data/static_data";

const getAllPosts = async () => {
  
  const response = await axios.get(`${API_URL}/posts/all`);
  return response.data;
};

const getAllLikedPosts = async (token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios.get(`${API_URL}/posts/liked-posts`, config);
  return response.data;
};

const getAllPostsByCategory = async (id) => {
  const response = await axios.get(`${API_URL}/posts/category/${id}`);
  return response.data;
};

const deletePost = async (id, token) => {
  const config = {
    headers: {
      Authorization:  `Bearer ${token}`,
    },
  };
  const response = await axios.delete(`${API_URL}/posts/delete/${id}`, config);
  return response.data;
};


const getPostById =  async (id, token) => {
  const config = {
    headers: {
      Authorization: token && `Bearer ${token}`,
    },
  };
  const response = await axios.get(`${API_URL}/posts/show/${id}`, config);
  return response.data;
}

const postsService = {
  getAllPosts,
  deletePost,
  getPostById,
  getAllPostsByCategory,
  getAllLikedPosts
};

export default postsService;
