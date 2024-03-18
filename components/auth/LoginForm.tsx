import React, { useEffect, useState } from 'react'
import { Button, Checkbox, Form, Input } from 'antd'
import axios from 'axios'
import { GetTokenInfoParams } from '@/services/tp.service'
import { useRecoilState, useSetRecoilState } from 'recoil'
import { ProductNotificationValue, common, productNotification, solution } from '@/lib/store/common'
import { useRouter } from 'next/router'
import styles from '@/styles/Home.module.css'
import { LoginFieldType, LoginInfo, LoginResult } from 'interface/auth.interface'
import { AddressBookList, AddressGroupList } from 'interface/smartstore.interface'
import Pusher from 'pusher-js'

const onFinishFailed = (errorInfo: any) => {
  console.log('Failed:', errorInfo)
}

const LoginForm: React.FC = () => {
  const [form] = Form.useForm()
  const [loginInfoSave, setLoginInfoSave] = useState(false)
  const [commonState, setCommonState] = useRecoilState(common)
  const [solutionState, setSolutionState] = useRecoilState(solution)
  const setProductNotification = useSetRecoilState(productNotification)
  const router = useRouter()

  useEffect(() => {
    const loginInfo = localStorage.getItem('loginInfo')

    if (loginInfo) {
      form.setFieldsValue(JSON.parse(loginInfo) as LoginInfo)
      setLoginInfoSave(true)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

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
    const pusher = new Pusher('a5d2ded0be04d3d9806e', {
      cluster: 'ap3',
    })
    const channel = pusher.subscribe('indicator-' + info.userInfo.user_no)
    channel.bind('message', (data: ProductNotificationValue) => {
      setProductNotification({
        isShow: true,
        title: data.title,
        success: data.success,
        fail: data.fail,
        total: data.total,
      })
    })

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

    if (loginInfoSave) {
      localStorage.setItem('loginInfo', JSON.stringify(values))
    } else {
      localStorage.removeItem('loginInfo')
    }

    router.push('/shop/list')
  }

  return (
    <div className={styles.loginForm + ' flex flex-col bg-white/80 relative'}>
      <h1 className="pb-4 text-xl">Minerva Login</h1>
      <Form
        form={form}
        name="basic"
        labelCol={{ span: 5 }}
        wrapperCol={{ span: 19 }}
        style={{ maxWidth: 500, width: '100%' }}
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
        <div className="flex justify-end items-start gap-2">
          <div className="flex gap-2">
            <span>로그인 정보 저장</span>
            <Checkbox checked={loginInfoSave} onChange={(e) => setLoginInfoSave(e.target.checked)} />
          </div>
          <Form.Item className="flex justify-end">
            <Button type="primary" htmlType="submit">
              Login
            </Button>
          </Form.Item>
        </div>
      </Form>
    </div>
  )
}

export default LoginForm
