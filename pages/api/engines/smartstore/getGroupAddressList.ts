// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import TpService from '@/services/tp.service'

type Data = {
  result: {
    list: string
    message: 'SUCCESS'
  }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  const tpService = new TpService()
  const params = req.body
  console.log(params)
  const sendToken = await tpService.getTokenInfo(params.receive)
  const addressList = await tpService.getGroupAddressList(sendToken)

  console.log(addressList)

  res.status(200).json({
    result: {
      list: addressList,
      message: 'SUCCESS',
    },
  })
}
