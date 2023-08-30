import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { getAllLikedPosts } from '../features/posts/postsSlice';
import PostCard from '../components/PostCard';

function LikedPosts() {
    const { isLoading, posts } = useSelector((state) => state.posts);
    const dispatch = useDispatch()

    useEffect(() => {
      dispatch(getAllLikedPosts())
    }, [])
    

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
                <PostCard post={post} />
              ))}
          </div>
        </div>
      </div>
    )}
  </>
)
  
}

export default LikedPosts