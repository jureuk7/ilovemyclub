import {authClient} from "@/lib/api/client";

export const getSignal = async () => {
    const {data} = await authClient().get("/webhook/get/signal");
    return data;
}
