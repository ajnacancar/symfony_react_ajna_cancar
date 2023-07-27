import React from "react";
import PostForm from "../components/PostForm";

function AdminCreateNewPost() {
  return (
    <div className="w-max-[1440px] w-full flex justify-center my-20 md:h-[80vh]">
      <div className="w-full md:w-[70%] p-2">
        <PostForm formTitle="New Blog Post" isNew={true} />
      </div>
    </div>
  );
}

export default AdminCreateNewPost;
