import {authClient} from "@/lib/api/client";

export const getNotice = async () => {
    const {data} = await authClient().get("/get/notice");
    return data;
}

export const sendNotice = async (title,content) => {
    await authClient().post("/post/notice", {
        "noticeTitle": title,
        "noticeContent": content
    })
}
