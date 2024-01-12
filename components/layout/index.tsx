import React, { ReactNode } from 'react'
import Header from './Header'
import { useRouter } from 'next/router'
import ProductNotification from '../ProductNotification'

type ILayoutProps = {
  children: ReactNode
  className?: string
}

const Layout: React.FC<ILayoutProps> = (params) => {
  const pathname = useRouter().pathname

  return (
    <div id="layout" className={params.className + ' font-raleway'}>
      <Header />
      <main className="px-2">
        <section className={`border-zinc-200 border-2 p-2 min-h-full ${pathname === '/' ? 'flex items-center' : ''}`}>
          {params.children}
        </section>
      </main>
      <ProductNotification />
    </div>
  )
}

export default Layout
