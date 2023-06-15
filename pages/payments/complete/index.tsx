import axios from "axios";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import styled from "styled-components"

const Adjust = styled.div`
    width:100%;
    height:100%;
    display: flex;
    justify-content: center;
    align-items: center;
`
const Container = styled.div`
    width:300px;
    height:150px;
    background-color: ${p=>p.theme.colors.blockColor};
    text-align: center;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    padding:1em;
    border-radius:1em;
`
const ThankTitle = styled.div`
    color:${p=>p.theme.colors.signatureBlue};
    font-size:1.6em; 
    font-weight:bold;
`
const PrettyNumber = styled.div`
    font-size:1em;
    height:1.2em;
    padding:0 10px;
    transition: 0.3s ease;
    border-radius: 10px;
    background-color: ${p=>p.theme.colors.bgColor};
    color:${p=>p.theme.colors.signatureBlue};
    font-weight: bold;
`
const HomeBtn = styled.div`
    width:100%;
    height:2em;
    border-radius: 10px;
    background-color: ${p=>p.theme.colors.signatureRed};
    cursor:pointer;
    white-space: nowrap;
    display:flex;
    justify-content: center;
    align-items: center;
`
export default function Complete({orderId, secretKey}) {

    const basicToken = Buffer.from(`${secretKey}:`, "utf8").toString("base64");
    const router = useRouter();
    const url = `https://api.tosspayments.com/v1/payments/orders/${orderId}`;
    const [data, setData] = useState(null);

    useEffect(()=>{
        axios.get(url, {
            headers: {
              Authorization: `Basic ${basicToken}`,
              "Content-Type": "application/json",
            },
        }).then((res) => {
                setData(res.data);
                console.log(res.data);
                sendToBack(orderId,res.data.totalAmount,res.data.paymentKey)
            }
        );

    }, [orderId])

    const sendToBack = async (orderId,amount,paymentKey) => {
        await axios.get(
            `https://coinpick365.com:8080/success?orderId=${orderId}&amount=${amount}&paymentKey=${paymentKey}`,{
                headers: {
                    Authorization: `Basic ${basicToken}`,
                    "Content-Type": "application/json",
                },
            }
        )
    }

    return (
        <>
            <Adjust>
                <Container>
                    <ThankTitle>결제가 완료되었습니다!</ThankTitle>
                    <div style={{display:"flex", gap:"5px"}}><p style={{margin:0}}>결제된 포인트 : </p><PrettyNumber>{data?.totalAmount}</PrettyNumber></div>
                    <HomeBtn onClick={()=>router.push("/")}>홈으로</HomeBtn>
                </Container>
            </Adjust>

        </>
    )
}

Complete.getInitialProps = async ({query})=>{
    const {orderId} = query;
    const secretKey = process.env.TOSS_SECRET_KEY || "";
    return {orderId, secretKey}
}
