import React from "react";
import { FaTrash, FaEdit } from "react-icons/fa"
import { useDispatch } from "react-redux";
import { type AppDispathStore } from "../../store/store";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import type { UserListType } from "../type/userListType";
import { deleteUser, ediUser } from "../../features/userSlice";

interface UserListRowProbs {
    user: UserListType
}

const UserListRow: React.FC<UserListRowProbs> = ({ user }) => {

    const dispatch = useDispatch<AppDispathStore>();
    const navigate = useNavigate();

    const deleteUserMethod = async (id: string) => {
        try {
            await dispatch(deleteUser(id)).unwrap();

            toast.success("Deleted Succesfully");
        }
        catch (err: any) {
            toast.error(err || "Faild");
        }
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