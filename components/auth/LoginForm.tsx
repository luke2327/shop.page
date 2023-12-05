import React from 'react'
import { Button, Form, Input } from 'antd'
import axios from 'axios'
import { GetTokenInfoParams } from '@/services/tp.service'
import { useRecoilState } from 'recoil'
import { common, solution } from '@/lib/store/common'
import { useRouter } from 'next/router'
import styles from '@/styles/Home.module.css'
import { LoginFieldType, LoginResult } from 'interface/auth.interface'
import { AddressBookList, AddressGroupList } from 'interface/smartstore.interface'

const onFinishFailed = (errorInfo: any) => {
  console.log('Failed:', errorInfo)
}

const LoginForm: React.FC = () => {
  const [commonState, setCommonState] = useRecoilState(common)
  const [solutionState, setSolutionState] = useRecoilState(solution)
  const router = useRouter()

  const getInfo = async (values: GetTokenInfoParams & { shopId: string }) => {
    return await axios
      .post<LoginResult>('/auth/login', values)
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
        throw e.message
      })
  }

  const onFinish = async (values: GetTokenInfoParams & { shopId: string }) => {
    const info = await getInfo(values)
    const response = (await axios
      .post('/engines/smartstore/getAddressBookList', { shopInfo: info.shopInfo })
      .then(({ data }) => data.result)) as {
      list: {
        addressBooks: AddressBookList
      }
    }

    const urlGroup = '/engines/smartstore/getGroupAddressList'
    const responseGroup = (await axios.post(urlGroup, { shopInfo: info.shopInfo }).then(({ data }) => data.result)) as {
      list: {
        contents: AddressGroupList
      }
    }

    if (response && responseGroup) {
      setSolutionState({
        ...solutionState,
        userInfo: info.userInfo,
        shopInfo: info.shopInfo,
        shippingAddressList: response.list.addressBooks.filter((x) => x.addressType === 'RELEASE'),
        returnAddressList: response.list.addressBooks.filter((x) => x.addressType === 'REFUND_OR_EXCHANGE'),
        groupAddressList: responseGroup.list.contents,
        shippingAddress: response.list.addressBooks.filter((x) => x.addressType === 'RELEASE')[0],
        returnAddress: response.list.addressBooks.filter((x) => x.addressType === 'REFUND_OR_EXCHANGE')[0],
        groupAddress: responseGroup.list.contents[0],
      })
    }

    // router.push('/product/excelUpload')

    console.log('go to shoplist')
    router.push('/shop/list')
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
        {/* <Form.Item<LoginFieldType>
          label="Smartstore"
          name="shopId"
          rules={[{ required: true, message: 'Please input your Smartstore shop ID!' }]}
        >
          <Input defaultValue={'info@malihua.jp'} />
        </Form.Item> */}
        <Form.Item<LoginFieldType>
          label="Email"
          name="email"
          rules={[{ required: true, message: 'Please input your clientKey!' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item<LoginFieldType>
          label="Password"
          name="password"
          rules={[{ required: true, message: 'Please input your clientSecretKey!' }]}
        >
          <Input.Password />
        </Form.Item>
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
