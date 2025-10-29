import React from "react";
import { Button, Container } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const NotFoundPage: React.FC = () => {
    const navigater = useNavigate();

    return (
        <Container className="d-flex flex-column align-items-center justify-content-center text-center" style={{ height: "calc(100vh - 75px)" }}>
            <h1 className="display-1 text-warning"> 404</h1>
            <h2 className="mb-3">Out of Service</h2>
            <p className="mb-5 text-danger">
                This is Out of Service
            </p>
            <Button variant="dark" onClick={() => navigater("/")}>
                Login
            </Button>
        </Container>
    );
};

export default NotFoundPage;