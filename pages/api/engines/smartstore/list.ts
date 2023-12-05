// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { getTokenInfo, GetTokenInfoParams, productSearchListV2 } from '@/services/tp.service'
import type { NextApiRequest, NextApiResponse } from 'next'
import { openGate } from '@/lib/cors'
import { V2List } from 'interface/smartstore.interface'

export type V2Data = {
  result: {
    token: string
    message: 'SUCCESS'
    list: V2List
  }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<V2Data>) {
  await openGate(req, res)
  if (req.method === 'POST') {
    const params = req.body as GetTokenInfoParams & {
      prodCodeList: number[]
    }
    const token = await getTokenInfo(params)
    console.log('토큰정보', token)
    const list = await productSearchListV2(token, params.prodCodeList)

    res.status(200).json({
      result: {
        token,
        message: 'SUCCESS',
        list,
      },
    })
  }
}
