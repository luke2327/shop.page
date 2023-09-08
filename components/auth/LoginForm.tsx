import React from 'react'
import { Button, Form, Input } from 'antd'
import axios from 'axios'
import { GetTokenInfoParams } from '@/services/tp.service'
import { useRecoilState } from 'recoil'
import { common, solution } from '@/lib/store/common'
import { useRouter } from 'next/router'
import styles from '@/styles/Home.module.css'

const onFinishFailed = (errorInfo: any) => {
  console.log('Failed:', errorInfo)
}

type FieldType = {
  email?: string
  shopId?: string
  password?: string
  remember?: string
}
type AddressBookList = {
  address: string
  addressBookNo: number
  addressType: string
  baseAddress: string
  detailAddress: string
  name: string
  phoneNumber1: string
  phoneNumber2: string
  postalCode: string
  roadNameAddress: boolean
}[]
type AddressGroupList = {
  id: number
  name: string
  usable: boolean
  baseGroup: boolean
  deliveryFeeChargeMethodType: 'MIN'
}[]

const LoginForm: React.FC = () => {
  const [commonState, setCommonState] = useRecoilState(common)
  const [solutionState, setSolutionState] = useRecoilState(solution)
  const router = useRouter()

  const getInfo = async (values: GetTokenInfoParams & { shopId: string }) => {
    return await axios
      .post<{ result: { userInfo: any; shopInfo: any; message: 'SUCCESS' } }>(
        'https://shop-page-beta.vercel.app/api/auth/login',
        values,
      )
      .then(({ data }) => {
        if (data.result.message === 'SUCCESS') {
          setCommonState({
            ...commonState,
            isLogin: true,
            step: 2,
            loginShopId: values.shopId,
          })

          return {
            userInfo: data.result.userInfo,
            shopInfo: data.result.shopInfo,
          }
        } else {
          throw 'NO TOKEN'
        }
      })
      .catch((e) => {
        console.log(e)
      })
  }

  const onFinish = async (values: GetTokenInfoParams & { shopId: string }) => {
    const info: any = await getInfo(values)
    const send = info.shopInfo.filter((x: any) => x.type === 'send')[0]
    const receive = info.shopInfo.filter((x: any) => x.type === 'receive')[0]

    const url = 'https://shop-page-beta.vercel.app/api/engines/smartstore/getAddressBookList'
    const response = (await axios.post(url, { receive: receive }).then(({ data }) => data.result)) as {
      list: {
        addressBooks: AddressBookList
      }
    }

    const urlGroup = 'https://shop-page-beta.vercel.app/api/engines/smartstore/getGroupAddressList'
    const responseGroup = (await axios.post(urlGroup, { receive: receive }).then(({ data }) => data.result)) as {
      list: {
        contents: AddressGroupList
      }
    }

    if (response && responseGroup) {
      setSolutionState({
        ...solutionState,
        userInfo: info.userInfo,
        shopInfo: info.shopInfo,
        send: {
          sol_shop_no: send.sol_shop_no,
          client_key: send.client_key,
          client_secret_key: send.client_secret_key,
        },
        receive: {
          sol_shop_no: receive.sol_shop_no,
          client_key: receive.client_key,
          client_secret_key: receive.client_secret_key,
        },
        shippingAddressList: response.list.addressBooks.filter((x) => x.addressType === 'RELEASE'),
        returnAddressList: response.list.addressBooks.filter((x) => x.addressType === 'REFUND_OR_EXCHANGE'),
        groupAddressList: responseGroup.list.contents,
        shippingAddress: response.list.addressBooks.filter((x) => x.addressType === 'RELEASE')[0],
        returnAddress: response.list.addressBooks.filter((x) => x.addressType === 'REFUND_OR_EXCHANGE')[0],
        groupAddress: responseGroup.list.contents[0],
      })

      console.log(solutionState)
    }

    router.push('/product/excelUpload')
  }

  return (
    <div className={styles.loginForm}>
      <Form
        name="basic"
        labelCol={{ span: 5 }}
        wrapperCol={{ span: 19 }}
        style={{ maxWidth: 500, width: '100%' }}
        initialValues={{ remember: true }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
      >
        <Form.Item<FieldType>
          label="Smartstore"
          name="shopId"
          rules={[{ required: true, message: 'Please input your Smartstore shop ID!' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item<FieldType> label="Email" name="email" rules={[{ required: true, message: 'Please input your clientKey!' }]}>
          <Input />
        </Form.Item>

        <Form.Item<FieldType>
          label="Password"
          name="password"
          rules={[{ required: true, message: 'Please input your clientSecretKey!' }]}
        >
          <Input.Password />
        </Form.Item>

        {/* <Form.Item<FieldType> name="remember" valuePropName="checked" wrapperCol={{ offset: 8, span: 16 }}>
      <Checkbox>Remember me</Checkbox>
    </Form.Item> */}

        <Form.Item wrapperCol={{ offset: 5, span: 19 }}>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
    </div>
  )
}

export default LoginForm
