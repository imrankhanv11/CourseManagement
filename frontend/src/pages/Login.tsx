import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Form, Card, Spinner } from "react-bootstrap";
import { ToastContainer, toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import type { AppDispathStore } from "../store/store";
import { loginFormSchema, type LognFormData } from "../common/schema/loginFromSchema";
import { loginUser } from "../features/authSlice";

const Login: React.FC = () => {

    const disPatch = useDispatch<AppDispathStore>();
    const navigate = useNavigate();

    const defaultFormValues = {
        email: "", password: ""
    }

    const {
        handleSubmit,
        register, reset, formState: { errors, isSubmitting }
    } = useForm<LognFormData>({
        resolver: zodResolver(loginFormSchema),
        mode: "onBlur",
        reValidateMode: "onChange",
        defaultValues: defaultFormValues
    });

    const onSubmit = async (data: LognFormData) => {
        try {
            await disPatch(loginUser(data)).unwrap();

            reset(defaultFormValues);
            navigate("/profile");
        }
        catch (error: any) {
            toast.error(error || "Invalid username or password");
        }
    }

    return (
        <div>
            <Card className="mx-auto mt-3 rounded-3 shadow mb-2" style={{ maxWidth: "380px" }}>
                <Card.Body>
                    <h2 className="text-center mb-4 text-success">Login</h2>

                    <Form noValidate onSubmit={handleSubmit(onSubmit)}>
                        <Form.Group className=" mb-4">
                            <Form.Label>
                                email<small className=" text-danger">*</small>
                            </Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter the Mail id"
                                {...register("email")}
                                isInvalid={!!errors.email}
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors.email?.message}
                            </Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group className=" mb-4">
                            <Form.Label>
                                Password<small className=" text-danger">*</small>
                            </Form.Label>
                            <Form.Control
                                type="password"
                                placeholder="Enter the Password"
                                {...register("password")}
                                isInvalid={!!errors.password}
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors.password?.message}
                            </Form.Control.Feedback>
                        </Form.Group>

                        <Button type="submit"
                            disabled={isSubmitting} className="w-100 mb-2" variant="info">
                            {isSubmitting ? (
                                <>
                                    <Spinner animation="border" size="sm" className="me-2" />
                                    Processing...
                                </>
                            ) : (
                                "Login"
                            )}
                        </Button>
                    </Form>

                    <p className="text-center mt-3 text-muted"> If you not have accont please register here?{" "}
                        <Button
                            variant="link"
                            className="p-0 text-decoration-none text-teal-600 fw-semibold"
                            onClick={() => navigate("/register")}
                        >
                            Register
                        </Button>
                    </p>
                </Card.Body>
            </Card>
            <ToastContainer position="top-right" autoClose={2000} />
        </div>
    );
};

export default React.memo(Login);