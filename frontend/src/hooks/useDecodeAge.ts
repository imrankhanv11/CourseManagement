import { jwtDecode } from "jwt-decode";
import { useSelector } from "react-redux";
import type { RootStateStore } from "../store/store";

interface IJwtDecode {
    nameid: string,
    isAdmin: string,
    age: string;
}

const useDecodeAge = () => {

    const accesToken = useSelector((state: RootStateStore) => state.AuthStore.LoginDetails?.accessToken);

    if (!accesToken) {
        return null;
    }

    try {
        const decode = jwtDecode<IJwtDecode>(accesToken);
        const age: number = Number(decode.age);
        return age;
    }
    catch {
        return null;
    }
}

export default useDecodeAge;