import React from "react";
import { Button, Card, Container, Col, Row } from "react-bootstrap";
import { useDispatch } from "react-redux";
import type { AppDispathStore } from "../store/store";
import { logout } from "../features/authSlice";
import { useNavigate } from "react-router-dom";
import useDecodeToken from "../hooks/useDecodeToken";

const Profile: React.FC = () => {

    const dispath = useDispatch<AppDispathStore>();
    const navigate = useNavigate();
    const role = useDecodeToken();

    const logoutUser = () => {
        dispath(logout());
        navigate('/');
    }

    return (
        <div>
            <Container className=" my-2">
                <Row className=" justify-content-center">
                    <Col md={6}>
                        <Card>
                            <Card.Header><h2 className=" text-center">Hello! {role === "False" ? "User" : "Admin"}</h2></Card.Header>
                            <Card.Footer className=" d-flex justify-content-center">
                                <Button onClick={() => logoutUser()}>Logout</Button>
                            </Card.Footer>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </div >
    );
};

export default React.memo(Profile);