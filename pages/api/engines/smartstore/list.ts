// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { getTokenInfo, GetTokenInfoParams } from '@/services/tp.service'
import type { NextApiRequest, NextApiResponse } from 'next'
import { openGate } from '@/lib/cors'

type Data = {
  result: {
    token: string
    message: 'SUCCESS'
  }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  await openGate(req, res)
  if (req.method === 'POST') {
    const token = await getTokenInfo(req.body as GetTokenInfoParams)

    res.status(200).json({
      result: {
        token,
        message: 'SUCCESS',
      },
    })
  }
}
