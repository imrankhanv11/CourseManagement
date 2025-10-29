import React from "react";
import { Route, Routes } from "react-router-dom";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Profile from "../pages/Profile";
import ProtectedRoutes from "./ProtectedRoutes";
import UserAddForm from "../pages/UserAddForm";
import UsersList from "../pages/UsersList";
import CourseAddForm from "../pages/CourseAddForm";
import CourseList from "../pages/CourseList";
import CourseListUser from "../pages/CourseListUser";
import NotFoundPage from "../pages/NotFoundPage";
import Home from "../pages/Home";

const Routers: React.FC = () => {
    return (
        <Routes>
            {/* public Routes */}
            <Route path='/home' element={<Home />} />
            <Route path="/" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/profile" element={<Profile />} />

            {/* private Routes  */}
            <Route element={<ProtectedRoutes allowedRole={true} />} >
                <Route path="/adduser" element={<UserAddForm />} />
                <Route path="/userlist" element={<UsersList />} />
                <Route path='/addcourse' element={<CourseAddForm />} />
                <Route path='/couselist' element={<CourseList />} />
            </Route>

            {/* Private Routes User  */}
            <Route element={<ProtectedRoutes allowedRole={false} />} >
                <Route path="/userCourse" element={<CourseListUser />} />
            </Route>

            {/* Not Found  */}
            <Route path="*" element={<NotFoundPage />} />
        </Routes>
    );
};

export default React.memo(Routers);