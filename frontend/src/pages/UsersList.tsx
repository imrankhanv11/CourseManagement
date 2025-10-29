import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispathStore, RootStateStore } from "../store/store";
import { Alert, Spinner, Container, Table } from "react-bootstrap";
import { ToastContainer } from "react-toastify";
import UserListRow from "../common/componets/UserListRow";
import { fetchAllUsers } from "../features/userSlice";

const UserList: React.FC = () => {

    const { items, loading, error } = useSelector((State: RootStateStore) => State.UserStore);
    const dispatch = useDispatch<AppDispathStore>();

    useEffect(() => {
        if (items.length === 0) {
            dispatch(fetchAllUsers());
        }
    }, [dispatch, items.length]);

    if (loading) {
        <div className=" d-flex justify-content-center" style={{ height: "60px" }}>
            <Spinner variant="success" />
        </div>
    }

    if (error) {
        <div>
            <Alert variant="warning">{error}</Alert>
        </div>
    }

    return (
        <Container className="my-4">
            <h3 className="text-center fw-bold mb-4">Our Users</h3>
            <Table className="table table-bordered table-striped table-hover align-middle text-center shadow-sm rounded p-1">
                <thead className="table-dark">
                    <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>DOB</th>
                        <th>Active</th>
                        <th>PhoneNumber</th>
                        <th>Role</th>
                        <th>Action</th>
                    </tr>
                </thead>

                <tbody>
                    {items.map((item) =>
                        <UserListRow key={item.id} user={item} />
                    )}
                </tbody>
            </Table>
            <div>
                <ToastContainer position="top-right" autoClose={1000} />
            </div>
        </Container>
    );
};

export default React.memo(UserList);