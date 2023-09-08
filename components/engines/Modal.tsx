import React, { useEffect, useState } from 'react'
import { Col, Divider, Modal, Row, Select, Typography } from 'antd'
import { SmartstoreCsvDataMap } from '@/components/engines/smartstore/List'
import { useRecoilValue } from 'recoil'
import { solution } from '@/lib/store/common'
import axios from 'axios'
import { ArrowRightOutlined } from '@ant-design/icons'

type IProductModalProps = {
  handleModal: (x: boolean) => void
  modalOpen: boolean
  selectedRows: SmartstoreCsvDataMap[]
}

const ProductModal: React.FC<IProductModalProps> = (params) => {
  const solutionState = useRecoilValue(solution)
  const [payload, setPayload] = useState<any>({
    solShopNo: null,
    clientKey: null,
    clientSecretKey: null,
    selectedRows: [],
    send: solutionState.send,
    receive: solutionState.receive,
    shippingAddress: solutionState.shippingAddress,
    returnAddress: solutionState.returnAddress,
    groupAddress: solutionState.groupAddress,
  })

  useEffect(() => {
    setPayload({
      solShopNo: solutionState.shopInfo[0].sol_shop_no,
      clientKey: solutionState.shopInfo[0].client_key,
      clientSecretKey: solutionState.shopInfo[0].client_secret_key,
      selectedRows: params.selectedRows,
      send: solutionState.send,
      receive: solutionState.receive,
      shippingAddress: solutionState.shippingAddress,
      returnAddress: solutionState.returnAddress,
      groupAddress: solutionState.groupAddress,
    })
    console.log(1)
  }, [
    params.selectedRows,
    solutionState.groupAddress,
    solutionState.receive,
    solutionState.returnAddress,
    solutionState.send,
    solutionState.shippingAddress,
    solutionState.shopInfo,
  ])
  const onChangeSend = (value: string) => {
    const shop = solutionState.shopInfo.find((shop: any) => shop.sol_shop_no === value)

    setPayload({
      ...payload,
      send: {
        solShopNo: shop.sol_shop_no,
        clientKey: shop.client_key,
        clientSecretKey: shop.client_secret_key,
      },
    })
  }

  const onChangeReceive = (value: string) => {
    const shop = solutionState.shopInfo.find((shop: any) => shop.sol_shop_no === value)

    setPayload({
      ...payload,
      receive: {
        solShopNo: shop.sol_shop_no,
        clientKey: shop.client_key,
        clientSecretKey: shop.client_secret_key,
      },
    })
  }

  const onOk = async () => {
    const url = 'http://localhost:4001/api/engines/smartstore/migrate'

    await axios.post(url, payload)
  }

  return (
    <Modal
      title="상품 전송"
      width={'80%'}
      centered
      open={params.modalOpen}
      onOk={onOk}
      okText={'Migrate'}
      onCancel={() => params.handleModal(false)}
    >
      <p className={'mb-2'}>Selected Data {params.selectedRows.length}</p>
      <Divider orientation="left">배송 설정</Divider>
      <Row className={'flex'}>
        <Col xs={24} sm={12} md={12} lg={8}>
          <div className={'flex gap-4 items-center'}>
            <Typography>출고지</Typography>
            <Select
              defaultValue={payload.shippingAddress?.addressBookNo}
              options={solutionState.shippingAddressList.map((x: any) => ({
                value: x.addressBookNo,
                label: x.name,
              }))}
            ></Select>
          </div>
          <div className={'flex flex-col gap-1'}>
            <Typography>{payload.shippingAddress?.address}</Typography>
            <Typography>{payload.shippingAddress?.phoneNumber1}</Typography>
          </div>
        </Col>
        <Col xs={24} sm={12} md={12} lg={8}>
          <div className={'flex gap-4 items-center'}>
            <Typography>반품지</Typography>
            <Select
              defaultValue={payload.returnAddress?.addressBookNo}
              options={solutionState.returnAddressList.map((x: any) => ({
                value: x.addressBookNo,
                label: x.name,
              }))}
            ></Select>
          </div>
          <div className={'flex flex-col gap-1'}>
            <Typography>{payload.returnAddress?.address}</Typography>
            <Typography>{payload.returnAddress?.phoneNumber1}</Typography>
          </div>
        </Col>
        <Col xs={24} sm={12} md={12} lg={8}>
          <div className={'flex gap-4 items-center'}>
            <Typography>그룹배송지</Typography>
            <Select
              defaultValue={payload.groupAddress?.id}
              options={solutionState.groupAddressList.map((x: any) => ({
                value: x.id,
                label: x.name,
              }))}
            ></Select>
          </div>
          <div className={'flex flex-col gap-1'}>
            <Typography>{payload.groupAddress?.name}</Typography>
          </div>
        </Col>
      </Row>
      <Divider orientation="left">계정 설정</Divider>
      <div>
        <Select
          defaultValue={payload.send?.sol_shop_no}
          onChange={onChangeSend}
          options={solutionState.shopInfo
            .filter((shop: any) => shop.type === 'send')
            .map((shop: any) => ({
              value: shop.sol_shop_no,
              label: `${shop.shop_disp_id}(${shop.shop_id})`,
            }))}
        />
        <ArrowRightOutlined className={'px-4'} />
        <Select
          defaultValue={payload.receive?.sol_shop_no}
          onChange={onChangeReceive}
          options={solutionState.shopInfo
            .filter((shop: any) => shop.type === 'receive')
            .map((shop: any) => ({
              value: shop.sol_shop_no,
              label: `${shop.shop_disp_id}(${shop.shop_id})`,
            }))}
        />
      </div>
    </Modal>
  )
}

export default ProductModal
