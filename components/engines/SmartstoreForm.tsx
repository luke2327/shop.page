import React from 'react'
import { Button, Form, Input } from 'antd'
import axios from 'axios'
import { GetTokenInfoParams } from '@/services/tp.service'
import { useRecoilState } from 'recoil'
import { common } from '@/lib/store/common'
import { useRouter } from 'next/router'

const onFinishFailed = (errorInfo: any) => {
  console.log('Failed:', errorInfo)
}

type FieldType = {
  clientKey?: string
  clientSecretKey?: string
  remember?: string
}

const SmartstoreForm: React.FC = () => {
  const [commonState, setCommonState] = useRecoilState(common)
  const router = useRouter()

  const onFinish = async (values: GetTokenInfoParams) => {
    await axios
      .post<{ result: { token: string; message: 'SUCCESS' } }>('/engines/smartstore/list', values)
      .then(async ({ data }) => {
        if (data.result.message === 'SUCCESS') {
          return await axios.post('/engines/smartstore/getChannelInfo', { token: data.result.token }).then(({ data }) => data)
        } else {
          throw 'NO TOKEN'
        }
      })
      .then((channelInfo) => {
        console.log(channelInfo)

        setCommonState({
          ...commonState,
          step: 2,
        })

        router.push('/product/excelUpload')
      })
      .catch((e) => {
        console.log(e)
      })
  }

  return (
    <Form
      name="basic"
      labelCol={{ span: 8 }}
      wrapperCol={{ span: 16 }}
      style={{ maxWidth: 1000, width: '50%' }}
      initialValues={{ remember: true }}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      autoComplete="off"
    >
      <Form.Item<FieldType>
        label="Client key"
        name="clientKey"
        rules={[{ required: true, message: 'Please input your clientKey!' }]}
      >
        <Input />
      </Form.Item>

      <Form.Item<FieldType>
        label="Client Secret key"
        name="clientSecretKey"
        rules={[{ required: true, message: 'Please input your clientSecretKey!' }]}
      >
        <Input.Password />
      </Form.Item>

      {/* <Form.Item<FieldType> name="remember" valuePropName="checked" wrapperCol={{ offset: 8, span: 16 }}>
      <Checkbox>Remember me</Checkbox>
    </Form.Item> */}

      <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </Form.Item>
    </Form>
  )
}

export default SmartstoreForm
