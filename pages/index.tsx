import styled from 'styled-components';
import { useSession } from 'next-auth/react'
import {AdvancedRealTimeChart, TechnicalAnalysis, MarketData} from "react-ts-tradingview-widgets";
import useStore from '../store';
import { useEffect, useState } from 'react';

import Chat from '@/components/Chat';
import Signal from '@/components/Signal';
import useSWR from "swr";
import {getBottomSignal} from "@/lib/api/signal";
const Container = styled.div`
  width:100%;
  height:100%;
  display: flex;
  justify-content: center;
  flex-grow:0;
`
const Adjuster = styled.div`
  width:100%;
  height:100%;
  display:flex;
  justify-content: center;
  padding:30px;
  gap:10px;
`
const MainL = styled.div`
  flex:1;
  height:100%;
  min-height:200px;
  display: flex;
  flex-direction: column;
  gap:10px;
`
const MainR = styled.div`
  flex:0.1;
  height:100%;
  @media screen and (max-width:800px) {
    display:none;
  }
  display: flex;
  flex-direction: column;
  gap:10px;
`
const Sidebar = styled.div`
  flex:1;
  min-height:200px;
  background-color: ${p=>p.theme.colors.blockColor};
  border-radius:20px;
  overflow: hidden;
`
const MediaHidden = styled.div`
  height:100%;
    @media screen and (max-width:800px) {
    display:none;
  }
`
const ChatContainer = styled.div`
  flex:0.4;
  flex-basis:0;
  min-height:100px;
  background-color: ${p=>p.theme.colors.blockColor};
  border-radius:20px;
`
const RateContainer = styled.div`
  height:80px;
  display:flex;
  gap:10px;
`
const Progressbar = styled.div<{tcolor:number, size:number}>`
  background-color: ${p=>p.theme.colors.bgColor};
  border-radius: 1em;
  div {
    background-color: ${p=>p.tcolor === 0 ? "white" : p.tcolor === 1 ? p.theme.colors.signatureRed : p.tcolor === 2 ? p.theme.colors.signatureBlue : "orange"};
    width: ${props=>props.size}%;
    height: 10px;
    border-radius: 1em;
  }
`

const RateBox = styled.div`
  height:100%;
  flex:1;
  border-radius: 20px;
  background-color: ${p=>p.theme.colors.blockColor};
  display:flex;
  flex-direction: column;
  justify-content: space-between;
  padding:1.2em 1em;
`

const Widget = styled.div`
  width:100%;
  flex:1;
  background-color:white;
  border-radius:20px;
  overflow: hidden;
  display:flex;
  div {
    height:100%;flex-grow: 1;
  }
  div:nth-child(2) {
    flex:1;
    overflow-y: hidden;
  }
`

function Home() {
  const {themeMode, curPair} = useStore();
  const [isInited, setIsInited] = useState<boolean>(false);
  const {data} = useSWR("/get/buttom-signal",getBottomSignal, {refreshInterval:1000})
  useEffect(()=>{
    setIsInited(true); // 트레이딩뷰가 처음에 보이지 않아 추가함
  }, [])
  return (
    <>
      <Container>
        <Adjuster>
          <MainL>
            <Widget>
              {isInited && <>
                <AdvancedRealTimeChart autosize symbol={curPair} theme={themeMode ? "dark" : "light"}/>
                <MediaHidden>
                  <TechnicalAnalysis autosize symbol={curPair} colorTheme={themeMode ? "dark" : "light"}/>
                </MediaHidden>
              </>}
            </Widget>
            <RateContainer>
              <RateBox>
                <div>
                  공포 / 탐욕 지수 : {data && JSON.parse(data[0].sjon).fear}
                </div>
                <Progressbar tcolor={1} size={data && 100 - Math.floor(JSON.parse(data[0].sjon).fear)}>
                  <div/>
                </Progressbar>
              </RateBox>
              <RateBox>
                <div>
                  강도 지수 (RSI) : {data && JSON.parse(data[0].sjon).rsi}
                </div>
                <Progressbar tcolor={0} size={data && 100 - Math.floor(JSON.parse(data[0].sjon).rsi)}>
                  <div/>
                </Progressbar>
              </RateBox>
              <RateBox>
                <div>
                    스토캐스틱 : {data && JSON.parse(data[0].sjon).stoch}
                </div>
                <Progressbar tcolor={0} size={data && 100 - Math.floor(JSON.parse(data[0].sjon).stoch)} >
                  <div/>
                </Progressbar>
              </RateBox>
              <RateBox>
                <div>
                  트랜드 : {data && JSON.parse(data[0].sjon).rsi}
                </div>
                <Progressbar size={
                  30
                } tcolor={2}>
                  <div/>
                </Progressbar>
              </RateBox>
            </RateContainer>
          </MainL>
          <MainR>
            <Sidebar>
              <Signal/>
            </Sidebar>
            <ChatContainer>
              <Chat/>
            </ChatContainer>
          </MainR>



        </Adjuster>

      </Container>
    </>

  )
}
Home.navbar = true;
export default Home

