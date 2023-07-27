import axios from "axios";

const getAllPosts = async () => {
  const response = await axios.get("/api/posts/all");
  return response.data;
};

const deletePost = async (id, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios.delete(`/api/posts/delete/${id}`, config);
  return response.data;
};


const getPostById =  async (id) => {
  const response = await axios.get(`/api/posts/show/${id}`);
  return response.data;
}

const postsService = {
  getAllPosts,
  deletePost,
  getPostById
};

export default postsService;
