import React, { useEffect, useState } from 'react'
import {
  Form,
  Input,
  InputNumber,
  Popconfirm,
  Table,
  Typography,
  Modal,
  Badge,
  Radio,
  notification,
  Button,
  Divider,
} from 'antd'
import { productV2 } from '@/lib/store/product'
import { useRecoilValue } from 'recoil'
import { common, permission, solution } from '@/lib/store/common'
import Image from 'next/image'
import axios from 'axios'
import { useRouter } from 'next/router'
import { OptionInfo, ProductSendErrors, ProductSendResult } from 'interface/smartstore.interface'
import { OptionModificationModal } from '@/components/engines/smartstore/OptionModificationModal'
import { usePermission } from '@/components/hooks/usePermission'
import ProductErrors from '@/components/ProductErrors'

interface Item {
  key: string
  statusType: string
  productName: string
  productNo: number
  productImg: string
  productLink: string
  productTag: string
  salePrice: number
  productQuantity: number
  productDiscountedPrice: number
  productCategory: string
  regDate: Date
  modifiedDate: Date
  productCoupon: {
    periodType: string
    periodDays: number
    publicInformationContents: string
    contactInformationContents: string
    usePlaceType: string
    usePlaceContents: string
    siteName: string
    restrictCart: boolean
  }
  productOption?: OptionInfo
}

interface EditableCellProps extends React.HTMLAttributes<HTMLElement> {
  editing: boolean
  dataIndex: string
  title: any
  inputType: 'number' | 'text'
  record: Item
  index: number
  children: React.ReactNode
}

const EditableCell: React.FC<EditableCellProps> = ({
  editing,
  dataIndex,
  title,
  inputType,
  record,
  index,
  children,
  ...restProps
}) => {
  const inputNode = inputType === 'number' ? <InputNumber /> : <Input />

  return (
    <td {...restProps}>
      {editing ? (
        <Form.Item
          name={dataIndex}
          style={{ margin: 0 }}
          rules={[
            {
              required: true,
              message: `Please Input ${title}!`,
            },
          ]}
        >
          {inputNode}
        </Form.Item>
      ) : (
        children
      )}
    </td>
  )
}

const App: React.FC = () => {
  const router = useRouter()
  useEffect(() => {
    if (!commonState.isLogin) {
      router.push('/')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const commonState = useRecoilValue(common)
  const productV2State = useRecoilValue(productV2)
  const solutionState = useRecoilValue(solution)
  const permissionState = useRecoilValue(permission)
  const { hasPermission } = usePermission(permissionState)

  const [api, contextHolder] = notification.useNotification()

  const [sendLoading, setSendLoading] = useState(false)
  const [isModalTagOpen, setIsModalTagOpen] = useState(false)
  const [isModalCouponOpen, setIsModalCouponOpen] = useState(false)
  const [isModalOptionOpen, setIsModalOptionOpen] = useState(false)
  const [isModalSendOpen, setIsModalSendOpen] = useState(false)
  const [optionInfoMutation, setOptionInfoMutation] = useState<OptionInfo>()
  const [selectedOptionParentKey, setSelectedOptionParentKey] = useState<string>('')
  const [batchEditTag, setBatchEditTag] = useState('')
  const [batchEditCoupon, setBatchEditCoupon] = useState({
    periodType: 'FLEXIBLE',
    periodDays: 0,
    publicInformationContents: '',
    contactInformationContents: '',
    usePlaceType: 'PLACE',
    usePlaceContents: '',
    siteName: '',
    restrictCart: true,
  })
  const [productErrors, setProductErrors] = useState<ProductSendErrors[]>([])
  const [sendData, setSendData] = useState<Item[]>([])
  const [form] = Form.useForm<Item>()
  const [data, setData] = useState<Item[]>(
    productV2State.smartstore.contents.map((x) => ({
      key: `${x.channelProducts[0].channelProductNo}`,
      productNo: x.channelProducts[0].channelProductNo,
      statusType: x.channelProducts[0].statusType,
      salePrice: x.channelProducts[0].salePrice,
      productName: x.channelProducts[0].name,
      productImg: x.channelProducts[0].representativeImage.url,
      productLink: `https://smartstore.naver.com/${commonState.loginShopId}/products/${x.channelProducts[0].channelProductNo}`,
      productTag: x.channelProducts[0].sellerTags?.map((x) => x.text).join(','),
      productCoupon: {
        periodType: 'FLEXIBLE',
        periodDays: 0,
        publicInformationContents: '',
        contactInformationContents: '',
        usePlaceType: 'PLACE',
        usePlaceContents: '',
        siteName: '',
        restrictCart: true,
      },
      productQuantity: x.channelProducts[0].stockQuantity,
      productDiscountedPrice: x.channelProducts[0].discountedPrice,
      productCategory: x.channelProducts[0].wholeCategoryName,
      regDate: x.channelProducts[0].regDate,
      modifiedDate: x.channelProducts[0].modifiedDate,
      productOption: x.detail?.originProduct.detailAttribute.optionInfo,
    })),
  )
  const [editingKey, setEditingKey] = useState('')

  const rowSelection = {
    onChange: (selectedRowKeys: React.Key[], selectedRows: Item[]) => {
      const updateData: Item[] = []

      for (const row of data) {
        for (const selectedRow of selectedRows) {
          if (row.productNo === selectedRow.productNo) {
            console.log(row)
            updateData.push(row)
          }
        }
      }
      setSendData(updateData)
    },
  }

  const isEditing = (record: Item) => record.key === editingKey

  const edit = (record: Partial<Item> & { key: React.Key }) => {
    form.setFieldsValue({ productName: '', productNo: 0, productImg: '', ...record })
    setEditingKey(record.key)
  }

  const cancel = () => {
    setEditingKey('')
  }

  const save = async (key: React.Key) => {
    try {
      const row = (await form.validateFields()) as Item

      const newData = [...data]
      const index = newData.findIndex((item) => key === item.key)
      if (index > -1) {
        const item = newData[index]
        newData.splice(index, 1, {
          ...item,
          ...row,
        })
        setData(newData)
        setEditingKey('')
      } else {
        newData.push(row)
        setData(newData)
        setEditingKey('')
      }
    } catch (errInfo) {
      console.log('Validate Failed:', errInfo)
    }
  }

  const columns = [
    {
      title: '상품번호',
      dataIndex: 'productNo',
      width: 100,
      dataType: 'number',
      fixed: 'left',
    },
    {
      title: '상태',
      dataIndex: 'statusType',
      width: 68,
      render: (text: string) => <Badge status="success" text={text === 'SALE' ? '판매중' : text} />,
    },
    {
      title: '등록일',
      dataIndex: 'regDate',
      width: 92,
      render: (text: string) => <span>{text.replace('T', ' ').split(' ')[0]}</span>,
    },
    {
      title: '수정일',
      dataIndex: 'modifiedDate',
      width: 92,
      render: (text: string) => <span>{text.replace('T', ' ').split(' ')[0]}</span>,
    },
    {
      title: '상품명',
      dataIndex: 'productName',
      width: 400,
      dataType: 'string',
    },
    {
      title: '카테고리',
      dataIndex: 'productCategory',
      width: 200,
      dataType: 'string',
    },
    {
      title: '가격',
      dataIndex: 'salePrice',
      width: 100,
      dataType: 'string',
      render: (text: number) => <p>{new Intl.NumberFormat('ko-KR', { style: 'currency', currency: 'KRW' }).format(text)}</p>,
    },
    {
      title: '세일 가격',
      dataIndex: 'productDiscountedPrice',
      width: 100,
      dataType: 'string',
      render: (text: number) => <p>{new Intl.NumberFormat('ko-KR', { style: 'currency', currency: 'KRW' }).format(text)}</p>,
    },
    {
      title: '재고',
      dataIndex: 'productQuantity',
      width: 60,
      dataType: 'string',
      render: (text: number) => <p>{text}</p>,
    },
    {
      title: '이미지',
      dataIndex: 'productImg',
      width: 60,
      dataType: 'string',
      render: (text: string, record: Item) => (
        <Image className="flex justify-center items-center" src={text} alt={record.productName} width={36} height={36}></Image>
      ),
    },
    {
      title: '태그',
      dataIndex: 'productTag',
      width: 400,
      dataType: 'string',
      editable: true,
      ellipsis: true,
      render: (text: string, record: Item) => <p>{record.productTag}</p>,
    },
    {
      title: '옵션',
      dataIndex: 'productOption',
      width: 128,
      dataType: 'string',
      render: (data: OptionInfo, record: Item) => {
        if (data && data.optionCombinations?.length) {
          return (
            <p className="flex gap-2">
              {data.optionCombinations.length}개 존재
              <Button type="primary" size="small" onClick={() => showModalOption(data, record.key)}>
                수정
              </Button>
            </p>
          )
        } else {
          return <p>옵션 없음</p>
        }
      },
    },
    {
      title: '작업',
      dataIndex: 'operation',
      width: 100,
      fixed: 'right',
      render: (_: any, record: Item) => {
        const editable = isEditing(record)
        return editable ? (
          <span>
            <Typography.Link onClick={() => save(record.key)} style={{ marginRight: 8 }}>
              Save
            </Typography.Link>
            <Popconfirm title="Sure to cancel?" onConfirm={cancel}>
              <a>Cancel</a>
            </Popconfirm>
          </span>
        ) : (
          <Typography.Link disabled={editingKey !== '' || !hasPermission('editTag')} onClick={() => edit(record)}>
            Edit
          </Typography.Link>
        )
      },
    },
  ]

  const mergedColumns = columns.map((col) => {
    if (!col.editable) {
      return col
    }
    return {
      ...col,
      onCell: (record: Item) => ({
        record,
        inputType: col.dataType,
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    }
  })

  const options = [
    { label: '즉시 구매만 가능', value: true },
    { label: '장바구니 사용', value: false },
  ]

  const showModalTag = () => {
    setIsModalTagOpen(true)
  }

  const handleOkTag = () => {
    const newData = data.map((x) => {
      if (sendData.length) {
        const find = sendData.find((p) => p.productNo === x.productNo)
        if (find) {
          return { ...x, productTag: batchEditTag }
        } else {
          return x
        }
      }

      return { ...x, productTag: batchEditTag }
    })
    const newSendData = sendData.map((x) => ({ ...x, productTag: batchEditTag }))
    setData(newData)
    setSendData(newSendData)
    setIsModalTagOpen(false)
  }

  const handleCancelTag = () => {
    setIsModalTagOpen(false)
  }

  const showModalCoupon = () => {
    setIsModalCouponOpen(true)
  }

  const handleOkCoupon = () => {
    const newData = data.map((x) => ({ ...x, productCoupon: batchEditCoupon }))
    const newSendData = sendData.map((x) => ({ ...x, productCoupon: batchEditCoupon }))

    setData(newData)
    setSendData(newSendData)
    setIsModalCouponOpen(false)
  }

  const handleCancelCoupon = () => {
    setIsModalCouponOpen(false)
  }

  const showModalOption = (optionInfo: OptionInfo, key: Item['key']) => {
    setIsModalOptionOpen(true)
    setOptionInfoMutation(optionInfo)
    setSelectedOptionParentKey(key)
  }

  const handleOkOption = (optionCombinations: OptionInfo['optionCombinations']) => {
    console.log(selectedOptionParentKey, optionCombinations)
    setIsModalOptionOpen(false)
    const newData = data.map((x) => {
      if (x.key === selectedOptionParentKey) {
        return { ...x, productOption: { ...x.productOption, optionCombinations } }
      } else {
        return x
      }
    })

    setData(newData)
    setSendData(newData)
    console.log('data update successfully')
  }

  const handleCancelOption = () => {
    setIsModalOptionOpen(false)
  }

  const handleOkSend = async () => {
    setSendLoading(true)
    const payload = {
      ...solutionState.shopInfo,
      permission: permissionState,
      productList: sendData,
      userInfo: solutionState.userInfo,
    }
    const result = await axios.post<ProductSendResult>('/engines/smartstore/productEditV2', payload)

    if (result?.data?.result.message === 'SUCCESS') {
      api.success({
        message: `수정이 완료되었습니다`,
        description: `총 ${result.data.result.total}개 | 성공 ${result.data.result.success} / 실패 ${result.data.result.fail}`,
      })

      if (result.data.result.fail > 0 && result.data.result.errors) {
        setProductErrors(result.data.result.errors)
      } else if (result.data.result.fail === 0) {
        setProductErrors([])
      }
    }

    setIsModalSendOpen(false)
    setSendLoading(false)
  }

  return (
    <div className="flex flex-col gap-2">
      <Form form={form} component={false}>
        {contextHolder}
        <div className="flex items-start justify-between gap-4 mb-2">
          <div>
            <Divider orientation="left" className="!my-1">
              일괄수정
            </Divider>
            <div className="flex flex-wrap items-center gap-1">
              <Button type="primary" size="small" onClick={showModalTag} disabled={!hasPermission('batchEditTag')}>
                태그
              </Button>
              <Button type="primary" size="small" onClick={showModalCoupon} disabled={!hasPermission('batchEditCoupon')}>
                쿠폰
              </Button>
              <Button type="primary" size="small" onClick={showModalCoupon} disabled={true}>
                가격
              </Button>
              <Button type="primary" size="small" onClick={showModalCoupon} disabled={true}>
                배송사
              </Button>
              <Button type="primary" size="small" onClick={showModalCoupon} disabled={true}>
                재고
              </Button>
              <Button type="primary" size="small" onClick={showModalCoupon} disabled={true}>
                원산지
              </Button>
              <Button type="primary" size="small" onClick={showModalCoupon} disabled={true}>
                할인/판매기간
              </Button>
              <Button type="primary" size="small" onClick={showModalCoupon} disabled={true}>
                브랜드/제조사
              </Button>
              <Button type="primary" size="small" onClick={showModalCoupon} disabled={true}>
                제조일자/유효일자
              </Button>
              <Button type="primary" size="small" onClick={showModalCoupon} disabled={true}>
                반품배송비/교환배송비
              </Button>
            </div>
          </div>
          <div className="mt-2">
            <Button disabled={sendData.length === 0} type="primary" onClick={() => setIsModalSendOpen(true)}>
              전송
            </Button>
          </div>
        </div>
        <Table
          components={{
            body: {
              cell: EditableCell,
            },
          }}
          bordered
          dataSource={data}
          columns={mergedColumns as any}
          rowClassName="editable-row"
          rowSelection={{
            type: 'checkbox',
            ...rowSelection,
          }}
          pagination={{
            onChange: cancel,
            pageSizeOptions: [10, 20, 50, 100, 250, 500],
          }}
          scroll={{ x: 1200, y: '50vw' }}
          sticky
        />
        <Modal title="상품 전송" open={isModalSendOpen} onOk={handleOkSend} onCancel={() => setIsModalSendOpen(false)}>
          <p className="text-stone-500">{sendData.length} 상품의 전송을 진행합니다</p>
          {hasPermission('batchEditTag') && (
            <div>
              <p className="text-lg mt-2">E쿠폰 정보</p>
              <p>E쿠폰 유효기간(구매일로부터 00일)</p>
              <InputNumber className="w-full" controls={false} value={batchEditCoupon.periodDays} placeholder="13" disabled />
              <p className="mt-2">E쿠폰 발행처</p>
              <Input className="w-full" value={batchEditCoupon.publicInformationContents} disabled />
              <p className="mt-2">E쿠폰 연락처</p>
              <Input className="w-full" value={batchEditCoupon.contactInformationContents} disabled />
              <p className="mt-2">사용 장소</p>
              <Input className="w-full" value={batchEditCoupon.usePlaceContents} disabled />
              <p className="mt-2">사이트명</p>
              <Input className="w-full" value={batchEditCoupon.siteName} disabled />
              <p className="mt-2">장바구니제한</p>
              <Radio.Group options={options} value={batchEditCoupon.restrictCart} disabled />
              <p className="mt-2">쿠폰정보 미입력 시 에러가 발생하며 연락처란에는 숫자 및 - 기호만 허용됩니다</p>
            </div>
          )}

          {sendLoading ? <p className="mt-2">전송 중 입니다. 잠시만 기다려 주세요...</p> : null}
        </Modal>
        <Modal title="일괄수정 태그" open={isModalTagOpen} onOk={handleOkTag} onCancel={handleCancelTag}>
          <Input onChange={(e) => setBatchEditTag(e.target.value)} placeholder="블랙,레드" />
          <p className="pt-1 text-stone-500">- 쉼표로 구분해주세요</p>
          <p className="pt-1 text-stone-500">- {sendData.length ? sendData.length : data.length}개 상품의 수정을 진행합니다</p>
        </Modal>
        <Modal title="일괄수정 쿠폰" open={isModalCouponOpen} onOk={handleOkCoupon} onCancel={handleCancelCoupon}>
          <p>E쿠폰 유효기간(구매일로부터 00일)</p>
          <InputNumber
            className="w-full"
            controls={false}
            onChange={(value) => setBatchEditCoupon({ ...batchEditCoupon, periodDays: value as number })}
            value={batchEditCoupon.periodDays}
            placeholder="13"
          />
          <p className="mt-2">E쿠폰 발행처</p>
          <Input
            className="w-full"
            onChange={(e) => setBatchEditCoupon({ ...batchEditCoupon, publicInformationContents: e.target.value })}
            value={batchEditCoupon.publicInformationContents}
          />
          <p className="mt-2">E쿠폰 연락처</p>
          <Input
            className="w-full"
            onChange={(e) => setBatchEditCoupon({ ...batchEditCoupon, contactInformationContents: e.target.value })}
            value={batchEditCoupon.contactInformationContents}
          />
          <p className="mt-2">사용 장소</p>
          <Input
            className="w-full"
            onChange={(e) => setBatchEditCoupon({ ...batchEditCoupon, usePlaceContents: e.target.value })}
            value={batchEditCoupon.usePlaceContents}
          />
          <p className="mt-2">사이트명</p>
          <Input
            className="w-full"
            onChange={(e) => setBatchEditCoupon({ ...batchEditCoupon, siteName: e.target.value })}
            value={batchEditCoupon.siteName}
          />
          <p className="mt-2">장바구니제한</p>
          <Radio.Group
            options={options}
            value={batchEditCoupon.restrictCart}
            onChange={(e) => setBatchEditCoupon({ ...batchEditCoupon, restrictCart: e.target.value })}
          />
          <p className="pt-2 text-stone-500">- {data.length}개 상품의 수정을 진행합니다</p>
        </Modal>
        {optionInfoMutation && (
          <OptionModificationModal
            open={isModalOptionOpen}
            onOk={handleOkOption}
            onCancel={handleCancelOption}
            optionInfo={optionInfoMutation as OptionInfo}
          />
        )}
      </Form>
      {Object.keys(productErrors).length ? <ProductErrors productErrors={productErrors} /> : null}
    </div>
  )
}

export default App
