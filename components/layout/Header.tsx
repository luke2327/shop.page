import React from 'react'
import { useRecoilState } from 'recoil'
import { common } from '@/lib/store/common'

import Breadcrumb from '@/components/layout/Breadcrumb'

const Header: React.FC = () => {
  const [commonState, setCommonState] = useRecoilState(common)

  return (
    <header className={'sticky top-0 px-4 py-2'}>
      <Breadcrumb />
    </header>
  )
}

export default Header
