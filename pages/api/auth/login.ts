// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import AuthService from '@/services/auth.service'

type Data = {
  result: {
    userInfo: any
    shopInfo: any
    message: 'SUCCESS'
  }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  const authService = new AuthService()

  const [userInfo] = await authService.login(req.body)
  const shopInfo = await authService.getShopInfo(userInfo)

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
