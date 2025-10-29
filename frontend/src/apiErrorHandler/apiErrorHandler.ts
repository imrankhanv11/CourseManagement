export const apiErrorHandlers = (error: any) => {

    if (!error.response) {
        return { message: "Network error" };
    }

    const { status, data } = error.response;
    
    switch (status) {

        case 400:
            return { message: data?.message || "Bad request" };

        case 403:
            return { message: "Sorry You not have permission." };

        case 401:
            return { message: "Unauthorized. Please Try to login again." };

        case 404:
            return { message: data?.message || "Data not found" };

        case 500:
            return { message: "Server Down. Please Try again later." };

        default:
            return { message: data?.message || "Something Wrong" };
    }
};