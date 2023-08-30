import React from "react";
import { Link } from "react-router-dom";
import { IMAGE_LINK } from "../data/static_data";
import moment from "moment";

function PostCard({ post }) {
  return (
    <Link
      key={post.id}
      to={`/post/${post.id}`}
      className="col-span-1 p-2 shadow-md h-full"
    >
      <div className="w-full flex justify-center">
        {post.image && (
          <img
            src={`${IMAGE_LINK}${post.image}`}
            className="w-full h-72"
            alt=""
          />
        )}
      </div>
      <h1 className="text-2xl font-bold">{post.title.substring(0, 50)}...</h1>
      <p>{post.content.substring(0, 150)}...</p>
      <div className="w-full flex items-center justify-between">
        <p className="text-sm text-gray-400">Likes: {post.likes}</p>

        <p className="text-sm text-gray-400">
          Created: {moment().format("DD.MM.YYYY", post.created_at.date)}
        </p>
      </div>
    </Link>
  );
}

export default PostCard;
