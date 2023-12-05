// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { openGate } from '@/lib/cors'
import { productEdit, productSearchList } from '@/services/tp.service'

type Data = {
  result: {
    list: any
    token: string
    message: 'SUCCESS'
  }
}

export const config = { api: { bodyParser: { sizeLimit: '25mb' } } }

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  await openGate(req, res)
  if (req.method === 'POST') {
    const match = []
    const params = req.body
    const token = params.token

    for (const row of params.newProduct) {
      const matchOriginProduct = params.originProduct.find((x: any) => x.product_name === row.product_name)

      match.push({
        link: `pingpang9/products/${matchOriginProduct.product_code}`,
        linkTrans: `caseparas/products/${row.product_code}`,
      })
    }

    const { list } = await productSearchList(token, {
      selectedRows: params.newProduct,
    })

    for (let row of list) {
      let stringData = JSON.stringify(row)

      for (const m of match) {
        if (stringData.includes(m.link)) {
          stringData = stringData.replaceAll(m.link, m.linkTrans)
        }
        if (stringData.includes('케이스파트너')) {
          stringData = stringData.replaceAll(/케이스파트너/g, '케이스파라스')
        }
        if (stringData.includes('파트너')) {
          stringData = stringData.replaceAll(/파트너/g, '파라스')
        }

        row = JSON.parse(stringData)
      }

      const { product_code, ...product } = row
      console.log(product)
      const data = { product_code, body: product }

      await productEdit(token, data)
    }

    // await productSearch({ shop_prod_code: params.newProduct.map((x: any) => x.product_code) }, token)

    res.status(200).json({
      result: {
        list,
        token,
        message: 'SUCCESS',
      },
    })
  }
}
