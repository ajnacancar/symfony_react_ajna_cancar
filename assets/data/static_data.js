import PostActions from "../components/PostActions";
import React from "react";

export const TOKEN_LOCAL_STORAGE = "token";

export const columns_table_all_posts = [
  {
    field: "title",
    headerName: "TITLE",
    minWidth: 150,
    flex: 1,
  },
  {
    field: "date",
    headerName: "DATE",
    minWidth: 150,
    flex: 0.5,
  },
  {
    field: "category",
    headerName: "CATEGORY",
    minWidth: 150,
    flex: 0.5,
  },
  {
    field: "actions",
    headerName: "ACTIONS",
    minWidth: 150,
    renderCell: (params) => <PostActions id={params.id} />,
    flex: 0.7,
  },
];

export const IMAGE_LINK = "http://localhost:8000/uploads/image_directory/";
export const API_URL = "http://localhost:8000/api"
