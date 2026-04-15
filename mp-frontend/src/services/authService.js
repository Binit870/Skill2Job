import API from "../utils/api";

export const forgotPassword = (email) => {

    return API.post("/api/auth/forgot-password", {
        email
    });

};

export const resetPassword = (token, password) => {

    return API.post(`/api/auth/reset-password/${token}`, {
        password
    });
   
};