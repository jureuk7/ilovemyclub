import { authClient, client } from "./client";

export const login = async (userId: string, password: string) => {
    let a = await client.post(
        "/authenticate",
        {
            username: userId,
            password: password,
        },
        {
            responseType: "json",
        }
    );
    if (a.status != 403) {
        await localStorage.setItem("token", a.data);
        return true;
    } else {
        throw new Error("Login failed");
    }
};

export const logout = async () => {
    localStorage.removeItem("token");
};

export const register = async ({
                                   name,
                                   password,
                                   permission,
                               }: {
    name: string;
    password: string;
    permission?: number;
}) => {
    const res = await authClient().put(`/v1/account/register`, {
        username: name,
        password: password,
        permission: permission || 0,
    });
    return res.status;
};
