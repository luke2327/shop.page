import React from 'react'
import { ConfigProvider } from 'antd'
import type { AppProps } from 'next/app'
import { RecoilRoot } from 'recoil'
import Layout from '@/components/layout'
import { Raleway } from '@next/font/google'
import '@/lib/axios'
import '@/styles/globals.scss'

const raleway = Raleway({
  variable: '--font-raleway',
  subsets: ['latin'],
})

const App = ({ Component, pageProps }: AppProps) => (
  <RecoilRoot>
    <ConfigProvider>
      <Layout className={raleway.variable}>
        <Component {...pageProps} />
      </Layout>
    </ConfigProvider>
  </RecoilRoot>
)

export default App
