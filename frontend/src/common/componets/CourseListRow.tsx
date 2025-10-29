import React from "react";
import type { courseListType } from "../type/courseListType";
import { FaTrash, FaEdit } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { type AppDispathStore } from "../../store/store";
import { toast } from "react-toastify";
import { deleteCourse, editCourse } from "../../features/courseSlice";
import { useNavigate } from "react-router-dom";

export interface CourseListProps {
    course: courseListType;
}

const CourseListRow: React.FC<CourseListProps> = ({ course }) => {

    const dispatch = useDispatch<AppDispathStore>();
    const navigate = useNavigate();

    const deleteCourseMethod = async (id: number) => {
        try {
            await dispatch(deleteCourse(id)).unwrap();
            toast.success("Deleted Successfully");
        } catch (err: any) {
            toast.error(err || "Failed");
        }
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