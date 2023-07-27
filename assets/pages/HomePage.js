import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllPosts } from "../features/posts/postsSlice";
import { Link } from "react-router-dom";
import { IMAGE_LINK } from "../data/static_data";

function HomePage() {
  const { isLoading, posts } = useSelector((state) => state.posts);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAllPosts());
  }, []);

  return (
    <>
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <div className="w-full flex justify-center">
          <div className="max-w-[1400px] w-full h-full px-5 my-10">
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {posts &&
                posts.length > 0 &&
                posts.map((post) => (
                  <Link
                    key={post.id}
                    to={`/post/${post.id}`}
                    className="col-span-1 p-2 shadow-md h-full"
                  >
                    <div className="w-full flex justify-center">
                      <img
                        src={`${IMAGE_LINK}${post.image}`}
                        className="w-full h-72"
                        alt=""
                      />
                    </div>
                    <h1 className="text-2xl font-bold">
                      {post.title.substring(0, 50)}...
                    </h1>
                    <p>{post.content.substring(0, 150)}...</p>
                  </Link>
                ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default HomePage;
