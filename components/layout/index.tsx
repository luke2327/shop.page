import React, { ReactNode } from 'react'
import { useRecoilState } from 'recoil'
import { common } from '@/lib/store/common'
import Header from './Header'

type ILayoutProps = {
  children: ReactNode
}
const Layout: React.FC<ILayoutProps> = (params) => {
  const [commonState, setCommonState] = useRecoilState(common)

  return commonState.step > 1 || true ? (
    <div id="layout">
      <Header />
      <main>{params.children}</main>
    </div>
  ) : (
    <div id="layout">
      <main>{params.children}</main>
    </div>
  )
}

export default Layout
