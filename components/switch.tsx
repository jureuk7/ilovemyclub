import { Dispatch, SetStateAction, memo, useEffect, useState } from "react";
import styled from "styled-components";

const Container = styled.div`
    position:relative;
    padding:0px !important;
    width: 35px;
    height: 15px; 
    background-color: brown;
    border-radius: 10px;
    cursor:pointer;
`
const Ball = styled.div<{active:boolean}>`
    position: absolute;
    width:18px;
    height:18px;
    transform:translate(-2px, -2px);
    left:${p=>p.active ? "20px" : "0px"};
    transition:0.2s ease;
    border-radius:10px;
    background-color: white;
`
const PrettySwitch = ({state, setfunc} : {state:boolean, setfunc:Dispatch<SetStateAction<boolean>>}) => {
return <>
        <Container onClick={()=>setfunc(!state)}>
            <Ball active={state}>

            </Ball>
        </Container>
    </>

}

export default memo(PrettySwitch);