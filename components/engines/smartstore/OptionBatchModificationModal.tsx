import { Button, Col, Divider, Input, Modal, Row, Tag } from 'antd'
import { Item, OptionCombinations } from 'interface/smartstore.interface'
import React, { useState } from 'react'

type OptionBatchModificationModalProps = {
  open: boolean
  onCancel: () => void
  items: Item[]
  setItems: React.Dispatch<React.SetStateAction<Item[]>>
}

type OptionVisual = {
  productName: string
} & OptionCombinations

const OptionBatchModificationModal: React.FC<OptionBatchModificationModalProps> = ({ open, onCancel, items, setItems }) => {
  const [isSearching, setIsSearching] = useState(false)
  const [optionKeyword, setOptionKeyword] = useState('')
  const [optionQty, setOptionQty] = useState('0')
  const [newOptions, setNewOptions] = useState<OptionVisual[]>([])
  const onSearch = (keyword: string) => {
    setIsSearching(true)
    setOptionKeyword(keyword)
    const temp: OptionVisual[] = []

    items.forEach((item) => {
      item.productOption?.optionCombinations?.forEach((option) => {
        if (option.optionName1.includes(keyword) || option.optionName2.includes(keyword)) {
          temp.push({
            productName: item.productName,
            ...option,
          })
        }
      })
    })

    setNewOptions(temp)
    setIsSearching(false)
  }
  const onChangePrice = (e: React.ChangeEvent<HTMLInputElement>) => {
    setOptionQty(e.target.value)
  }
  const updateOption = () => {
    const newItems = JSON.parse(JSON.stringify(items)) as Item[]
    const temp: OptionVisual[] = []

    newItems.forEach((item) => {
      item.productOption?.optionCombinations?.forEach((option) => {
        if (option.optionName1.includes(optionKeyword) || option.optionName2.includes(optionKeyword)) {
          option.stockQuantity = Number(optionQty)

          temp.push({
            productName: item.productName,
            ...option,
          })
        }
      })
    })

    setItems(newItems)
    setNewOptions(temp)
  }

  const onClose = () => {
    setIsSearching(false)
    setOptionKeyword('')
    setOptionQty('0')
    setNewOptions([])
    onCancel()
  }

  return (
    <Modal
      title="옵션 일괄수정"
      open={open}
      onCancel={onClose}
      width={1000}
      footer={[
        <div key="back" className="flex justify-end items-end gap-2">
          <span className="text-xs">검색 후 수정 버튼을 누르면 저장이 됩니다</span>
          <Button onClick={onClose}>닫기</Button>
        </div>,
      ]}
    >
      <div className="flex flex-col gap-1">
        <label htmlFor="optionKeyword" className="text-xs">
          옵션 키워드
        </label>
        <Input.Search
          id="optionKeyword"
          placeholder="옵션명을 입력해주세요"
          onSearch={onSearch}
          enterButton
          loading={isSearching}
          disabled={isSearching}
        />
      </div>

      {newOptions.length ? (
        <div id="keyword-search-result" className="mt-2">
          <div className="font-bold">
            <Row>
              <Col xs={8}>상품명</Col>
              <Col xs={8}>옵션명</Col>
              <Col xs={2}>옵션가</Col>
              <Col xs={2}>재고</Col>
              <Col xs={2}>사용여부</Col>
            </Row>
          </div>
          <div className="overflow-y-scroll max-h-[40vh]">
            {newOptions.map((option) => (
              <Row key={option.id} className="mb-1">
                <Col xs={8}>{option.productName}</Col>
                <Col xs={8}>
                  {option.optionName1} {'>'} {option.optionName2}
                </Col>
                <Col xs={2}>{new Intl.NumberFormat('ko-KR', { style: 'currency', currency: 'KRW' }).format(option.price)}</Col>
                <Col xs={2}>{option.stockQuantity}</Col>
                <Col xs={2}>
                  <Tag color={option.usable ? 'blue' : 'red'}>{option.usable ? '사용중' : '미사용'}</Tag>
                </Col>
              </Row>
            ))}
          </div>
          <Divider orientation="left">일괄수정</Divider>
          <div className="flex flex-col">
            <span className="text-[12px]">재고</span>
            <div className="flex gap-1">
              <Input className="!w-20" size="small" onChange={onChangePrice} />
              <Button
                type="primary"
                size="small"
                placeholder="0"
                disabled={optionQty === '' || Number(optionQty) < 0 || !Number.isInteger(Number(optionQty))}
                onClick={updateOption}
              >
                수정
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </Modal>
  )
}

export default OptionBatchModificationModal
