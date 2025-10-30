import React from "react";
import type { courseListType } from "../type/courseListType";
import { FaTrash, FaEdit } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { type AppDispathStore } from "../../store/store";
import { deleteCourse, editCourse } from "../../features/courseSlice";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2"

export interface CourseListProps {
    course: courseListType;
}

const CourseListRow: React.FC<CourseListProps> = ({ course }) => {

    const dispatch = useDispatch<AppDispathStore>();
    const navigate = useNavigate();

    const deleteCourseMethod = async (id: number) => {
        Swal.fire({
            title: "Are you sure?",
            text: "Do you want to Delete in this course?",
            icon: "question",
            showCancelButton: true,
            confirmButtonText: "Yes, Delete",
            cancelButtonText: "No, Cancel",
            confirmButtonColor: "#198754",
            cancelButtonColor: "#dc3545",
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await dispatch(deleteCourse(id)).unwrap();
                    Swal.fire("Deleted!", "You have successfully deleted.", "success");
                } catch (error: any) {
                    Swal.fire(error, "error");
                }
            } else {
                Swal.fire("Cancelled", "You didn’t delete the course.", "info");
            }
        })
    };

    const editCourseMethod = (data: courseListType) => {
        dispatch(editCourse(data));
        navigate("/addcourse");
    };

    return (
        <tr>
            <td>{course.name}</td>
            <td>{course.durationInMonths}</td>
            <td>{new Date(course.createdOn).toDateString()}</td>
            <td>{course.minimumRequiredAge}</td>
            <td>{course.startDate}</td>
            <td>{course.enrolledUsersCount}</td>
            <td>
                <div className="d-flex justify-content-around">
                    <FaTrash
                        color="red"
                        onClick={() => deleteCourseMethod(course.id)}
                        style={{ cursor: "pointer" }}
                    />
                    <FaEdit
                        color="blue"
                        onClick={() => editCourseMethod(course)}
                        style={{ cursor: "pointer" }}
                    />
                </div>
            </td>
        </tr>
    );
};

export default React.memo(CourseListRow);