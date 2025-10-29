export const PublicEndPoint = {
    REGISTER : `/Account/Register`,
    LOGIN : `/Account/Login`
}

export const PrivateEndPoints = {
    // Course
    ADD_COURSE : `/Course/Add`,
    GET_COURSE : `/Course/GetCourses`,
    DELETE_COURSE: (id: number) => `/Course/Delete/${id}`,
    EDIT_COURSE: `/Course/Edit`,

    // User
    ADD_User : `/User/Create`,
    GET_User : `/User/GetUsers`,
    DELETE_USER : (id: string) => `/User/Delete/${id}`,
    EDIT_USER : `/User/Edit`,

    // Enroll
    enrollment : `/Enrollment/Enroll`,
    GetEnrollment : `/Enrollment/MyEnrollments`
}