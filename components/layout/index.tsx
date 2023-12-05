import React, { ReactNode } from 'react'
import Header from './Header'

type ILayoutProps = {
  children: ReactNode
}
const Layout: React.FC<ILayoutProps> = (params) => {
  return (
    <div id="layout">
      <Header />
      <main className="px-2">
        <section className="border-zinc-200 border-2 p-2">{params.children}</section>
      </main>
    </div>
  )
}

export default Layout
