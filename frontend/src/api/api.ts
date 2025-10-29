import axios, { type InternalAxiosRequestConfig } from "axios";
import { PublicEndPoint } from "./endPoints"
import { logout, tokenSet } from "../features/authSlice";
import type { loginResponseType } from "../common/type/loginResponseType";

const api = axios.create({
    baseURL: "http://localhost:5173/api",
    headers: {
        "Content-Type": "application/json",
    },
});

let appStore: any = null;

const interceptor = {
    setup: async (store: any) => {

        appStore = store;

        api.interceptors.request.use(
            (config: InternalAxiosRequestConfig) => {

                const isPublicEndPoint = Object.values(PublicEndPoint).some((url) =>
                    config.url?.includes(url)
                );

                if (!isPublicEndPoint) {
                    const token = appStore.getState().AuthStore.LoginDetails.accessToken;
                    if (token && config.headers) {
                        config.headers.Authorization = `Bearer ${token}`;
                    }
                }
                return config;

            },
            (error: any) => {
                return Promise.reject(error);
            }
        );

        api.interceptors.response.use(
            (response) => response,
            async (error) => {

                const originalRequest = error.config;

                if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {

                    originalRequest._retry = true;

                    try {
                        const refreshTokenLC = appStore.getState().AuthStore.LoginDetails?.refreshToken;

                        if (!refreshTokenLC) {
                            throw new Error("Refresh Token Not Found");
                        }

                        const response = await axios.post(
                            "http://localhost:5173/api/Account/Refresh",
                            { refreshToken: refreshTokenLC }
                        );

                        const newAccessTokenLC = response.data.accessToken;
                        const newRefreshTokenLC = response.data.refreshToken;
                        const newExpirtTimeLC = response.data.expiresAt;

                        if (!newAccessTokenLC || !newRefreshTokenLC) {
                            throw new Error("Server 500 Error");
                        }

                        const tokensState: loginResponseType = {
                            refreshToken: newRefreshTokenLC,
                            accessToken: newAccessTokenLC,
                            ExpiresAt: newExpirtTimeLC
                        }

                        appStore.dispatch(tokenSet(tokensState));

                        originalRequest.headers.Authorization = `Bearer ${newAccessTokenLC}`;
                        return api(originalRequest);

                    } catch (err: any) {
                        console.error("Refresh token failed:", err);
                        appStore.dispatch(logout());
                        return Promise.reject(err);
                    }
                }

                return Promise.reject(error);
            }
        );
    }
}

export { api, interceptor };