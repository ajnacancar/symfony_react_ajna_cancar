import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllPosts, getAllPostsByCategory } from "../features/posts/postsSlice";
import { getAllCategories } from "../features/category/categorySlice";
import PostCard from "../components/PostCard";

function HomePage() {
  const { isLoading, posts } = useSelector((state) => state.posts);
  const { categories } = useSelector((state) => state.category);

  const dispatch = useDispatch();

  const filteredByCategoty = (id) =>{
    dispatch(getAllPostsByCategory(id))
  }

  useEffect(() => {
    dispatch(getAllPosts());
    dispatch(getAllCategories());
  }, []);

  return (
    <>
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <div className="w-full flex justify-center">
          <div className="max-w-[1400px] w-full h-full px-5 my-10">
            <div className="w-full w-max-[700px] flex items-center justify-center mb-5">
              <div className="flex items-center space-x-5">
                {categories && categories.length > 0 && (
                  <>
                    <p onClick={() => {dispatch(getAllPosts())}} className="bg-zinc-200 px-3 rounded-md text-sm text-gray-500 cursor-pointer hover:border hover:border-zinc-200 hover:bg-transparent ">
                      All
                    </p>

                    {categories.map((category) => (
                      <p
                      onClick={() => {filteredByCategoty(category.id)}}
                        key={category.id}
                        className="bg-zinc-200 px-3 rounded-md text-sm text-gray-500 cursor-pointer hover:border hover:border-zinc-200 hover:bg-transparent "
                      >
                        {category.name}
                      </p>
                    ))}
                  </>
                )}
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {posts &&
                posts.length > 0 &&
                posts.map((post) => (
                  <PostCard post={post} />
                ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default HomePage;
