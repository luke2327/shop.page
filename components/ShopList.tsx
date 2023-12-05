import { solution } from '@/lib/store/common'
import { productV2 } from '@/lib/store/product'
import { V2Data } from '@/pages/api/engines/smartstore/list'
import { Card, Input } from 'antd'
import axios from 'axios'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { useRecoilValue, useSetRecoilState } from 'recoil'

const ShopList: React.FC = () => {
  const router = useRouter()
  const solutionState = useRecoilValue(solution)
  const setProductV2State = useSetRecoilState(productV2)
  const [prodCode, setProdCode] = useState('')

  console.log(solutionState)
  const onSubmit = async () => {
    console.log(prodCode.split(','))
    const payload = {
      ...solutionState.shopInfo,
      prodCodeList: prodCode.split(',').map((x) => x.trim()),
    }
    const result = await axios.post<V2Data>('/engines/smartstore/list', payload)

    setProductV2State({ smartstore: result.data.result.list })

    console.log(result.data.result.list)

    router.push('/product/listV2')
  }
  return (
    <div>
      <Input.TextArea
        onChange={(e) => setProdCode(e.target.value)}
        className={'!h-[400] !flex !items-start !justify-start'}
        style={{ minHeight: 400 }}
      />
      <Card
        title={solutionState.shopInfo.shop_name}
        bordered={false}
        style={{ width: 600 }}
        className="cursor-pointer hover:bg-zinc-100 transition ease-in-out delay-75 mt-2"
        onClick={onSubmit}
      >
        <h1 className="text-xl">{solutionState.shopInfo.shop_id}</h1>
        <div className="flex w-full">
          <p className="pr-1">client key :</p>
          <p>{solutionState.shopInfo.client_key}</p>
        </div>
        <div className="flex">
          <p className="pr-1">client secret key :</p>
          <p>{solutionState.shopInfo.client_secret_key}</p>
        </div>
      </Card>
    </div>
  )
}

export default ShopList
