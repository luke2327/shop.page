import { Divider, List } from 'antd'
import { ProductSendErrors } from 'interface/smartstore.interface'

export default function ProductErrors({ productErrors }: { productErrors: ProductSendErrors[] }) {
  return (
    <>
      <Divider orientation="left" plain className="!mb-0">
        에러 목록
      </Divider>
      <List
        className="max-h-[300px] overflow-y-scroll"
        itemLayout="horizontal"
        dataSource={productErrors}
        renderItem={(item, index) => (
          <List.Item>
            <List.Item.Meta
              title={
                <a href="">
                  {index + 1}. 상품번호 {item.productNo}
                </a>
              }
              description={item.errorList.map((error, index) => (
                <div key={index} className="pl-3.5 flex flex-col sm:flex-row">
                  <span className="font-medium text-black pr-1">{error.type}</span>
                  <div className="flex gap-1 flex-col md:flex-row">
                    <span className="text-black">[{error.name}]</span>
                    <span>{error.message}</span>
                  </div>
                </div>
              ))}
            />
          </List.Item>
        )}
      />
    </>
  )
}
