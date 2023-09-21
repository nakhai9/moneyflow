import DefaultLayout from '@/components/layouts/DefaultLayout'
import '@/styles/globals.css'
import type { AppProps } from 'next/app'

export default function App({ Component, pageProps }: AppProps) {
  return <DefaultLayout>
    <Component {...pageProps} />
  </DefaultLayout>
}
