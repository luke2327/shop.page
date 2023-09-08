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
  console.log('-------------------------')
  console.log(req.body)
  console.log('-------------------------')
  const tpService = new TpService()
  const params = req.body
  const sendToken = await tpService.getTokenInfo(params.receive)
  console.log(sendToken)
  const addressList = await tpService.getAddressList(sendToken)

  res.status(200).json({
    result: {
      list: addressList,
      message: 'SUCCESS',
    },
  })
}
