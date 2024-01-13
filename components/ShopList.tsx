import { common, solution } from '@/lib/store/common'
import { productV2 } from '@/lib/store/product'
import { V2Data } from '@/pages/api/engines/smartstore/list'
import { Card, Input } from 'antd'
import axios from 'axios'
import { useRouter } from 'next/router'
import React, { useEffect, useRef, useState } from 'react'
import { useRecoilValue, useSetRecoilState } from 'recoil'

const ShopList: React.FC = () => {
  const router = useRouter()
  const commonState = useRecoilValue(common)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (!commonState.isLogin) {
      router.push('/')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  const solutionState = useRecoilValue(solution)
  const setProductV2State = useSetRecoilState(productV2)
  const [prodCode, setProdCode] = useState('')

  const onSubmit = async () => {
    if (prodCode === '') {
      return
    }

    const payload = {
      ...solutionState.shopInfo,
      prodCodeList: prodCode.split('\n').map((x) => x.trim()),
      userInfo: solutionState.userInfo,
    }
    const result = await axios.post<V2Data>('/engines/smartstore/productList', payload)

    setProductV2State({ smartstore: result.data.result.list })

    router.push('/product/listV2')
  }

  const handleChange = (event: React.ChangeEvent<HTMLInputElements>) => {
    event.persist()
    setProdCode(event.target.value)
  }

  return (
    <div>
      <p className="text-lg mt-1">상품번호</p>
      <p className="text-zinc-500 text-sm">불러올 상품번호를 입력해주세요. 엔터로 구분합니다.</p>
      <p className="text-zinc-500 text-sm">최대 500개 단위로 입력할 수 있습니다.</p>
      <Input.TextArea
        ref={textareaRef}
        className={'!h-[400] !flex !items-start !justify-start'}
        style={{ minHeight: 400 }}
        onChange={handleChange}
        placeholder="9615205949"
      />

      <p className="text-lg mt-2">등록된 상점 리스트</p>
      <p className="text-zinc-500 text-sm">상품번호 입력 후 불러올 상점을 선택 후 잠시 기다려 주세요</p>
      <Card
        title={solutionState.shopInfo.shop_name}
        bordered={true}
        style={{ width: 440 }}
        className="!cursor-pointer hover:bg-neutral-200 transition ease-in-out delay-50 mt-2 !border-neutral-300"
        onClick={onSubmit}
        bodyStyle={{ padding: 12 }}
        headStyle={{ padding: 12 }}
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
