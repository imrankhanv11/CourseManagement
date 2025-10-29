import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit";
import {api} from "../api/api";
import { PrivateEndPoints } from "../api/endPoints";
import type { courseListType } from "../common/type/courseListType";
import type { addCourseData } from "../common/schema/addCourseSchema";
import { apiErrorHandlers } from "../apiErrorHandler/apiErrorHandler";

export const fetchAllCourse = createAsyncThunk(
    "course/getallCourse",
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get(PrivateEndPoints.GET_COURSE);
            return response.data;
        }
        catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

export const addCourse = createAsyncThunk(
    "course/addcourse",
    async (data: addCourseData, { rejectWithValue }) => {
        try {
            const response = await api.post(PrivateEndPoints.ADD_COURSE, data);
            return response.data;
        }
        catch (error: any) {
            const errorResponse = apiErrorHandlers(error);
            return rejectWithValue(errorResponse);
        }
    }
)

export const deleteCourse = createAsyncThunk(
    "course/deleteCourse",
    async (id: number, { rejectWithValue }) => {
        try {
            await api.delete(PrivateEndPoints.DELETE_COURSE(id));
            return id;
        }
        catch (err: any) {
            const responseError = apiErrorHandlers(err);
            return rejectWithValue(responseError);
        }
    }
)

export const updateCourse = createAsyncThunk(
    "course/editCorse", async (data:
        {
            id: number,
            name: string,
            durationInMonths: number,
            startDate: string,
            minimumRequiredAge: number
        }, { rejectWithValue }) => {
    try {
        await api.put(PrivateEndPoints.EDIT_COURSE, data);
        return data;
    }
    catch (err: any) {
        const responseError = apiErrorHandlers(err);
        return rejectWithValue(responseError);
    }
}
)

interface CourseResponse {
    message: string,
    course: {
        id: number,
        name: string,
        durationInMonths: number,
        startDate: string,
        minimumRequiredAge: number,
        createdOn: string,
    }
}

interface CourseState {
    items: courseListType[],
    loading: boolean,
    error: string | null,
    editItem: courseListType | null
}

const initialState: CourseState = {
    items: [],
    loading: false,
    error: null,
    editItem: null
}

const CourseSlice = createSlice({
    name: "course",
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
        editCourse: (state, action: PayloadAction<courseListType | null>) => {
            state.editItem = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchAllCourse.pending, (state) => {
                state.error = null;
                state.loading = true;
            })
            .addCase(fetchAllCourse.fulfilled, (state, action: PayloadAction<courseListType[]>) => {
                state.loading = false;
                state.items = action.payload;
            })
            .addCase(fetchAllCourse.rejected, (state, action: PayloadAction<any>) => {
                state.loading = false;
                state.error = action.payload;
            });

        builder
            .addCase(addCourse.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addCourse.fulfilled, (state, action: PayloadAction<CourseResponse>) => {
                const newitem: courseListType = {
                    id: action.payload.course.id,
                    name: action.payload.course.name,
                    durationInMonths: action.payload.course.durationInMonths,
                    startDate: action.payload.course.startDate,
                    minimumRequiredAge: action.payload.course.minimumRequiredAge,
                    createdOn: action.payload.course.createdOn,
                    enrolledUsersCount: 0,
                    isEnrolled: false
                };

                state.items.push(newitem);
            })
            .addCase(addCourse.rejected, (state, action: PayloadAction<any>) => {
                state.loading = false;
                state.error = action.payload;
            });

        builder
            .addCase(deleteCourse.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteCourse.fulfilled, (state, action: PayloadAction<number>) => {
                state.items = state.items.filter(s => s.id !== action.payload);
            })
            .addCase(deleteCourse.rejected, (state, action: PayloadAction<any>) => {
                state.loading = false;
                state.error = action.payload;
            });

        builder
            .addCase(updateCourse.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateCourse.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.items.findIndex(s => s.id === action.payload.id);
                if (index !== -1) {
                    state.items[index] = {
                        ...state.items[index],
                        ...action.payload
                    };
                }
            })
            .addCase(updateCourse.rejected, (state, action: PayloadAction<any>) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
});

export default CourseSlice.reducer;
export const { clearError, editCourse } = CourseSlice.actions;