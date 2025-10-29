import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, Button, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispathStore, RootStateStore } from "../store/store";
import { type addCourseData, addCourseSchema } from "../common/schema/addCourseSchema";
import { addCourse, editCourse, updateCourse } from "../features/courseSlice";
import { toast } from "react-toastify";

const CourseAddFrom: React.FC = () => {

    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispathStore>();
    const editItem = useSelector((state: RootStateStore) => state.CouseStore.editItem);

    const defaultFormValues = {
        name: "",
        DurationInMonths: 0,
        StartDate: "",
        MinimumRequiredAge: 5
    }

    const {
        handleSubmit,
        register,
        setValue,
        formState: { errors },
        reset,
    } = useForm<addCourseData>({
        resolver: zodResolver(addCourseSchema),
        mode: "onBlur",
        reValidateMode: "onChange",
        defaultValues: defaultFormValues
    });

    useEffect(() => {
        if (editItem) {
            setValue("name", editItem.name);
            setValue("DurationInMonths", editItem.durationInMonths);
            setValue("MinimumRequiredAge", editItem.minimumRequiredAge);
            setValue("StartDate", editItem.startDate);
        }
    }, [editItem, setValue]);

    const onSubmit = async (data: addCourseData) => {
        try {
            if (editItem) {
                const item: {
                    id: number,
                    name: string,
                    durationInMonths: number,
                    startDate: string,
                    minimumRequiredAge: number
                } = {
                    name: data.name,
                    id: editItem.id,
                    durationInMonths: data.DurationInMonths,
                    startDate: data.StartDate,
                    minimumRequiredAge: data.MinimumRequiredAge
                }

                await dispatch(updateCourse(item)).unwrap();

            } else {
                await dispatch(addCourse(data)).unwrap();
            }
            dispatch(editCourse(null));
            reset(defaultFormValues);
            navigate("/couselist");
        }
        catch (err: any) {
            toast.error(err || "Failed try Again");
        }
    };
    return (
        <div>
            <Card className="mx-auto mt-3 rounded-3 shadow mb-2" style={{ maxWidth: "380px" }}>
                <Card.Body>
                    <h2 className="text-center mb-4 text-success">Add Course</h2>

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
                            <Form.Label>Duration of Course<small className=" text-danger">*</small></Form.Label>
                            <Form.Control
                                type="number"
                                placeholder="Enter your Durations in months"
                                {...register("DurationInMonths", { valueAsNumber: true })}
                                isInvalid={!!errors.DurationInMonths}
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors.DurationInMonths?.message}
                            </Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Start Date<small className=" text-danger">*</small></Form.Label>
                            <Form.Control
                                type="date"
                                placeholder="Enter your Password"
                                {...register("StartDate")}
                                isInvalid={!!errors.StartDate}
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors.StartDate?.message}
                            </Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Minimum Age Limit<small className=" text-danger">*</small></Form.Label>
                            <Form.Control
                                type="number"
                                placeholder="Enter your Minimum Add Limit"
                                {...register("MinimumRequiredAge", { valueAsNumber: true })}
                                isInvalid={!!errors.MinimumRequiredAge}
                            />
                            <Form.Control.Feedback type="invalid">
                                {errors.MinimumRequiredAge?.message}
                            </Form.Control.Feedback>
                        </Form.Group>

                        <Button
                            variant={editItem ? "info" : "success"}
                            type="submit"
                            // disabled={isSubmitting}
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
        </div>
    );
};

export default React.memo(CourseAddFrom);