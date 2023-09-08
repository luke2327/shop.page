import React from 'react'
import { InboxOutlined } from '@ant-design/icons'
import type { UploadProps } from 'antd'
import { message, Upload } from 'antd'
import Papa from 'papaparse'
import { product } from '@/lib/store/product'
import { useRecoilState } from 'recoil'
import { common } from '@/lib/store/common'
import { useRouter } from 'next/router'
import { SmartstoreCsvDataMap } from './engines/smartstore/List'

const { Dragger } = Upload

const props: UploadProps = {
  name: 'file',
  multiple: false,
  accept: 'csv',
  onChange(info) {
    const { status } = info.file
    if (status !== 'uploading') {
      console.log(info.file, info.fileList)
    }
    console.log(info.fileList)
    if (status === 'done') {
      message.success(`${info.file.name} file uploaded successfully.`)
    } else if (status === 'error') {
      message.error(`${info.file.name} file upload failed.`)
    }
  },

  onDrop(e) {
    console.log('Dropped files', e.dataTransfer.files)
  },
}

const FileUpload: React.FC = () => {
  const [productState, setProductState] = useRecoilState(product)
  const [commonState, setCommonState] = useRecoilState(common)
  const router = useRouter()

  return (
    <>
      <Dragger
        {...props}
        beforeUpload={(file) => {
          Papa.parse(file, {
            complete: function (results: { data: SmartstoreCsvDataMap[] }) {
              setProductState({
                uploadExcelData: results.data.map((x) => ({
                  ...x,
                  product_link: `https://smartstore.naver.com/${commonState.loginShopId}/products/${x.product_code}`,
                  key: x.product_code,
                })),
              })
              setCommonState({
                ...commonState,
                step: 3,
              })
              router.push('/product/list')
            },
            header: true,
          })

          // Prevent upload
          return false
        }}
      >
        <p className="ant-upload-drag-icon">
          <InboxOutlined />
        </p>
        <p className="ant-upload-text">Click or drag file to this area to upload</p>
        <p className="ant-upload-hint">
          Support for a single or bulk upload. Strictly prohibited from uploading company data or other banned files.
        </p>
      </Dragger>
    </>
  )
}

export default FileUpload
