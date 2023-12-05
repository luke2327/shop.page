// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import AuthService from '@/services/auth.service'
import { openGate } from '@/lib/cors'
import { ShopInfo, UserInfo } from 'interface/auth.interface'

type Data = {
  result: {
    userInfo: any
    shopInfo: any
    message: 'SUCCESS'
  }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  await openGate(req, res)
  if (req.method === 'POST') {
    const authService = new AuthService()

    const [userInfo] = (await authService.login(req.body)) as UserInfo[]
    const [shopInfo] = (await authService.getShopInfo(userInfo)) as ShopInfo[]

    console.log('----------------')
    console.log(shopInfo)
    console.log('----------------')

    res.status(200).json({
      result: {
        userInfo: userInfo,
        shopInfo: shopInfo,
        message: 'SUCCESS',
      },
    })
  }
}
