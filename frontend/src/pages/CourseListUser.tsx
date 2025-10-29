import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispathStore, RootStateStore } from "../store/store";
import { Alert, Spinner } from "react-bootstrap";
import { fetchAllCourse } from "../features/courseSlice";
import CourseListCard from "../common/componets/CourseListCard";
import { ToastContainer } from "react-toastify";
import { api } from "../api/api"
import { PrivateEndPoints } from "../api/endPoints";


export interface IEnrollredCourses {
    enrollmentId: number,
    courseId: number,
    courseName: string,
    enrolledOn: string,
}

const CouseListUser: React.FC = () => {

    const { items, loading, error } = useSelector((State: RootStateStore) => State.CouseStore);
    const dispatch = useDispatch<AppDispathStore>();
    const [enrolledCourses, setEnrolledCourses] = useState<IEnrollredCourses[] | null>(null);

    useEffect(() => {
        if (items.length === 0) {
            dispatch(fetchAllCourse());
        }
    }, [dispatch, items.length]);

    useEffect(() => {
        const fetchEnrollment = async () => {
            const response = await api.get(PrivateEndPoints.GetEnrollment);
            console.log(response.data);
            setEnrolledCourses(response.data);
        }

        if (enrolledCourses == null) {
            fetchEnrollment();
        }
    }, [setEnrolledCourses, enrolledCourses]);

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
                    items.map((course) => <CourseListCard key={course.id} course={course} enrollments={enrolledCourses} />)
                ) : (
                    <p className="text-center text-muted mt-4">No courses available</p>
                )}
            </div>
            <ToastContainer position="top-right" autoClose={1000} />
        </div>
    );
};

export default React.memo(CouseListUser);