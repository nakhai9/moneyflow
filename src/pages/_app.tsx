import { store } from '@/store/store'
import '@/styles/globals.scss'
import theme from '@/styles/theme'
import { CssBaseline, ThemeProvider } from '@mui/material'
import type { AppProps } from 'next/app'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { Provider } from 'react-redux'

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
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Component {...pageProps} />
      </ThemeProvider>
    </Provider>

  </>
}
