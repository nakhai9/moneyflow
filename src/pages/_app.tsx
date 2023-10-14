import '@/styles/globals.scss'
import { ThemeProvider, createTheme } from '@mui/material'
import type { AppProps } from 'next/app'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { useEffect } from 'react'


export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  // useEffect(() => {
  //   const token = localStorage.getItem("token");
  //   if (!token) {
  //     router.push("/auth/login");
  //   }
  // }, [])
  return <>
    <Head>
      <title>Wallet NextJS</title>
    </Head>
    <Component {...pageProps} />
  </>
}
