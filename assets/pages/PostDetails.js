import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { getPostById } from "../features/posts/postsSlice";
import { API_URL, IMAGE_LINK, TOKEN_LOCAL_STORAGE } from "../data/static_data";
import moment from "moment/moment";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import axios from "axios";
import Swal from "sweetalert2";

function PostDetails() {
  const { post, isLoading } = useSelector((state) => state.posts);
  const dispatch = useDispatch();
  const { id } = useParams();
  const [isLiked, setIsLiked] = useState(null);
  const [numberOfLikes, setNumberOfLikes] = useState(0)

  const token = localStorage.getItem(TOKEN_LOCAL_STORAGE)
    ? JSON.parse(localStorage.getItem(TOKEN_LOCAL_STORAGE))
    : null;

  useEffect(() => {
    if (id) {
      dispatch(getPostById(id));
    }
  }, [dispatch, id]);

  if (post && isLiked == null) {
    setIsLiked(post.is_liked);
    setNumberOfLikes(post.likes)
  }

  const likePost = async (id) => {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    await axios
      .get(`${API_URL}/posts/like/${id}`, config)
      .then(() => {
        setIsLiked(true);
        setNumberOfLikes(numberOfLikes + 1)
      })
      .catch((error) => {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Something went wrong!",
        });
      });
  };

  const removeLike = async (id) => {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    await axios
      .get(`${API_URL}/posts/dislike/${id}`, config)
      .then(() => {
        setIsLiked(false);
        setNumberOfLikes(numberOfLikes - 1)
      })
      .catch((error) => {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Something went wrong!",
        });
      });
  };

  return (
    <>
      {isLoading ? (
        <p>Loading ...</p>
      ) : (
        <div className="w-max-[1440px] w-full flex justify-center items-center md:h-[80vh]">
          {post && (
            <div className="w-full md:w-[70%] p-2">
              <div className="flex w-full justify-center items-center">
                <div className="md:flex md:space-x-10">
                  {post.image && (
                    <div className="">
                      <img
                        src={`${IMAGE_LINK}${post.image}`}
                        className="w-fit h-64"
                        alt=""
                      />
                    </div>
                  )}
                  <div>
                    <h1 className="font-bold font-Heebo text-2xl text-center my-4">
                      {post.title}
                    </h1>
                    {post.category && (
                      <h2 className="text-gray-400 font-Heebo text-xl text-center my-4">
                        {" "}
                        Category: {post.category.name}
                      </h2>
                    )}
                    <div className="my-2">
                      { isLiked ? (
                        <div className="flex space-x-3 ">
                          <AiFillHeart
                            onClick={() => {
                              removeLike(post.id);
                            }}
                            size={25}
                            className="cursor-pointer"
                            color="red"
                          />{" "}
                          <p>Likes: {numberOfLikes}</p>{" "}
                        </div>
                      ) : (
                        <div className="flex space-x-3 ">
                          <AiOutlineHeart
                            onClick={() => {
                              likePost(post.id);
                            }}
                            size={25}
                            className="cursor-pointer"
                          />{" "}
                          <p>Likes: {numberOfLikes}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <p>{post.content}</p>

              <div className="w-full flex justify-end items-end">
                <p className="text-sm text-gray-400">
                  Created: {moment().format("DD.MM.YYYY", post.created_at.date)}
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
}

export default PostDetails;
