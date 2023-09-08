// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'

type Data = {
  name: any
}

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  // const tpService = new TpService()
  const params = req.body
  res.status(200).json({ name: params })
}
