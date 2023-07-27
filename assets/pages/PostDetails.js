import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { getPostById } from "../features/posts/postsSlice";
import { IMAGE_LINK } from "../data/static_data";

function PostDetails() {
  const { post } = useSelector((state) => state.posts);
  const dispatch = useDispatch();
  const { id } = useParams();

  useEffect(() => {
    dispatch(getPostById(id));
  }, [dispatch, id]);
  return (
    <div className="w-max-[1440px] w-full flex justify-center items-center md:h-[80vh]">
      {post && (
        <div className="w-full md:w-[70%] p-2">
          <div className="w-full flex justify-center">
            <img
              src={`${IMAGE_LINK}${post.image}`}
              className="w-fit h-64"
              alt=""
            />
          </div>
          <h1 className="font-bold font-Heebo text-2xl text-center my-4">
            {post.title}
          </h1>
          <p>{post.content}</p>
        </div>
      )}
    </div>
  );
}

export default PostDetails;
