import { openGate } from '@/lib/cors'
import { NextApiRequest, NextApiResponse } from 'next'

type Data = {
  result: {
    resultData: any
    message: 'SUCCESS'
  }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  await openGate(req, res)

  res.send({
    result: {
      resultData: [],
      message: 'SUCCESS',
    },
  })

  console.log(req.body)
}
