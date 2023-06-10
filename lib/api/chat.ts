import {authClient, client} from "@/lib/api/client";

export const getChat = async () => {
    const {data} = await authClient().get("/get/chat");
    return data;
}
export const sendMessage = async (msg:string) => {
    await authClient().post("/post/chat", {chatContent:msg})
}
