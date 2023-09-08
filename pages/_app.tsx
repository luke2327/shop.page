import React from 'react'
import { ConfigProvider } from 'antd'
import type { AppProps } from 'next/app'
import { RecoilRoot } from 'recoil'
import Layout from '@/components/layout'
import '@/styles/globals.scss'

const App = ({ Component, pageProps }: AppProps) => (
  <RecoilRoot>
    <ConfigProvider>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </ConfigProvider>
  </RecoilRoot>
)

export default App
