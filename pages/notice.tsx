import { ArrowUpward } from "@mui/icons-material";
import { Avatar } from "@mui/material";
import Image from "next/image";
import { MouseEventHandler, useCallback, useEffect, useMemo, useRef, useState } from "react"
import styled from "styled-components"
import useSWR, {useSWRConfig} from "swr";
import {getNotice, sendNotice} from "@/lib/api/notice";

type sliderType = 0|1;
const abs = (n:number) => n < 0 ? -n : n;
const Container = styled.div`
    width:100%;
    height:auto;

`
const Slider = styled.div<{active:boolean}>`
    position:fixed;
    top:${p=>p.active ? "70px" : "0px"};
    opacity:${p=>p.active ? "1" : "0"};
    left:50%;
    transform: translateX(-50%);
    transition: 0.5s cubic-bezier(0.165, 0.84, 0.44, 1);
    height:25px;
    width:800px;
    max-width:60%;
    border-radius:1em;
    background-color: ${p=>p.theme.colors.blockColor};
    display:flex;
    overflow:hidden;
    z-index: 3;
`
const SliderPicker = styled.div<{mode:sliderType}>`
    position:absolute;
    left:${p=>75 * p.mode + "%"};
    transform: ${p=>`translateX(-${50*p.mode}%)`};  
    width:500px;
    max-width:50%;
    height:100%;
    transition:0.3s cubic-bezier(0.215, 0.610, 0.355, 1);
    background-color: ${p=>!p.mode ? p.theme.colors.signatureBlue : p.theme.colors.signatureRed};
    border-radius: 1em;
    text-align:center;
    display:flex;
    align-items:center;
    justify-content:center;

`
const HiddenSliderButton = styled.div<{mode:sliderType, index:sliderType}>`
    flex:1;
    text-align: center;
    opacity: ${p=>1-abs(p.index-p.mode)/2};
    transition:0.4s cubic-bezier(0.645, 0.045, 0.355, 1);
    cursor:pointer;
    display:flex;
    align-items:center;
    justify-content:center;
`
const BlockAdjuster = styled.div`
    position:absolute;
    top:0;
    padding-top:50px;
    width:100%;
    height:100vh;
    display:flex;
    justify-content: center;
`
const BlockSlider = styled.div`
    padding-top:60px;
    width:1000px;
    max-width:80%;
    height:100%;
    position:relative;
    overflow-y: auto;

    z-index:2;
    &::-webkit-scrollbar {
        width:10px;
    }
    &::-webkit-scrollbar-thumb {
        background-color: ${p=>p.theme.colors.invertColor};
        border-radius: 10px;
        background-clip:padding-box;
        border:3px solid transparent;
    }
`
const Block = styled.div`
    width:100%;
    height:auto;
    max-height:900px;
    background-color: ${p=>p.theme.colors.blockColor};
    border-radius: 20px;
    padding:30px;
    margin-bottom:10px;
    display:flex;
    flex-direction: column;
`

const BlockHeader = styled.div`
    top:0;
    width:100%;
    height:50px;
    display:flex;
    align-items:center;
    gap:10px;
    margin-bottom:10px;
`
const BlockImage = styled.div`
    width:100%;
    height:auto;
    max-height:700px;
    overflow-y: auto;
    border-radius: 20px;
    
    &::-webkit-scrollbar {
        width:10px;
    }
    &::-webkit-scrollbar-thumb {
        background-color: black;
        border-radius: 10px;
        background-clip:padding-box;
        border:2px solid transparent;
    }
`
const BlockContent = styled.div`
    flex:1;
    width:100%;
    overflow-y: auto;
    &::-webkit-scrollbar {
        width:10px;
    }
    &::-webkit-scrollbar-thumb {
        background-color: black;
        border-radius: 10px;
        background-clip:padding-box;
        border:2px solid transparent;
    }
    

`
const SliderEnd = styled.div`
    width:100%;
    color:${p=>p.theme.colors.textColor};
    text-align: center;
    padding-top: 15px;
    height:60px;
`
type BlockType = {
    email:string,
    timeStamp:number,
    content:string,
}

const TopButtonAdjust = styled.div`
    position:fixed;
    right:15px;
    bottom:15px;
    width:50px;
    height:50px;
    cursor:pointer;
`
const TopButton  =styled.div`
    width:100%;
    height:100%;
    border-radius: 50px;
    background-color: ${p=>p.theme.colors.invertColor};
    display: flex;
    align-items: center;
    justify-content: center;
`
const AdminContainer = styled.div`
    display:flex;
    flex-direction: column;
    width:100%;
    height:10em;
    gap:5px;
    * {
        border-radius: 1em;
    }
  input {
    padding:5px;
    resize:none;
    background-color: ${p=>p.theme.colors.bgColor};
    outline:none;
    border:none;
  }
    textarea {
        flex:1;
        padding:5px;
        resize:none;
        background-color: ${p=>p.theme.colors.bgColor};
        outline:none;
        border:none;
        &::-webkit-scrollbar {
        width:10px;
        }
        &::-webkit-scrollbar-thumb {
            background-color: ${p=>p.theme.colors.blockColor};
            border-radius: 10px;
            background-clip:padding-box;
            border:2px solid ${p=>p.theme.colors.bgColor};
            
        }
    }
    button {
        height:2em;
        border:none;
        cursor:pointer;
        background-color: ${p=>p.theme.colors.signatureBlue};
    }

`


const AdminInput = () => {
    const {mutate} = useSWRConfig();
    const [input, setInput] = useState<string>('');
    const [noticeTitle, setNoticeTitle] = useState<string>('');

    const onSubmit = async (e) => {
        e.preventDefault();
        await sendNotice(noticeTitle,input);
        await mutate('/get/notice');
        setInput('');
    }

    return <>
        <Block>
            <AdminContainer>
                <input type="text" value={noticeTitle} onChange={e => setNoticeTitle(e.target.value)} placeholder={"제목을 입력해주세요"} />
                <textarea placeholder="내용을 입력해주세요." value={input} onChange={e=>setInput(e.target.value)}/>
                <button onClick={onSubmit}>Shoot the bullet</button>
            </AdminContainer>
        </Block>
    </>
}

Notice.navbar=true;
export default function Notice() {

    const SliderComponent =() => { // 모드가 변함에 따라 업데이트해주기 때문에 state를 밖으로 뺌
        const content = ["new", "old"];
        const [mode, setMode] = useState<sliderType>(0); // localStorage에 마지막 모드 저장 후 불러오기
        // mode state를 바깥으로 뺄 경우 transition 적용 안됨 버그..
        // 이 블럭에서 외부 state 변경 함수를 실행하는 것으로 해결 예정
        const [isSliderVisible, setIsSliderVisible] = useState<boolean>(true);
        let lastScrollY = 0;
        let lastDir : boolean = false;
        useEffect(()=>{
            addEventListener("mousewheel", (e:WheelEvent) => {
                //@ts-ignore
                if(e.target.tagname === "TEXTAREA") return;
                const dir = e.deltaY > 0;

                if(dir == lastDir) return;
                lastDir = dir;

                if(dir) {

                    setIsSliderVisible(false);
                } else {
                    setIsSliderVisible(true);
                }

              });
        }, [])
        return <>
            <Slider active={isSliderVisible}>
                {[...Array(2)].map((v, i:sliderType)=>(
                    <HiddenSliderButton key={i} mode={mode} index={i} onClick={()=>setMode(i)}>
                        {content[i]}
                    </HiddenSliderButton>
                ))}
                <SliderPicker mode={mode}>
                    {content[mode]}
                </SliderPicker>
            </Slider>
        </>
    }

    const {data,error,mutate} = useSWR(`/get/notice`,getNotice);

    const isAdmin = useRef<boolean>(false);
    const [inited, setInited] = useState(false); // hydration 오류 해결
    useEffect(()=>{
        isAdmin.current =true;
        setInited(true);

    }
    , []);
    // const {data, error, mutate} = useSWR(`/get/user/all`)
    const topRef = useRef<HTMLDivElement>(null); // 맨 위로 가기를 위한 ref
    const onTopBtnClick = () => {
        topRef.current?.focus();
    }
    return <>
        {inited && <>
            <Container>
                <SliderComponent/>
                <BlockAdjuster>
                    <BlockSlider ref={topRef}>
                        <AdminInput/>
                        {data?.map((obj, i)=>(

                                <Block key={i}>
                                    <BlockHeader>
                                            {obj.user.username}
                                            {obj.noticeDate}
                                    </BlockHeader >
                                    <BlockContent >
                                        {obj.noticeContent}
                                    </BlockContent>

                                </Block>

                        ))}
                        <SliderEnd>
                            더 이상 게시물이 없습니다.
                        </SliderEnd>
                    </BlockSlider>
                </BlockAdjuster>
            </Container>
            <TopButtonAdjust>
                <TopButton onClick={()=>onTopBtnClick()}>
                    <ArrowUpward/>
                </TopButton>
            </TopButtonAdjust>
        </>}

    </>
}
