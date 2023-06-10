import {authClient} from "@/lib/api/client";

export const getSignal = async () => {
    const {data} = await authClient().get("/webhook/get/signal");
    return data;
}

export const getBottomSignal = async () => {
    const {data} = await authClient().get("/get/buttom-signal");
    return data;
}
