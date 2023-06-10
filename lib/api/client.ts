import axios from "axios";
import {logout} from "@/lib/api/auth";
// import { logout } from "./auth";

export const authClient = () => {
    let r = axios.create({
        baseURL: process.env.NEXT_PUBLIC_API_URL,
        headers: {
            "Authorization": `Bearer ${localStorage.getItem("token")}`,
        }
    });
    r.interceptors.response.use(
        (r) => r,
        (e) => {
            if (e.response?.status === 401) {
                logout();
            }
            return Promise.reject(e);
        }
    );
    return r;
};

export const client = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
});

