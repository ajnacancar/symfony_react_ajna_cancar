import React, { useEffect } from "react";
import PostForm from "../components/PostForm";
import { useDispatch, useSelector } from "react-redux";
import { getPostById } from "../features/posts/postsSlice";
import { useParams } from "react-router-dom";

function AdminEditPost() {
  const { post } = useSelector((state) => state.posts);
  const dispatch = useDispatch();
  const { id } = useParams();

  useEffect(() => {
    dispatch(getPostById(id));
  }, [dispatch, id]);

  return (
    <div className="w-max-[1440px] w-full flex justify-center  my-10">
      <div className="w-full md:w-[70%] p-2">
        {post && (
          <PostForm formTitle="Edit Blog Post" isNew={false} post={post} />
        )}
      </div>
    </div>
  );
}

export default AdminEditPost;
