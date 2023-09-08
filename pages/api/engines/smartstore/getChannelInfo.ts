// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import TpService from '@/services/tp.service'
import type { NextApiRequest, NextApiResponse } from 'next'
import { openGate } from '@/lib/cors'

type Data = {
  result: {
    data: [{ channelNo: number; channelType: string; name: string }]
    message: 'SUCCESS'
  }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  await openGate(req, res)
  const tpService = new TpService()
  const response = await tpService.getChannelInfo(req.body)

  res.status(200).json({
    result: {
      data: response,
      message: 'SUCCESS',
    },
  })
}
