import { HomeOutlined, UserOutlined } from '@ant-design/icons'
import React, { useEffect, useState } from 'react'
import { Breadcrumb } from 'antd'
import { useRecoilState } from 'recoil'
import { common } from '@/lib/store/common'
import { BreadcrumbItemType, BreadcrumbSeparatorType } from 'antd/es/breadcrumb/Breadcrumb'

const menu: Partial<BreadcrumbItemType & BreadcrumbSeparatorType>[] = [
  {
    href: '/',
    className: '!text-inherit',
    title: <HomeOutlined />,
  },
  {
    href: '',
    className: '!text-inherit',
    title: (
      <>
        <UserOutlined />
        <span>상품 가져오기</span>
      </>
    ),
  },
  {
    title: 'Product List',
  },
]

const BreadcrumbComponent: React.FC = () => {
  const [commonState, setCommonState] = useRecoilState(common)
  const [items, setItems] = useState<Partial<BreadcrumbItemType & BreadcrumbSeparatorType>[]>([])

  useEffect(() => {
    setItems(menu.slice(0, commonState.step))
  }, [commonState.step])

  return <Breadcrumb items={items} />
}

export default BreadcrumbComponent
