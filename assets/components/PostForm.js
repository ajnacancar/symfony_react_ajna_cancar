import axios from "axios";
import React, { useState } from "react";
import { AiOutlineCloudUpload } from "react-icons/ai";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { IMAGE_LINK } from "../data/static_data";

function PostForm({ formTitle, post, isNew }) {
  const { token } = useSelector((state) => state.auth);
  const [title, setTitle] = useState(post ? post.title : "");
  const [content, setContent] = useState(post ? post.content : "");
  const [image, setImage] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    formData.append("image", image);
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    if (isNew) {
      await axios
        .post("/api/posts/new", formData, config)
        .then((res) => {
          Swal.fire("Created!", "Your post has been created.", "success");
          setTitle("");
          setImage(null);
          setContent("");
        })
        .catch((error) => {
          if (
            error.response.data &&
            error.response.data.code &&
            error.response.data.code === 401
          ) {
            navigate("/login");
          }
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Something went wrong!",
          });
        });
    } else {
      await axios
        .post(`/api/posts/edit/${post.id}`, formData, config)
        .then((res) => {
          Swal.fire("Upadted!", "Your post has been updated.", "success");
        })
        .catch((error) => {
          if (
            error.response.data &&
            error.response.data.code &&
            error.response.data.code === 401
          ) {
            navigate("/login");
          }
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Something went wrong!",
          });
        });
    }
  };

  return (
    <div className="w-full">
      <h1 className="text-xl my-4 text-center">{formTitle}</h1>

      <form
        onSubmit={(e) => {
          handleSubmit(e);
        }}
        className="w-full p-2"
      >
        <div className="w-full flex md:flex-row flex-col justify-between items-start">
          <div className="md:w-1/2 w-full p-4">
            <div className="w-full md:my-4 my-2">
              <label htmlFor="title" className="text-blue-400 my-2">
                Title
              </label>
              <input
                required
                id="title"
                name="title"
                type="text"
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                }}
                className="w-full border border-blue-400 focus:outline-none p-2 rounded-sm"
              />
            </div>

            <div className="w-full md:my-4 my-2">
              <label htmlFor="content" className="text-blue-400 my-2">
                Content
              </label>
              <textarea
                value={content}
                onChange={(e) => {
                  setContent(e.target.value);
                }}
                rows={15}
                id="content"
                name="title"
                type="text"
                className="w-full border border-blue-400 focus:outline-none p-2 rounded-sm"
              ></textarea>
            </div>
          </div>

          <div className="md:w-1/2 w-full p-4">
            <div className="w-full md:my-4 my-2">
              <label className="text-blue-400 my-2">Feature Image</label>
              {image || (post && post.image) ? (
                <div className="w-full">
                  <div className="w-full flex justify-center items-center">
                    {image && (
                      <img
                        src={URL.createObjectURL(image)}
                        className="w-fit h-64"
                        alt=""
                      />
                    )}

                    {post && post.image && !image && (
                      <img
                        src={`${IMAGE_LINK}${post.image}`}
                        className="w-fit h-64"
                        alt=""
                      />
                    )}
                  </div>
                  <div className="w-full flex justify-between items-center my-2">
                    <div>
                      <label
                        htmlFor="inputImage"
                        className="text-blue-400 cursor-pointer"
                      >
                        Select Image
                      </label>
                      <input
                        onChange={(e) => setImage(e.target.files[0])}
                        id="inputImage"
                        type="file"
                        className="hidden"
                      />
                    </div>
                    <div>
                      <p
                        className="text-red-500 cursor-pointer"
                        onClick={() => setImage(null)}
                      >
                        Remove Image
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center w-full">
                  <label
                    htmlFor="dropzone-file"
                    className="flex flex-col items-center justify-center w-full h-64 border border-blue-400"
                  >
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <AiOutlineCloudUpload size={30} />
                      <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                        <span className="font-semibold">Click to upload</span>{" "}
                        or drag and drop
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        SVG, PNG, JPG or GIF (MAX. 800x400px)
                      </p>
                    </div>
                    <input
                      onChange={(e) => setImage(e.target.files[0])}
                      id="dropzone-file"
                      type="file"
                      className="hidden"
                    />
                  </label>
                </div>
              )}

              <div className="w-full flex justify-between items-center my-5">
                <Link
                  to={"/all-posts"}
                  className="bg-gray-500 px-4 py-2 text-white font-Heebo rounded-sm"
                >
                  Cancel
                </Link>

                <button
                  type="submit"
                  className="bg-green-500 px-4 py-2 text-white font-Heebo rounded-sm"
                >
                  Publish Post
                </button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

export default PostForm;
