import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit";
import { api } from "../api/api";
import { PrivateEndPoints } from "../api/endPoints";
import { apiErrorHandlers } from "../apiErrorHandler/apiErrorHandler";

export const enrollmentsOfUser = createAsyncThunk(
    "course/enrollment",
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get(PrivateEndPoints.GetEnrollment);
            return response.data;
        }
        catch (err: any) {
            const responseError = apiErrorHandlers(err);
            return rejectWithValue(responseError.message);
        }
    }
)

export const enrollCourse = createAsyncThunk(
    "course/enroll",
    async (id: number, { rejectWithValue }) => {
        try {
            const response = await api.post(PrivateEndPoints.enrollment, { CourseId: id });
            return response.data;
        }
        catch (err: any) {
            const responseError = apiErrorHandlers(err);
            return rejectWithValue(responseError.message);
        }
    }
)

interface IEnrollResponse {
    message: string,
    enrollmentId: number,
    courseId: number,
    enrolledOn: string,
    duration: number,
    startDate: string
}

interface enrollState {
    enrolledCourses: IEnrollredCourses[],
    error: string | null,
}

export interface IEnrollredCourses {
    enrollmentId: number,
    courseId: number,
    courseName: string,
    enrolledOn: string,
    duration: number,
    startDate: string,
}

const initialState: enrollState = {
    enrolledCourses: [],
    error: null,
}

const EnrollSlice = createSlice({
    name: "course",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(enrollmentsOfUser.fulfilled, (state, action: PayloadAction<IEnrollredCourses[]>) => {
                state.enrolledCourses = action.payload;
            });

        builder
            .addCase(enrollCourse.fulfilled, (state, action: PayloadAction<IEnrollResponse>) => {

                const enrollment: IEnrollredCourses = {
                    enrolledOn: action.payload.enrolledOn,
                    enrollmentId: action.payload.enrollmentId,
                    courseId: action.payload.courseId,
                    courseName: action.payload.message,
                    duration: action.payload.duration,
                    startDate : action.payload.startDate
                }

                state.enrolledCourses.push(enrollment);
            })
            .addCase(enrollCourse.rejected, (state, action: PayloadAction<any>) => {
                state.error = action.payload
            })
    }
});

export default EnrollSlice.reducer;