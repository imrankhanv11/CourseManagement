import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, Button, Form, Spinner } from "react-bootstrap";
import { registerFormSchema, type RegisterFormData } from "../common/schema/registerFormSchema";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import type { AppDispathStore } from "../store/store";
import { registerUser } from "../features/authSlice";

const Register: React.FC = () => {

    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispathStore>();

    const defaultFormValues = {
        name: "",
        email: "",
        password: ""
    }

    const {
        handleSubmit,
        register,
        formState: { errors, isSubmitting },
        reset,
    } = useForm<RegisterFormData>({
        resolver: zodResolver(registerFormSchema),
        mode: "onBlur",
        reValidateMode: "onChange",
        defaultValues: defaultFormValues
    });

    const onSubmit = async (data: RegisterFormData) => {
        try {
            await dispatch(registerUser(data));
            reset(defaultFormValues);
            navigate('/');
        }
        catch (err: any) {
            console.error(err);
        }
    };

    return (
        <div>
            <Card className="mx-auto mt-3 rounded-3 shadow mb-2" style={{ maxWidth: "380px" }}>
                <Card.Body>
                    <h2 className="text-center mb-4 text-success">Register</h2>

                    <Form noValidate onSubmit={handleSubmit(onSubmit)}>
                        <Form.Group className="mb-3">
                            <Form.Label>Name
                                <small className=" text-danger">*</small>
                            </Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter your Name"
                                {...register("name")}
                                isInvalid={!!errors.name}
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors.name?.message}
                            </Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Email<small className=" text-danger">*</small></Form.Label>
                            <Form.Control
                                type="email"
                                placeholder="Enter your Email"
                                {...register("email")}
                                isInvalid={!!errors.email}
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors.email?.message}
                            </Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Password<small className=" text-danger">*</small></Form.Label>
                            <Form.Control
                                type="password"
                                placeholder="Enter your Password"
                                {...register("password")}
                                isInvalid={!!errors.password}
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors.password?.message}
                            </Form.Control.Feedback>
                        </Form.Group>

                        <Button
                            variant="success"
                            type="submit"
                            disabled={isSubmitting}
                            className="w-100 bg-teal-600 border-1"
                        >
                            {isSubmitting ? (
                                <>
                                    <Spinner animation="border" size="sm" className="me-2" />
                                    Registering...
                                </>
                            ) : (
                                "Register"
                            )}
                        </Button>
                    </Form>

                    <p className="text-center mt-3 text-muted"> If already have an account please?{" "}
                        <Button
                            variant="link"
                            className="p-0 text-decoration-none text-teal-600 fw-semibold"
                            onClick={() => navigate("/")}
                        >Login here</Button>
                    </p>
                </Card.Body>
            </Card>
        </div>
    );
};

export default React.memo(Register);