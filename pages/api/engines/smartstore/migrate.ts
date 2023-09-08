// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { callProducts, getTokenInfo, productSearchList } from '@/services/tp.service'
import { openGate } from '@/lib/cors'

type Data = {
  result: {
    resultData: any
    message: 'SUCCESS'
  }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  await openGate(req, res)
  if (req.method === 'POST') {
    const params = req.body

    const { list } = await productSearchList(params)

    const receiveToken = await getTokenInfo(params.receive)
    const resultData = []

    for (const data of list) {
      data.originProduct.detailAttribute.optionInfo.optionSimple =
        data.originProduct.detailAttribute.optionInfo.optionSimple.map((x: any) => ({
          groupName: x.groupName,
          name: x.name,
          usable: x.usable,
        }))

      data.originProduct.deliveryInfo.claimDeliveryInfo.shippingAddressId = params.shippingAddress.addressBookNo
      data.originProduct.deliveryInfo.claimDeliveryInfo.returnAddressId = params.returnAddress.addressBookNo
      data.originProduct.deliveryInfo.deliveryBundleGroupId = params.groupAddress.id

      const response = await callProducts(data, receiveToken, 'regist')

      console.log('----------------')
      console.log(response)
      resultData.push(response)
      console.log('----------------')
    }

    res.status(200).json({
      result: {
        resultData,
        message: 'SUCCESS',
      },
    })
  }
}
