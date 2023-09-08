// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import TpService from '@/services/tp.service'

type Data = {
  name: any
}

const tpService = new TpService()

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  const params = req.body
  res.status(200).json({ name: params })
}
