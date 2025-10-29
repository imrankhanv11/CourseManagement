import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispathStore, RootStateStore } from "../store/store";
import { Alert, Spinner, Container, Table } from "react-bootstrap";
import { fetchAllCourse } from "../features/courseSlice";
import CourseListRow from "../common/componets/CourseListRow";
import { ToastContainer } from "react-toastify";

const CourseList: React.FC = () => {

    const { items, loading, error } = useSelector((State: RootStateStore) => State.CouseStore);
    const dispatch = useDispatch<AppDispathStore>();

    useEffect(() => {
        if (items.length === 0) {
            dispatch(fetchAllCourse());
        }
    }, [dispatch, items.length]);

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
        <Container className="my-4">
            <h3 className="text-center fw-bold mb-4">Courses</h3>
            <Table className="table table-bordered table-striped table-hover align-middle text-center shadow-sm rounded p-1">
                <thead className="table-dark">
                    <tr>
                        <th>Course</th>
                        <th>Duration</th>
                        <th>Created</th>
                        <th>Age Required</th>
                        <th>Stated</th>
                        <th>Enrollment Count</th>
                        <th>Actions</th>
                    </tr>
                </thead>

                <tbody>
                    {items.map((item) =>
                        <CourseListRow key={item.id} course={item} />
                    )}
                </tbody>
            </Table>
            <div>
                <ToastContainer position="top-right" autoClose={1000} />
            </div>
        </Container>
    );
};

export default React.memo(CourseList);