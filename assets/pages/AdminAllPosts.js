import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllPosts } from "../features/posts/postsSlice";
import { columns_table_all_posts } from "../data/static_data";
import { DataGrid } from "@material-ui/data-grid";
import moment from "moment/moment";

function AdminAllPosts() {
  const { isLoading, posts, crudSuccess } = useSelector((state) => state.posts);
  const rows = [];

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAllPosts());
  }, [dispatch, crudSuccess]);

  posts &&
    posts.length > 0 &&
    posts.forEach((post) => {
      rows.push({
        id: post.id,
        title: post.title,
        category: post.category.name,
        date: moment().format("DD.MM.YYYY", post.created_at.date),
      });
    });

  return (
    <div className="w-max-[1440px] w-full flex justify-center items-center h-[80vh]">
      <div className="w-full md:w-1/2 p-2">
        <h1 className="my-4 text-xl">Blog Posts List</h1>
        <DataGrid
          rows={rows}
          columns={columns_table_all_posts}
          pageSize={10}
          disableSelectionOnClick
          autoHeight
        />
      </div>
    </div>
  );
}

export default AdminAllPosts;
