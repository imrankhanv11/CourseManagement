import React from "react";
import type { courseListType } from "../type/courseListType";
import { FaCalendar, FaList, FaPlus } from "react-icons/fa";
import { toast } from "react-toastify";
import useDecodeToken from "../../hooks/useDecodeToken";
import { Card, Button, Col } from "react-bootstrap";
import { FaPerson, FaTimeline } from "react-icons/fa6";
import { enrollCourse, type IEnrollredCourses } from "../../features/enrollSlice";
import Swal from "sweetalert2";
import { useDispatch } from "react-redux";
import type { AppDispathStore } from "../../store/store";
import useDecodeAge from "../../hooks/useDecodeAge";

interface CourseListProps {
    course: courseListType;
    enrollments: IEnrollredCourses[]
}

const CourseListCard: React.FC<CourseListProps> = ({ course, enrollments }) => {

    const dispatch = useDispatch<AppDispathStore>();
    const role = useDecodeToken();
    const age: number | null = useDecodeAge();

    const enrollUser = async (id: number) => {

        if (!age) {
            return;
        }

        if (course.minimumRequiredAge > age) {
            toast.error("Sorry, You can't enroll this course. Minimum age miss match")
            return;
        }

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
            const cStart = new Date(c.startDate);
            const cEnd = new Date(cStart);
            cEnd.setMonth(cEnd.getMonth() + c.duration);

            return courseStart <= cEnd && courseEnd >= cStart;
        });

        if (overlappingCourses.length >= 3) {
            toast.error("You cannot enroll in more than 3 overlapping courses.");
            return;
        }

        Swal.fire({
            title: "Are you sure?",
            text: "Do you want to enroll in this course?",
            icon: "question",
            showCancelButton: true,
            confirmButtonText: "Yes, enroll",
            cancelButtonText: "No, Cancel",
            confirmButtonColor: "#198754",
            cancelButtonColor: "#dc3545",
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await dispatch(enrollCourse(id)).unwrap();
                    Swal.fire("Enrolled!", "You have successfully enrolled.", "success");
                } catch (error: any) {
                    Swal.fire(error, "error");
                }
            } else {
                Swal.fire("Cancelled", "You didn’t enroll in the course.", "info");
            }
        })

    };

    return (
        <Col md={4} className="mb-4">
            <Card className="shadow-sm border-0 h-100 rounded-4">
                <Card.Body className="d-flex flex-column justify-content-between">
                    <div>
                        <Card.Title className="text-primary fw-bold text-center mb-3">
                            {course.name}
                        </Card.Title>
                        <hr className="  text-info" />
                        <Card.Text as="div" className="text-secondary">
                            <p className="mb-1">
                                <strong><FaTimeline color="blue" /> Duration:</strong> {course.durationInMonths} months
                            </p>
                            <p className="mb-1">
                                <strong><FaCalendar color="blue" /> Start Date:</strong>{" "}
                                {new Date(course.startDate).toDateString()}
                            </p>
                            <p className="mb-1">
                                <strong><FaPerson color="blue" /> Min Age:</strong> {course.minimumRequiredAge}
                            </p>
                            <p className="mb-1">
                                <strong><FaList color="blue" /> Enrolled:</strong> {course.enrolledUsersCount}
                            </p>
                        </Card.Text>

                        <Card.Text className="text-muted text-end small">
                            Created On: {new Date(course.createdOn).toDateString()}
                        </Card.Text>
                    </div>

                    {role !== "True" && (
                        <Button
                            variant="success"
                            className="mt-3 fw-semibold d-flex align-items-center justify-content-center gap-2"
                            onClick={() => enrollUser(course.id)}
                            style={{
                                borderRadius: "12px",
                                boxShadow: "0 4px 10px rgba(0, 128, 0, 0.2)",
                                transition: "all 0.3s ease",
                            }}
                        >
                            <FaPlus /> Enroll Now
                        </Button>
                    )}
                </Card.Body>
            </Card>
        </Col>
    );
};

export default React.memo(CourseListCard);
