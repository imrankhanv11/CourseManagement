import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit";
import { apiErrorHandlers } from "../apiErrorHandler/apiErrorHandler";
import { PublicEndPoint } from "../api/endPoints";
import { api } from "../api/api";
import { type RegisterFormData } from "../common/schema/registerFormSchema";
import { type LognFormData } from "../common/schema/loginFromSchema";
import type { loginResponseType } from "../common/type/loginResponseType";

export interface LoginUser {
    accessToken: string,
    refreshToken: string,
    expireAt: string
}

export interface AuthState {
    LoginDetails: LoginUser | null;
    isAuthenticated: boolean;
    loading: boolean;
    error: string | null;
}

const initialState: AuthState = {
    LoginDetails: null,
    isAuthenticated: false,
    loading: false,
    error: null,
};

// User Resgister
export const registerUser = createAsyncThunk(
    "user/register", async (user: RegisterFormData, { rejectWithValue }) => {
        try {
            await api.post(PublicEndPoint.REGISTER, user);
        }
        catch (err: any) {
            const errorResponse = apiErrorHandlers(err);
            return rejectWithValue(errorResponse.message);
        }
    }
)

// User Login
export const loginUser = createAsyncThunk(
    "user/login", async (user: LognFormData, { rejectWithValue }) => {
        try {
            const response = await api.post(PublicEndPoint.LOGIN, user);
            return response.data;
        }
        catch (err: any) {
            const errorResponse = apiErrorHandlers(err);
            return rejectWithValue(errorResponse.message);
        }
    }
)

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        logout: (state) => {
            state.LoginDetails = null;
            state.isAuthenticated = false;
            state.loading = false;
            state.error = null;
        },
        tokenSet: (state, action: PayloadAction<loginResponseType>) => {
            state.LoginDetails = {
                accessToken: action.payload.accessToken,
                refreshToken: action.payload.refreshToken,
                expireAt: action.payload.ExpiresAt
            }
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(registerUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(registerUser.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(registerUser.rejected, (state, action: PayloadAction<any>) => {
                state.loading = false;
                state.error = action.payload;
            });

        builder.addCase(
            loginUser.fulfilled,
            (state, action: PayloadAction<loginResponseType>) => {
                state.isAuthenticated = true;
                state.LoginDetails = {
                    accessToken: action.payload.accessToken,
                    refreshToken: action.payload.refreshToken,
                    expireAt: action.payload.ExpiresAt,
                };
            }
        );

    },
});

export const { logout, tokenSet } = authSlice.actions;
export default authSlice.reducer;