import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit";
import {api} from "../api/api";
import { PrivateEndPoints } from "../api/endPoints";
import { apiErrorHandlers } from "../apiErrorHandler/apiErrorHandler";
import type { UserListType } from "../common/type/userListType";
import type { addUserData } from "../common/schema/addUserSchema";
import type { UserDto } from "../common/type/userDto";

export const fetchAllUsers = createAsyncThunk(
    "user/getAllUser",
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get(PrivateEndPoints.GET_User);
            return response.data;
        }
        catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

export const addUser = createAsyncThunk(
    "user/addcourse",
    async (data: addUserData, { rejectWithValue }) => {

        const item: {
            name: string,
            email: string,
            dateOfBirth: string,
            phoneNumber: string,
            password: string,
            isActive: boolean,
            isAdmin: boolean
        } = {
            name: data.name,
            email: data.email,
            dateOfBirth: data.dateOfBirth,
            phoneNumber: data.phoneNumber,
            password: data.password,
            isActive: data.isActive,
            isAdmin: data.isAdmin === "Admin" ? true : false
        }

        try {
            const response = await api.post(PrivateEndPoints.ADD_User, item);
            return response.data.user;
        }
        catch (error: any) {
            const errorResponse = apiErrorHandlers(error);
            return rejectWithValue(errorResponse);
        }
    }
)

export const deleteUser = createAsyncThunk(
    "user/delteUser",
    async (id: string, { rejectWithValue }) => {
        try {
            await api.delete(PrivateEndPoints.DELETE_USER(id));
            return id.toString();
        }
        catch (err: any) {
            const responseError = apiErrorHandlers(err);
            return rejectWithValue(responseError);
        }
    }
)

export const updateUser = createAsyncThunk(
    "user/update", async (data: UserDto, { rejectWithValue }) => {
        try {

            const response = await api.put(PrivateEndPoints.EDIT_USER, data);
            return response.data.user;
        }
        catch (err: any) {
            const responseError = apiErrorHandlers(err);
            return rejectWithValue(responseError);
        }
    }
)

interface UserState {
    items: UserListType[],
    loading: boolean,
    error: string | null,
    editItem: UserListType | null
}

const initialState: UserState = {
    items: [],
    loading: false,
    error: null,
    editItem: null
}

const UserSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        ediUser: (state, action: PayloadAction<UserListType | null>) => {
            state.editItem = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchAllUsers.pending, (state) => {
                state.error = null;
                state.loading = true;
            })
            .addCase(fetchAllUsers.fulfilled, (state, action: PayloadAction<UserListType[]>) => {
                state.loading = false;
                state.items = action.payload;
            })
            .addCase(fetchAllUsers.rejected, (state, action: PayloadAction<any>) => {
                state.loading = false;
                state.error = action.payload;
            });

        builder
            .addCase(addUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addUser.fulfilled, (state, action: PayloadAction<UserListType>) => {
                state.items.push(action.payload);
            })
            .addCase(addUser.rejected, (state, action: PayloadAction<any>) => {
                state.loading = false;
                state.error = action.payload;
            });

        builder
            .addCase(deleteUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteUser.fulfilled, (state, action: PayloadAction<string>) => {
                state.items = state.items.filter(s => s.id !== action.payload);
            })
            .addCase(deleteUser.rejected, (state, action: PayloadAction<any>) => {
                state.loading = false;
                state.error = action.payload;
            });

        builder
            .addCase(updateUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateUser.fulfilled, (state, action: PayloadAction<UserDto>) => {
                state.loading = false;

                const updatedUser = action.payload;
                const index = state.items.findIndex(user => user.id === updatedUser.id);

                if (index !== -1) {
                    state.items[index] = {
                        ...state.items[index],
                        ...updatedUser,
                        dateOfBirth: updatedUser.dateOfBirth ?? "",
                        phoneNumber: updatedUser.phoneNumber ?? "", // 👈 normalize null → ""
                    };
                }
            })
            .addCase(updateUser.rejected, (state, action: PayloadAction<any>) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
});

export default UserSlice.reducer;
export const { ediUser } = UserSlice.actions;