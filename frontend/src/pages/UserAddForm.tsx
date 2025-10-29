import React, { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, Button, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispathStore, RootStateStore } from "../store/store";
import { addUserShema, type addUserData } from "../common/schema/addUserSchema";
import { addUser, ediUser, updateUser } from "../features/userSlice";
import { toast, ToastContainer } from "react-toastify";
import type { UserDto } from "../common/type/userDto";

const UserAddForm: React.FC = () => {

    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispathStore>();
    const editItem = useSelector((state: RootStateStore) => state.UserStore.editItem);

    const defaultFormValues = {
        name: "",
        email: "",
        dateOfBirth: "",
        phoneNumber: "",
        password: "",
        isActive: true,
        isAdmin: "",
    }

    const {
        handleSubmit,
        register,
        setValue,
        control,
        formState: { errors, isSubmitting },
        reset,
    } = useForm<addUserData>({
        resolver: zodResolver(addUserShema),
        mode: "onBlur",
        reValidateMode: "onChange",
        defaultValues: defaultFormValues
    });

    useEffect(() => {
        if (editItem) {
            setValue("name", editItem.name);
            setValue("email", editItem.email);
            setValue("dateOfBirth", editItem.dateOfBirth);
            setValue("phoneNumber", editItem.phoneNumber);
            setValue("isAdmin", editItem.isAdmin ? "Admin" : "User");
            setValue("isAdmin", "User");
        }
    }, [editItem, setValue]);

    const onSubmit = async (data: addUserData) => {
        try {
            if (!editItem) {
                await dispatch(addUser(data)).unwrap();
            }
            else {
                const item: UserDto = {
                    id: editItem.id.toString(),
                    name: data.name,
                    email: data.email,
                    dateOfBirth: data.dateOfBirth,
                    phoneNumber: data.phoneNumber,
                    password: data.password,
                    isActive: data.isActive,
                    isAdmin: data.isAdmin === "Admin" ? true : false
                }
                await dispatch(updateUser(item)).unwrap();
                dispatch(ediUser(null));
            }
            reset(defaultFormValues);
            navigate("/userlist");
        }
        catch (err: any) {
            toast.error(err);
        }
    };

    return (
        <div>
            <Card className="mx-auto mt-3 rounded-3 shadow mb-2" style={{ maxWidth: "380px" }}>
                <Card.Body>
                    <h2 className="text-center mb-4 text-success">Add User</h2>

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
                                placeholder="Enter your Durations in months"
                                {...register("email")}
                                isInvalid={!!errors.email}
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors.email?.message}
                            </Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>DOB<small className=" text-danger">*</small></Form.Label>
                            <Form.Control
                                type="date"
                                placeholder="Enter your Password"
                                {...register("dateOfBirth")}
                                isInvalid={!!errors.dateOfBirth}
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors.dateOfBirth?.message}
                            </Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>phoneNumber<small className=" text-danger">*</small></Form.Label>
                            <Form.Control
                                type="tel"
                                placeholder="Enter your Minimum Add Limit"
                                {...register("phoneNumber")}
                                isInvalid={!!errors.phoneNumber}
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors.phoneNumber?.message}
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

                        <Form.Group className="mb-4">
                            <Form.Label>Status<small className=" text-danger">*</small></Form.Label>
                            <div>
                                <Controller
                                    name="isActive"
                                    control={control}
                                    render={({ field }) => (
                                        <>
                                            <Form.Check
                                                type="radio"
                                                value="Active"
                                                label="Yes"
                                                inline
                                                checked={field.value === true}
                                                onChange={(e) => field.onChange(e.target.value)}
                                            />
                                        </>
                                    )}
                                />
                            </div>
                            {errors.isActive && (
                                <div className=" text-danger small"> {errors.isActive.message}</div>
                            )}
                        </Form.Group>

                        <Controller
                            name="isAdmin"
                            control={control}
                            render={({ field }) => (
                                <Form.Group className="mb-4">
                                    <Form.Label>Admin<small className=" text-danger">*</small></Form.Label>
                                    <Form.Select {...field} isInvalid={!!errors.isAdmin}>
                                        <option value="">-- Select a Course --</option>
                                        <option value="Admin">Admin</option>
                                        <option value="User">User</option>
                                    </Form.Select>
                                    <Form.Control.Feedback type="invalid">
                                        {errors.isAdmin?.message}
                                    </Form.Control.Feedback>
                                </Form.Group>
                            )}
                        />

                        <Button
                            variant={editItem ? "info" : "success"}
                            type="submit"
                            disabled={isSubmitting}
                            className="w-100 bg-teal-600 border-1"
                        >
                            {editItem ?
                                "Update"
                                :
                                "Add"
                            }
                        </Button>
                    </Form>
                </Card.Body>
            </Card>
            <ToastContainer position="top-right" autoClose={1000} />
        </div>
    );
};

export default React.memo(UserAddForm);