import { jwtDecode } from "jwt-decode";
import { useSelector } from "react-redux";
import type { RootStateStore } from "../store/store";

interface IJwtDecode {
    nameid: string,
    isAdmin: string;
}

const useDecodeToken = () => {

    const accesToken = useSelector((state: RootStateStore) => state.AuthStore.LoginDetails?.accessToken);

    if (!accesToken) {
        return null;
    }

    try {
        const decode = jwtDecode<IJwtDecode>(accesToken);
        return decode.isAdmin;
    }
    catch {
        return null;
    }
}

export default useDecodeToken;