import React from "react";
import { Navigate } from "react-router-dom";

function ProtectedRoute({ token, children, data }) {
  if (token && data) {
    return children;
  } else {
    return <Navigate to={`/login`} />;
  }
}

export default ProtectedRoute;
