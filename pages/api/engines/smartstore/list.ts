// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import TpService, { GetTokenInfoParams } from '@/services/tp.service'
import type { NextApiRequest, NextApiResponse } from 'next'

type Data = {
  result: {
    token: string
    message: 'SUCCESS'
  }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  const tpService = new TpService()
  const token = await tpService.getTokenInfo(req.body as GetTokenInfoParams)

  res.status(200).json({
    result: {
      token,
      message: 'SUCCESS',
    },
  })
}