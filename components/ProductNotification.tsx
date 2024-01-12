import { productNotification } from '@/lib/store/common'
import { Progress } from 'antd'
import { useEffect, useState } from 'react'
import { useRecoilState } from 'recoil'

export default function ProductNotification() {
  const [productNotificationState, setProductNotificationState] = useRecoilState(productNotification)
  const [percent, setPercent] = useState('')

  useEffect(() => {
    const particle = 100 / productNotificationState.total
    const currentPercent = productNotificationState.success * particle

    setPercent(currentPercent.toFixed(2))
  }, [productNotificationState])

  if (
    productNotificationState.isShow &&
    productNotificationState.total === productNotificationState.success + productNotificationState.fail
  ) {
    setTimeout(() => {
      setProductNotificationState({
        isShow: false,
        title: '',
        success: 0,
        fail: 0,
        total: 0,
      })
    }, 3000)
  }

  return (
    productNotificationState.isShow && (
      <div className="absolute bottom-5 right-5 border-neutral-300 border rounded-md bg-white w-80 h-20 p-2 pr-6">
        <span>{productNotificationState.title}</span>
        <Progress type="line" percent={Number(percent)} />
      </div>
    )
  )
}
