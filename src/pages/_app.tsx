import { store } from '@/store/store'
import '@/styles/globals.scss'
import theme from '@/styles/theme'
import { CssBaseline, ThemeProvider } from '@mui/material'
import type { AppProps } from 'next/app'
import Head from 'next/head'
import { Provider } from 'react-redux'

export default function App({ Component, pageProps }: AppProps) {
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
