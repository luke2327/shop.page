import React, { ReactNode, useEffect } from 'react'
import { useRecoilState } from 'recoil'
import { common } from '@/lib/store/common'
import { product } from '@/lib/store/product'
import List from '@/components/engines/smartstore/List'
import { useRouter } from 'next/router'

type ILayoutProps = {
  children: ReactNode
}
const ProductList: React.FC<ILayoutProps> = (params) => {
  const [commonState, setCommonState] = useRecoilState(common)
  const [productState, setProductState] = useRecoilState(product)
  const router = useRouter()

  useEffect(() => {
    if (!commonState.isLogin) {
      router.push('/')
    }
  }, [commonState.isLogin, router])

  return commonState.step === 3 ? (
    <div className={'px-8'}>
      <List data={productState.uploadExcelData} />
    </div>
  ) : null
}

export default ProductList
