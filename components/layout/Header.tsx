import React from 'react'

import Breadcrumb from '@/components/layout/Breadcrumb'

const Header: React.FC = () => {
  return (
    <header className={'sticky top-0 px-4 py-2 z-10 bg-white'}>
      <Breadcrumb />
    </header>
  )
}

export default Header
