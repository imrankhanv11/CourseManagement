import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import useDecodeToken from "../hooks/useDecodeToken";
import type { AppDispathStore, RootStateStore } from "../store/store";
import { logout } from "../features/authSlice";

interface ProtectedRoutesProbls {
    allowedRole: boolean;
}

const ProtectedRoutes: React.FC<ProtectedRoutesProbls> = ({ allowedRole }) => {

    const userRole = useDecodeToken();
    const isAuthenticated = useSelector((state: RootStateStore) => state.AuthStore.isAuthenticated);
    const dispatch = useDispatch<AppDispathStore>();

    if (!userRole || !isAuthenticated) {
        return <Navigate to='/' replace />
    }

    try {
        if (allowedRole && userRole === "True") {
            return <Outlet />
        }

        if (!allowedRole && userRole === "False") {
            return <Outlet />
        }
        return <Navigate to='/' replace />;
    }
    catch (err: any) {
        dispatch(logout());
        return <Navigate to='/login' replace />
    }
};

export default React.memo(ProtectedRoutes);