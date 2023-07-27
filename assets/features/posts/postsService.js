import axios from "axios";


//GET ALL POSTS
//author: Ajna Cancar
//mail: ajna.cancar2019@size.ba
const getAllPosts = async () => {
  const response = await axios.get("/api/posts/all");
  return response.data;
};

//DELETE POST
//author: Ajna Cancar
//mail: ajna.cancar2019@size.ba
const deletePost = async (id, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await axios.delete(`/api/posts/delete/${id}`, config);
  return response.data;
};


//GET POST BY ID
//author: Ajna Cancar
//mail: ajna.cancar2019@size.ba
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
