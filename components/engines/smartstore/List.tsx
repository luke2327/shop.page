import React, { useMemo, useState } from 'react'
import { Divider, Table, Button } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import Image from 'next/image'
import ProductModal from '@/components/engines/Modal'
import { useWindowSize } from '@uidotdev/usehooks'

export interface SmartstoreCsvDataMap {
  key: React.Key
  product_link: string
  product_code: string
  manage_code: string
  channel_name: string
  is_payed: string
  product_name: string
  channel_product_name: string
  window_product_name: string
  sale_status: string
  display_status: string
  stock: string
  sale_price: string
  discount_price_pc: string
  seller_discount_price_pc: string
  seller_direct_discount_pc: string
  discount_price_mobile: string
  seller_discount_price_mobile: string
  seller_direct_discount_mobile: string
  use_option: string
  use_additional_product: string
  use_product_properties: string
  min_purchase_cnt: string
  max_purchase_count: string
  multiple_purchase_discount_price: string
  point_purchase: string
  point_purchase_admin: string
  point_text_review: string
  point_media_review: string
  point_monthly_text_review: string
  point_monthly_media_review: string
  point_alarm_review: string
  free_installment_interest_duration: string
  gift: string
  fulfillment: string
  delivery_attribute_type: string
  delivery_standard_send_time: string
  is_bundle: string
  is_delivery_fee_type: string
  delivery_fee_pay_type: string
  delivery_fee: string
  return_delivery_fee: string
  exchange_delivery_fee: string
  use_return_delivery_exclusive_service: string
  use_upload_smartstore: string
  use_upload_window: string
  category_a: string
  category_b: string
  category_c: string
  category_d: string
  manufacture_name: string
  brand_name: string
  brand_id: string
  model_name: string
  brand_authorized: string
  is_handmade: string
  is_requestmade: string
  certification_info: string
  seller_barcode: string
  seller_managecode1: string
  seller_managecode2: string
  main_img_url: string
  sale_start_date: string
  sale_end_date: string
  mobile_preview_created_at: string
  product_registred_at: string
  product_editied_at: string
  subscribe_type: string
}

const columns: ColumnsType<SmartstoreCsvDataMap> = [
  {
    title: '상품코드',
    dataIndex: 'product_code',
    render: (text: string, record) => <a href={record.product_link}>{text}</a>,
    width: 120,
    fixed: 'left',
  },
  {
    title: '상품명',
    dataIndex: 'product_name',
    width: 400,
  },
  {
    title: '이미지',
    dataIndex: 'main_img_url',
    render: (text: string, record) => <Image src={text} alt={record.product_name} width={40} height={40}></Image>,
    width: 100,
  },
  {
    title: '상품상태',
    dataIndex: 'sale_status',
    width: 100,
  },
  {
    title: '상품가격',
    dataIndex: 'sale_price',
    width: 100,
  },
  {
    title: '할인가',
    dataIndex: 'discount_price_pc',
    width: 100,
  },
  {
    title: '배송유형',
    dataIndex: 'delivery_attribute_type',
    width: 100,
  },
  {
    title: '카테고리',
    dataIndex: 'category_a',
    width: 400,
    render: (text: string, record) => (
      <p>
        {text}
        {' > '}
        {record.category_b}
        {' > '}
        {record.category_c}
        {' > '}
        {record.category_d}
      </p>
    ),
  },
  {
    title: '제조사 / 브랜드',
    dataIndex: 'manufacture_name',
    render: (text: string, record) => (
      <p>
        {text}
        {' / '}
        {record.brand_name}
      </p>
    ),
  },
]

// rowSelection object indicates the need for row selection

type IListProps = {
  data: SmartstoreCsvDataMap[]
}

const List: React.FC<IListProps> = (params) => {
  const [modal, setModal] = useState(false)
  const data = useMemo(() => params.data, [params.data])
  const [selectedData, setSelectedData] = useState<SmartstoreCsvDataMap[]>([])
  const size = useWindowSize() as { width: number; height: number }
  const rowSelection = {
    onChange: (selectedRowKeys: React.Key[], selectedRows: SmartstoreCsvDataMap[]) => {
      setSelectedData(selectedRows)
    },
    getCheckboxProps: (record: SmartstoreCsvDataMap) => ({
      disabled: record.product_name === 'Disabled User', // Column configuration not to be checked
      name: record.product_name,
    }),
  }

  return (
    <div>
      <div className={'flex justify-end'}>
        <Button disabled={!selectedData.length} type={'primary'} onClick={() => setModal(true)}>
          Migrate
        </Button>
      </div>
      <Divider />
      <Table
        rowSelection={{
          ...rowSelection,
        }}
        columns={columns}
        dataSource={data}
        pagination={{ pageSize: 50 }}
        scroll={{ y: size.height - 240, x: 1640 }}
      />
      {modal && <ProductModal handleModal={(x) => setModal(x)} modalOpen={modal} selectedRows={selectedData} />}
    </div>
  )
}

export default List
