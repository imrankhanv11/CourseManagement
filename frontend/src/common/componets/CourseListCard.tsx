import React from "react";
import type { courseListType } from "../type/courseListType";
import { FaPlus } from "react-icons/fa";
import { toast } from "react-toastify";
import { apiErrorHandlers } from "../../apiErrorHandler/apiErrorHandler";
import useDecodeToken from "../../hooks/useDecodeToken";
import { api } from "../../api/api";
import { PrivateEndPoints } from "../../api/endPoints";
import { type IEnrollredCourses } from "../../pages/CourseListUser"

interface CourseListProps {
    course: courseListType;
    enrollments: IEnrollredCourses[] | null
}

const CourseListCard: React.FC<CourseListProps> = ({ course, enrollments }) => {

    const role = useDecodeToken();

    const enrollUser = async (id: number) => {
        try {
            
            if (!enrollments) {
                toast.error("Enrollment data not loaded. Please try again.");
                return;
            }

            if (enrollments.length >= 3) {
                toast.error("You are already enrolled in 3 courses. Please complete one before enrolling again.");
                return;
            }

            const courseStart = new Date(course.startDate);
            const courseEnd = new Date(courseStart);
            courseEnd.setMonth(courseEnd.getMonth() + course.durationInMonths);

            const overlappingCourses = enrollments.filter((c) => {
                const cStart = new Date(c.enrolledOn);
                const cEnd = new Date(cStart);
                cEnd.setMonth(cEnd.getMonth() + course.durationInMonths);

                return courseStart <= cEnd && courseEnd >= cStart;
            });

            if (overlappingCourses.length >= 3) {
                toast.error("You cannot enroll in more than 3 overlapping courses.");
                return;
            }

            await api.post(PrivateEndPoints.enrollment, { CourseId: id });
            toast.success("Enrolled Successfully");

        } catch (err: any) {
            const response = apiErrorHandlers(err);
            toast.error(response.message);
            console.error(response.message);
        }
    };

    return (
        <div className="col-md-4 mb-4">
            <div className="card shadow-sm border-0 h-100">
                <div className="card-body d-flex flex-column justify-content-between">
                    <div>
                        <h5 className="card-title text-primary">{course.name}</h5>
                        <p className="card-text mb-1">
                            <strong>Duration:</strong> {course.durationInMonths} months
                        </p>
                        <p className="card-text mb-1">
                            <strong>Start Date:</strong> {new Date(course.startDate).toDateString()}
                        </p>
                        <p className="card-text mb-1">
                            <strong>Min Age:</strong> {course.minimumRequiredAge}
                        </p>
                        <p className="card-text mb-1">
                            <strong>Enrolled:</strong> {course.enrolledUsersCount}
                        </p>
                        <p className="card-text">
                            <small className="text-muted">
                                Created On: {new Date(course.createdOn).toDateString()}
                            </small>
                        </p>
                    </div>

                    {role !== "True" && (
                        <button
                            className="btn btn-success mt-3 d-flex align-items-center justify-content-center gap-2"
                            onClick={() => enrollUser(course.id)}
                        >
                            <FaPlus /> Enroll Now
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default React.memo(CourseListCard);
