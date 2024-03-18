import React, { ReactNode } from 'react'
import Header from './Header'
import { useRouter } from 'next/router'
import ProductNotification from '../ProductNotification'
import Footer from './Footer'
import Image from 'next/image'

type ILayoutProps = {
  children: ReactNode
  className?: string
}

const Layout: React.FC<ILayoutProps> = (params) => {
  const pathname = useRouter().pathname

  return (
    <div id="layout" className={params.className + ' font-raleway relative'}>
      <Header />
      <main className="px-2 bg-white">
        <section
          className={`border-zinc-200 border-2 p-2 pt-0 relative min-h-full ${pathname === '/' ? 'flex items-center' : ''}`}
        >
          <Image
            src="/background.webp"
            layout="fill"
            objectFit="cover"
            objectPosition="center"
            alt="background"
            className={`select-none transition-all ${pathname === '/' ? 'opacity-10' : 'opacity-5'}`}
          />
          {params.children}
        </section>
      </main>
      <Footer />
      <ProductNotification />
    </div>
  )
}

export default Layout
