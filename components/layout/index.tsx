import React, { ReactNode } from 'react'
import Header from './Header'

type ILayoutProps = {
  children: ReactNode
}
const Layout: React.FC<ILayoutProps> = (params) => {
  return (
    <div id="layout">
      <Header />
      <main>{params.children}</main>
    </div>
  )
}

export default Layout
