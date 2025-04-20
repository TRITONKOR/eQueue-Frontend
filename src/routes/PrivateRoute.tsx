import React from "react";
import { Navigate } from "react-router";
import { useAdminAuth } from "../context/AdminAuthContext";

const PrivateRoute: React.FC<{ children: React.ReactElement }> = ({
    children,
}) => {
    const { isAdmin } = useAdminAuth();

    return isAdmin ? children : <Navigate to="/admin/login" />;
};

export default PrivateRoute;
