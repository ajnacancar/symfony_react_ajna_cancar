import axios from "axios";
import React, { useEffect } from "react";
import { BiSolidTrashAlt, BiWorld } from "react-icons/bi";
import { MdEdit } from "react-icons/md";
import Swal from "sweetalert2";
import { useDispatch, useSelector } from "react-redux";
import { deletePost, reset } from "../features/posts/postsSlice";
import { Link } from "react-router-dom";

function PostActions({ id }) {
  const { token } = useSelector((state) => state.auth);
  const { crudSuccess, isError } = useSelector((state) => state.posts);
  const dispatch = useDispatch();

  const onDelete = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(deletePost(id));
      }
    });
  };

  useEffect(() => {
    if (crudSuccess) {
      Swal.fire("Deleted!", "Your post has been deleted.", "success");
      dispatch(reset());
    }
  }, [crudSuccess, dispatch]);
  return (
    <div className="flex items-center space-x-4 text-blue-400">
      <Link to={`/post/${id}`}>
        <BiWorld size={25} className="cursor-pointer" />
      </Link>

      <Link to={`/post-edit/${id}`}>
        <MdEdit size={25} />
      </Link>

      <BiSolidTrashAlt
        size={25}
        className="cursor-pointer"
        onClick={onDelete}
      />
    </div>
  );
}

export default PostActions;
