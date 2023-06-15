import Pay_point from "@/components/payments/Paybtn"
import { ArrowBack, Backspace } from "@mui/icons-material"
import { Avatar } from "@mui/material"
import { useEffect, useRef, useState } from "react"
import styled, { css, keyframes } from "styled-components"

const GoLeft = keyframes`
    0% {
        opacity: 1;
        transform: translateX(0);
    }
    100% {
        opacity: 0;
        transform: translateX(-10%);
    }
`
const GoRight = keyframes`
    0% {
        opacity: 0;
        transform: translateX(10%);
    }
    100% {
        opacity: 1;
        transform: translateX(0);
    }
`
const Adjust = styled.div`
    width:100%;
    height:100%;
    display:flex;
    justify-content: center;
    align-items: center;
`
const Container = styled.div<{isChanging:boolean}>`
    display:flex;
    flex-direction: column;
    align-items: center;
    gap:10px;
    animation: ${p=>p.isChanging ? css`${GoLeft} 0.4s ease forwards` : css`${GoRight} 0.4s ease forwards`};
    width:450px;
`
const UserContainer = styled.div<{inited:boolean}>`
    padding:1em 1.5em;
    display: flex;
    justify-content: space-between;
    width:${p=>p.inited ? "100%" : "90%"};
    height:${p=>p.inited ? "100%" : "90%"};
    white-space: nowrap;
    background-color: ${p=>p.theme.colors.blockColor};
    border-radius: 20px;
    overflow:hidden;
    opacity: ${p=>p.inited ? 1 : 0.5};;
    transition: 0.5s ease;

    p {
        width:100%;
        text-align:center;
    }
`
const UserProperty = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    justify-content: space-between;
`
const PayContainer = styled.div<{inited:boolean}>`
    width:100%;
    background-color: ${p=>p.theme.colors.blockColor};
    border-radius: 20px;
    text-align: center;
    padding:1em;
    p {
        margin:10px;
        margin-bottom:20px;
    }
    span {
        font-size:3em;
        padding:${p=>p.inited ? "0 10px" : 0};
        transition: 0.3s ease;
        border-radius: 10px;
        background-color: ${p=>p.theme.colors.bgColor};
        color:${p=>p.theme.colors.signatureBlue};
        font-weight: bold;
    }
`
const NextBtn = styled.div`
    width:100%;
    height:2em;
    border-radius: 10px;
    background-color: ${p=>p.theme.colors.signatureBlue};
    cursor:pointer;
    margin:auto;
    margin-top:20px;
    white-space: nowrap;
    display:flex;
    justify-content: center;
    align-items: center;
`
const BackBtn = styled.div`
    position:absolute;
    gap:5px;
    display:flex;
    align-items: center;
    cursor:pointer;
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
const NumberContainer = styled.div`
    display:flex;
    gap:5px;
    text-align: right;
`
const Pay = () => {

    const [inited, setInited] = useState<boolean>(false);
    const [isChanging, setIsChanging] = useState<boolean>(false);
    setTimeout(() => {
        setInited(true);
    }, 300);
    const mode = useRef<"confirm"|"pay">("confirm");
    const changeMode = ()=>{
        setIsChanging(true);
        setTimeout(()=>{
            mode.current = mode.current === "confirm" ? "pay" : "confirm";
            setIsChanging(false);
        }, 400);
    }
    return <Adjust>
        <Container isChanging={isChanging}>
            <UserContainer inited={inited}>
                {inited ? <>
                    <Avatar/>
                    <UserProperty>
                        {mode.current === "confirm" ? <>
                            <span>nickname</span>
                            <NumberContainer>
                                <span>현재 포인트 : </span>
                                <PrettyNumber>1000</PrettyNumber>
                            </NumberContainer>
                        </>:<>
                            <NumberContainer>
                                <span>현재 포인트 : </span>
                                <PrettyNumber>1000</PrettyNumber>
                            </NumberContainer>
                            <div style={{display:"flex", gap:"5px"}}>
                                <span>충전할 포인트 : </span>
                                <PrettyNumber>30000</PrettyNumber>
                            </div>
                        </>}
                    </UserProperty>
                </> : <>
                    <p>Loading...</p>
                </>}

            </UserContainer>
            <PayContainer inited={inited}>
                {mode.current === "confirm" ? <>
                    <p>다음 포인트를 충전합니다</p>
                    <span>{inited ? "30000" : ""}</span>
                    <NextBtn onClick={changeMode}>
                        다음
                    </NextBtn>
                </>:<>
                    <BackBtn onClick={changeMode}><ArrowBack/>뒤로</BackBtn>
                        <p>센트코인 지갑 주소</p>
                         <PrettyNumber>0x2430Fb3DB4fba6391a65ffc94704042bd5Bc86a9</PrettyNumber>
                    <p>또는</p>
                    {Pay_point({amount:30000})}
                </>}
            </PayContainer>
        </Container>
    </Adjust>
}

Pay.navbar = false;
export default Pay;
