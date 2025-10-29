import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "react-bootstrap";

const Hero: React.FC = () => {
    
    const navigate = useNavigate();

    return (
        <div
            style={{
                background: "linear-gradient(to right, #000000ff, #203a43, #1b9bd2ff)",
                color: "white",
                textAlign: "center",
                padding: "80px 20px",
            }}
            className=" border-bottom"
        >
            <h1 className="fw-bold mb-3">Welcome to Our Onlice Course System</h1>
            <p className="lead">
                We Provide Good Course with lots of discounts and also we provide some free Courses
            </p>
            <Button
                variant="light"
                className="mt-3 px-4 py-2 fw-semibold"
                onClick={() => navigate("/login")}
            >
                Login now
            </Button>
        </div>
    )
}

export default Hero;