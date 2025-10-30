import React from "react";
import { FaTrash, FaEdit } from "react-icons/fa"
import { useDispatch } from "react-redux";
import { type AppDispathStore } from "../../store/store";
import { useNavigate } from "react-router-dom";
import type { UserListType } from "../type/userListType";
import { deleteUser, ediUser } from "../../features/userSlice";
import Swal from "sweetalert2";

interface UserListRowProbs {
    user: UserListType
}

const UserListRow: React.FC<UserListRowProbs> = ({ user }) => {

    const dispatch = useDispatch<AppDispathStore>();
    const navigate = useNavigate();

    const deleteUserMethod = async (id: string) => {
        Swal.fire({
            title: "Are you sure?",
            text: "Do you want to Delete this User?",
            icon: "question",
            showCancelButton: true,
            confirmButtonText: "Yes, Delete",
            cancelButtonText: "No, Cancel",
            confirmButtonColor: "#198754",
            cancelButtonColor: "#dc3545",
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await dispatch(deleteUser(id)).unwrap;
                    Swal.fire("Deleted!", "You have successfully Deleted.", "success");
                } catch (error: any) {
                    Swal.fire(error, "error");
                }
            } else {
                Swal.fire("Cancelled", "You didn’t Delete the User.", "info");
            }
        })
    }

    const editUserMethod = (data: UserListType) => {
        dispatch(ediUser(data));
        navigate("/adduser");
    }

    return (
        <tr>
            <td>{user.name}</td>
            <td>{user.email}</td>
            <td>{new Date(user.dateOfBirth).toDateString()}</td>
            <td>{user.isActive ? "Actice" : "In Active"}</td>
            <td>{user.phoneNumber}</td>
            <td>{user.isAdmin ? "Admin" : "User"}</td>
            <td>
                <div className=" d-flex justify-content-around">
                    <FaTrash color="red" onClick={() => deleteUserMethod(user.id)} style={{ cursor: "pointer" }} />
                    <FaEdit color="blue" onClick={() => editUserMethod(user)} style={{ cursor: "pointer" }} />
                </div>
            </td>
        </tr>
    )
}

export default React.memo(UserListRow);