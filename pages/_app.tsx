import GlobalStyle from 'styles/globals'
import 'react-toastify/dist/ReactToastify.css'
import { SWRConfig } from 'swr'
import { ToastContainer } from 'react-toastify'
import { ThemeProvider } from 'styled-components'
import Head from 'next/head'

import styled from 'styled-components'
import Login from './auth/login'
import {dark, light} from "../styles/theme"
import {useEffect, useState} from 'react'
import useStore from '../store';
import NavBar from '@/components/navbar'
import { useRouter } from 'next/router'
import axios from 'axios'
import {authClient, client} from "@/lib/api/client";

const Container = styled.div`
  width:100vw;
  height:100vh;
  display:flex;
  flex-direction: column;
`
export default function MyApp({
  Component,
  pageProps: { session, ...pageProps }
}) {
  const {themeMode, isLogined, setIsLogined} = useStore();
  const themeTray = [light, dark]; // 라이트, 다크 테마 이외의 테마 추가 대비
  const theme = themeTray[+themeMode];
  const router = useRouter();

  useEffect( ()=>{
      if(window.localStorage.getItem("token") !== null) setIsLogined(true);
      if(!isLogined && router.asPath !== "/" && router.asPath !== "/auth/login") router.push("/auth/login")
  },[router])

  return (

      <ThemeProvider theme={theme || light}>
        <GlobalStyle/>
        <SWRConfig>
            <Head>
              <title>CoinPick365</title>
              <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
            </Head>
            <button style={{position:"fixed", color:"black"}} onClick={()=>{router.push("/")}}>메인으로</button>
            <Container>
              {
                Component.navbar && <NavBar/>
              }
              <Component {...pageProps} />
            </Container>
        </SWRConfig>
        <ToastContainer
          autoClose={3000}
          draggable={false}
          theme={themeMode == true ? "dark" : "light"}
        />
      </ThemeProvider>

  )
}

