import styled, { keyframes } from "styled-components";
import { Search } from "@mui/icons-material";
import { useEffect, useRef, useState } from "react";
import { Avatar } from "@mui/material";
import PrettySwitch from "./switch";
import useStore from "../store";
import shallow from "zustand";
import {useRouter} from "next/navigation";
import Link from "next/link";
import Cookies from 'universal-cookie';
import {logout} from "@/lib/api/auth";
const cookie = new Cookies();
const Padding = styled.div`

    width:100%;
    height:50px;
`

const Container = styled.div`
    left:0;
    width:100%;
    height:50px;
    padding: 0 40px;
    display:flex;
    align-items: center;
    justify-content: space-between;
    background-color: ${p=>p.theme.colors.blockColor};
    z-index:1000;

`
const InputContainer = styled.form`
    position: absolute;
    left:50%;
    transform:translateX(-50%);
    height:30px;
    width:400px;
    max-width:35%;
    div > svg {
        cursor:pointer;
        position:absolute;
        top:50%;
        transform:translateY(-50%);
        opacity:0.5;
        right:10px;
    }
 
`
const SearchBar = styled.input`
    height:100%;
    width:100%;
    padding-left:15px;
    padding-right:35px;
    border-radius: 30px;
    border:none;
    background-color: ${p=>p.theme.colors.bgColor};
    &:focus {
        outline:none;
    }
`
const RightSide = styled.div`
    display:flex;
    align-items: center;

    gap:10px;
`

const HoverMenuAdjust = styled.div`
    position:fixed;
    right:40px;
    z-index:2;
    top:50px;

`
const HoverMenuContainer = styled.div<{active:boolean}>`
    overflow:hidden;

    margin-top:10px;
    width:${p=>p.active ? "400px" : "0px"};
    height:${p=>p.active ? "300px" : "0px"};
    background-color: ${p=>p.theme.colors.bgColor};
    transition: 0.3s ease;
    border-radius:30px;
    pointer-events: ${p=>p.active ? "all" : "none"};
    animation-direction: ${p=>p.active ? "normal" : "reverse"};
    box-shadow: 0 0 10px 2px #888;
    opacity:${p=>p.active ? 1 : 0};
    padding:10px 20px;
    div {
        text-align:center;
        padding:10px;
        white-space: nowrap;
        transition: 0.2s ease;
    }
`
const AvatarContainer = styled.div`
    width:auto;
    height:100%;
    margin:0;
    padding:5px;
`

const PrettyButton = styled.div`
    width:auto;
    height:2em;
    border-radius: 0.2em;
    background-color: ${p=>p.theme.colors.signatureRed};
    display: flex;
    justify-content: center;
    align-items: center;
    color:white;
    cursor:pointer;
`

const SearchComponent = () => {
    const [value, setValue] = useState<string>('');

    const onSubmit = (e) => {
        e.preventDefault();

    }

    return <InputContainer onSubmit={onSubmit}>
            <SearchBar placeholder={"검색어를 입력해주세요"} value={value} onChange={e=>setValue(e.target.value)}/>
            <div><Search fontSize="small"/></div>
    </InputContainer>

}


const NotLoginContainer = styled.div`
    width:100%;
    height:100%;
    display:flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

`

const HoverMenuOption = styled.div`
    width:100%;
    height:5em;
    display:flex;
    align-items: center;
    justify-content: space-between;


`

const HoverMenu = ({active} : {active:boolean})=> {
    const [menuHover, setMenuHover] = useState<boolean>(false);
    const {themeMode, setThemeMode, setIsLogined,isLogined} = useStore();
    const {push} = useRouter();
    return <HoverMenuAdjust onMouseEnter={()=>setMenuHover(true)} onMouseLeave={()=>setMenuHover(false)}>

            <HoverMenuContainer  active={active || menuHover}>
                <div>Good to see you, {"nickname"}.</div>
                <HoverMenuOption><div>Point:</div><div>1000</div></HoverMenuOption>
                <HoverMenuOption><div>테마 :</div><PrettySwitch state={themeMode} setfunc={setThemeMode}/></HoverMenuOption>
                <PrettyButton onClick={()=>{
                    logout();
                    setIsLogined(false);
                    push("/auth/login");
                }}>Logout</PrettyButton>
            </HoverMenuContainer>

    </HoverMenuAdjust>
}
const NavBar = () => {
    const [isHover, setIsHover] = useState<boolean>(false);

    return <>

    <Container>
        <Link href="/"><h2>LOGO</h2></Link>

        <SearchComponent/>
        <RightSide>
            <Link href="/admin">admin{"<dev>"}</Link>
            <Link href="/notice">notice</Link>
            <Link href="/pay">pay</Link>
            <AvatarContainer onMouseEnter={()=>{
                setIsHover(true)
            }}
                onMouseLeave={()=>{
                setIsHover(false)
                }}
                style={{margin:"5px"}}
            >
                <Avatar/>
            </AvatarContainer>

            <HoverMenu active={isHover}/>
        </RightSide>

    </Container>
    </>
}


export default NavBar;
