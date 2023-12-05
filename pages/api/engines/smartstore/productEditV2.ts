// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { openGate } from '@/lib/cors'
import { getTokenInfo, productDetail, productEdit } from '@/services/tp.service'

type Data = {
  result: {
    message: 'SUCCESS'
  }
}

export const config = { api: { bodyParser: { sizeLimit: '25mb' } } }

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  await openGate(req, res)
  if (req.method === 'POST') {
    const match = []
    const params = req.body
    const token = await getTokenInfo(params)

    for (const product of params.productList) {
      const data = await productDetail(token, product.productNo)

      data.originProduct.detailAttribute.ecoupon = product.productCoupon
      data.originProduct.detailAttribute.seoInfo = {
        sellerTags: product.productTag.split(',').map((text: string) => ({ text: text.trim() })),
      }

      const body = {
        originProduct: {
          statusType: data.originProduct.statusType,
          name: data.originProduct.name,
          images: data.originProduct.images,
          salePrice: data.originProduct.salePrice,
          detailAttribute: {
            afterServiceInfo: data.originProduct.detailAttribute.afterServiceInfo,
            originAreaInfo: data.originProduct.detailAttribute.originAreaInfo,
            minorPurchasable: data.originProduct.detailAttribute.minorPurchasable,
            ecoupon: product.productCoupon,
            seoInfo: {
              sellerTags: product.productTag.split(',').map((text: string) => ({ text: text.trim() })),
            },
          },
        },
        smartstoreChannelProduct: data.smartstoreChannelProduct,
      }

      console.log(body.originProduct.detailAttribute)

      const payload = { productNo: product.productNo, body }

      await productEdit(token, payload)
    }
  }

  res.status(200).json({
    result: {
      message: 'SUCCESS',
    },
  })
}
