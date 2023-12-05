// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { getGroupAddressList, getTokenInfo } from '@/services/tp.service'
import { openGate } from '@/lib/cors'
import { ShopInfo } from 'interface/auth.interface'

type Data = {
  result: {
    list: string
    message: 'SUCCESS'
  }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  await openGate(req, res)
  if (req.method === 'POST') {
    const params = req.body as { shopInfo: ShopInfo }
    const sendToken = await getTokenInfo(params.shopInfo)
    const addressList = await getGroupAddressList(sendToken)

    console.log(addressList)

    res.status(200).json({
      result: {
        list: addressList,
        message: 'SUCCESS',
      },
    })
  }
}
