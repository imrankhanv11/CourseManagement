import React from "react";
import { Container, Col, Row } from "react-bootstrap";
import { FaBook } from "react-icons/fa";

const FooterFixed: React.FC = () => {
    return (
        <footer className="footer mt-auto bg-dark text-light py-4">
            <Container>
                <Row className=" gy-3 text-center">
                    <Col md={4} className="mt-2">
                        <h5 className="fw-bolder mb-3 text-white"><FaBook /> Course Management</h5>
                        <p className="small">
                            Enroll Learn & Fly
                        </p>
                    </Col>

                    <Col md={4}>
                        <h6 className="fw-bolder mb-3 text-info">Description</h6>
                        <ul className="list-unstyled small">
                            <li>Discounts for new Users</li>
                            <li>Good Teachers</li>
                        </ul>
                    </Col>

                    <Col md={4}>
                        <h6 className="fw-bolder mb-3 text-info">Contact Us</h6>
                        <p className="small mb-1">courseMangement@CM.com</p>
                        <p className="small mb-1">mobile: +91 987463210</p>
                    </Col>
                </Row>

                <hr className=" border-info my-3" />

                <Row>
                    <Col className="text-center small">
                        @2025 CourseManagement
                    </Col>
                </Row>
            </Container>
        </footer>
    )
}

export default React.memo(FooterFixed);