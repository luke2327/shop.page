// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { openGate } from '@/lib/cors'
import { getTokenInfo } from '@/services/tp.service'

type Data = {
  // result: {
  //   list: string
  //   message: 'SUCCESS'
  // }
  name: any
}

export default async function POST(req: NextApiRequest, res: NextApiResponse<Data>) {
  await openGate(req, res)
  if (req.method === 'POST') {
    res.status(200).json({ name: req.body })
    // console.log('-------------------------')
    // console.log(req.body)
    // console.log('-------------------------')
    const params = req.body
    const sendToken = await getTokenInfo(params.receive)
    // console.log(sendToken)
    // const addressList = await getAddressList(sendToken)
    //
    // res.status(200).json({
    //   result: {
    //     list: addressList,
    //     message: 'SUCCESS',
    //   },
    // })
  }
}
