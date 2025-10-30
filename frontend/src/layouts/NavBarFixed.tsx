import React from "react";
import { Navbar, Container, Nav } from "react-bootstrap";
import { Link } from "react-router-dom";
import { FaBook } from "react-icons/fa"
import { useSelector } from "react-redux";
import type { RootStateStore } from "../store/store";
import useDecodeToken from "../hooks/useDecodeToken";

const NavBarFixed: React.FC = () => {

    const isActive = (path: string) => location.pathname === path;
    const isAuthenticated = useSelector((state: RootStateStore) => state.AuthStore.isAuthenticated);
    const role = useDecodeToken();

    const userLink = (
        <>
            <Nav.Link
                as={Link}
                to="/home"
                className={`mx-2 ${isActive("/home") ? "text-warning fw-semibold" : "text-white"}`}
            >
                Home
            </Nav.Link>

            <Nav.Link
                as={Link}
                to="/userCourse"
                className={`mx-2 ${isActive("/userCourse") ? "text-warning fw-semibold" : "text-white"}`}
            >
                Courses
            </Nav.Link>

            <Nav.Link
                as={Link}
                to="/profile"
                className={`mx-2 ${isActive("/profile") ? "text-warning fw-semibold" : "text-white"}`}
            >
                Profile
            </Nav.Link>
        </>
    );

    const adminLink = (
        <>
            <Nav.Link
                as={Link}
                to="/home"
                className={`mx-2 ${isActive("/home") ? "text-warning fw-semibold" : "text-white"}`}
            >
                Home
            </Nav.Link>

            <Nav.Link
                as={Link}
                to="/userlist"
                className={`mx-2 ${isActive("/userlist") ? "text-warning fw-semibold" : "text-white"}`}
            >
                UserList
            </Nav.Link>

            <Nav.Link
                as={Link}
                to="/adduser"
                className={`mx-2 ${isActive("/adduser") ? "text-warning fw-semibold" : "text-white"}`}
            >
                Add Users
            </Nav.Link>

            <Nav.Link
                as={Link}
                to="/couselist"
                className={`mx-2 ${isActive("/couselist") ? "text-warning fw-semibold" : "text-white"}`}
            >
                Course
            </Nav.Link>

            <Nav.Link
                as={Link}
                to="/addcourse"
                className={`mx-2 ${isActive("/addcourse") ? "text-warning fw-semibold" : "text-white"}`}
            >
                Add Course
            </Nav.Link>

            <Nav.Link
                as={Link}
                to="/profile"
                className={`mx-2 ${isActive("/profile") ? "text-warning fw-semibold" : "text-white"}`}
            >
                Profile
            </Nav.Link>
        </>
    );

    const unAuthorizedUserLink = (
        <>
            <Nav.Link
                as={Link}
                to="/home"
                className={`mx-2 ${isActive("/home") ? "text-warning fw-semibold" : "text-white"}`}
            >
                Home
            </Nav.Link>

            <Nav.Link
                as={Link}
                to="/"
                className={`mx-2 ${isActive("/") ? "text-warning fw-semibold" : "text-white"}`}
            >
                Login
            </Nav.Link>

            <Nav.Link
                as={Link}
                to="/register"
                className={`mx-2 ${isActive("/register") ? "text-warning fw-semibold" : "text-white"}`}
            >
                Register
            </Nav.Link>
        </>
    );

    return (
        <Navbar
            expand="lg"
            fixed="top"
            className="shadow-sm"
            style={{
                background: "linear-gradient(90deg, #16325cff, #6610f2)",
            }}
        >
            <Container>
                <Navbar.Brand
                    as={Link}
                    to="/"
                    className="fw-bold text-white"
                >
                    <FaBook /> Course Management
                </Navbar.Brand>

                <Navbar.Toggle aria-controls="Navbar-setUP" className="bg-light" />

                <Navbar.Collapse id="Navbar-setUP">
                    <Nav className="ms-auto align-items-center">
                        {!isAuthenticated ? unAuthorizedUserLink : role === "True" ? adminLink : userLink}
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};

export default React.memo(NavBarFixed);
