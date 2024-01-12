import { Modal, Row, Col, Input, Radio, Button } from 'antd'
import { OptionCombinations, OptionInfo } from 'interface/smartstore.interface'
import { useEffect, useState } from 'react'

type IProps = {
  open: boolean
  onOk: (optionCombinations: OptionInfo['optionCombinations']) => void
  onCancel: () => void
  optionInfo: OptionInfo
}

export function OptionModificationModal({ open, onOk, onCancel, optionInfo }: IProps) {
  const [batchIncreasePrice, setBatchIncreasePrice] = useState<number>(0)
  const [batchUpdatePrice, setBatchUpdatePrice] = useState<number>(0)
  const [batchUpdateQty, setBatchUpdateQty] = useState<number>(0)
  const [optionMutation, setOptionMutation] = useState<OptionInfo['optionCombinations']>(optionInfo.optionCombinations)

  const onChangeOptionInfo = (value: string | boolean, index: number, key: keyof OptionCombinations) => {
    const newOptionMutation = JSON.parse(JSON.stringify(optionMutation))
    newOptionMutation[index][key] = value

    setOptionMutation(newOptionMutation)
  }

  const batchEditPrice = (type: 'increase' | 'update') => {
    const newOptionMutation = JSON.parse(JSON.stringify(optionMutation))

    if (type === 'increase') {
      newOptionMutation.forEach((x: any) => {
        x.price += batchIncreasePrice
      })
    } else if (type === 'update') {
      newOptionMutation.forEach((x: any) => {
        x.price = batchUpdatePrice
      })
    }

    setOptionMutation(newOptionMutation)
  }

  const batchEditQty = () => {
    const newOptionMutation = JSON.parse(JSON.stringify(optionMutation))

    newOptionMutation.forEach((x: any) => {
      x.stockQuantity = batchUpdateQty
    })

    setOptionMutation(newOptionMutation)
  }

  useEffect(() => {
    setOptionMutation(optionInfo.optionCombinations)
    setBatchIncreasePrice(0)
    setBatchUpdatePrice(0)
    setBatchUpdateQty(0)
  }, [optionInfo])

  return (
    <Modal title="옵션 수정" open={open} onOk={() => onOk(optionMutation)} onCancel={onCancel} width={1000}>
      <Row gutter={[8, 8]} className="mb-2">
        <Col xs={4}>
          <div className="flex flex-col">
            <span className="text-[10px]">가격 일괄상향</span>
            <div className="flex gap-1">
              <Input className="!w-20" size="small" onChange={(e) => setBatchIncreasePrice(Number(e.target.value))} />
              <Button type="primary" size="small" onClick={() => batchEditPrice('increase')} disabled={!batchIncreasePrice}>
                수정
              </Button>
            </div>
          </div>
        </Col>
        <Col xs={4}>
          <div className="flex flex-col">
            <span className="text-[10px]">가격 일괄수정</span>
            <div className="flex gap-1">
              <Input className="!w-20" size="small" onChange={(e) => setBatchUpdatePrice(Number(e.target.value))} />
              <Button type="primary" size="small" onClick={() => batchEditPrice('update')} disabled={!batchUpdatePrice}>
                수정
              </Button>
            </div>
          </div>
        </Col>
        <Col xs={4}>
          <div className="flex flex-col">
            <span className="text-[10px]">수량 일괄수정</span>
            <div className="flex gap-1">
              <Input className="!w-20" size="small" onChange={(e) => setBatchUpdateQty(Number(e.target.value))} />
              <Button type="primary" size="small" onClick={batchEditQty} disabled={!batchUpdateQty}>
                수정
              </Button>
            </div>
          </div>
        </Col>
      </Row>
      <Row gutter={[8, 8]} className="font-bold">
        <Col xs={4}>옵션명1</Col>
        <Col xs={9}>옵션명2</Col>
        <Col xs={4}>가격(₩)</Col>
        <Col xs={2}>수량</Col>
        <Col xs={5}>사용여부</Col>
      </Row>
      <div className="max-h-[30vw] overflow-y-scroll overflow-x-scroll md:overflow-x-hidden">
        {optionMutation?.map((x, index) => (
          <Row key={x.id} gutter={[8, 8]} className="mb-1">
            <Col xs={4}>
              <Input
                id={x.id.toString()}
                value={x.optionName1}
                onChange={(e) => onChangeOptionInfo(e.target.value, index, 'optionName1')}
              />
            </Col>
            <Col xs={9}>
              <Input value={x.optionName2} onChange={(e) => onChangeOptionInfo(e.target.value, index, 'optionName2')} />
            </Col>
            <Col xs={4}>
              <Input value={x.price} onChange={(e) => onChangeOptionInfo(e.target.value, index, 'price')} />
            </Col>
            <Col xs={2}>
              <Input value={x.stockQuantity} onChange={(e) => onChangeOptionInfo(e.target.value, index, 'stockQuantity')} />
            </Col>
            <Col xs={5}>
              <Radio.Group
                className="flex items-center justify-start whitespace-nowrap"
                key={`radio-group-${x.id}`}
                options={[
                  { label: '사용', value: true },
                  { label: '미사용', value: false },
                ]}
                onChange={(e) => onChangeOptionInfo(e.target.value, index, 'usable')}
                value={x.usable}
              />
            </Col>
          </Row>
        ))}
      </div>
    </Modal>
  )
}
