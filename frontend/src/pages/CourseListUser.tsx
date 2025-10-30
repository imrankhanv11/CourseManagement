import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispathStore, RootStateStore } from "../store/store";
import { Alert, Spinner } from "react-bootstrap";
import { fetchAllCourse } from "../features/courseSlice";
import CourseListCard from "../common/componets/CourseListCard";
import { ToastContainer } from "react-toastify";
import { enrollmentsOfUser } from "../features/courseSlice";

const CouseListUser: React.FC = () => {

    const { items, loading, error } = useSelector((State: RootStateStore) => State.CouseStore);
    const dispatch = useDispatch<AppDispathStore>();

    const enrollments = useSelector((state: RootStateStore) => state.Enrolltore.enrolledCourses);

    useEffect(() => {
        if (items.length === 0) {
            dispatch(fetchAllCourse());
        }
    }, [dispatch, items.length]);


    useEffect(() => {
        if (enrollments.length === 0) {
            dispatch(enrollmentsOfUser());
        }
    }, [enrollments.length, dispatch]);

    if (loading) {
        <div className=" d-flex justify-content-center" style={{ height: "60px" }}>
            <Spinner variant="success" />
        </div>
    }

    if (error) {
        <div>
            <Alert variant="warning">{error}</Alert>
        </div>
    }

    return (
        <div className="container mt-4">
            <div className="row">
                {items.length > 0 ? (
                    items.map((course) => <CourseListCard key={course.id} course={course} enrollments={enrollments}/>)
                ) : (
                    <p className="text-center text-muted mt-4">No courses available</p>
                )}
            </div>
            <ToastContainer position="top-right" autoClose={1000} />
        </div>
    );
};

export default React.memo(CouseListUser);