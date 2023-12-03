import bcrypt from 'bcrypt'
import { sendUrlJson, sendUrl } from '@/services/request.service'

export type GetTokenInfoParams = {
  client_secret_key: string
  client_key: string
}

type TokenInfo = {
  token: string
}

export async function sendUrlSmartstore(
  method: 'POST' | 'GET' | 'PUT',
  url: string,
  data: any,
  headers: any,
  bodyType = 'body',
  version = 'v1',
) {
  const options = {
    method: method,
    headers: headers,
    uri: `https://api.commerce.naver.com/external/${version}/${url}`,
    json: !(method === 'GET'),
  }

  if (method === 'GET') {
    return await sendUrl(method, options.uri, data, headers)
  } else {
    return await sendUrlJson(method, options.uri, data, headers, bodyType as any)
  }
}
export async function getTokenInfo(params: GetTokenInfoParams) {
  const timestamp = Date.now() - 10 * 1000
  const password = `${params.client_key}_${timestamp}`
  const hashed = bcrypt.hashSync(password, params.client_secret_key)
  const signature = Buffer.from(hashed, 'utf-8').toString('base64')

  const data = {
    client_id: params.client_key,
    timestamp: timestamp,
    client_secret_sign: signature,
    grant_type: 'client_credentials',
    type: 'SELF',
  }

  const payload = ['POST', 'oauth2/token', data, {}, 'form'] as const
  const tokenInfo = await sendUrlSmartstore(...payload)

  return `${tokenInfo.token_type} ${tokenInfo.access_token}`
}
export async function getChannelInfo(params: TokenInfo) {
  const headers = {
    Authorization: params.token,
  }

  const payload = ['GET', 'seller/channels', {}, headers] as const
  const response = await sendUrlSmartstore(...payload)

  return response as [{ channelNo: number; channelType: string; name: string }]
}

export async function productRegist(params: any, list: any) {
  // const format = this.createProductFormat(list)
}

export async function productSearchList(params: any) {
  const result: any = { list: [], fail: 0, success: 0 }
  console.log('start!', params.send)

  const token = await getTokenInfo(params.send)
  console.log('-----------------1')
  console.log(token)
  console.log('-----------------1')
  const headers = { Authorization: token }

  for (const row of params.selectedRows) {
    console.log(111111)
    const payload = ['GET', `products/channel-products/${row.product_code}`, {}, headers, 'form', 'v2'] as const
    const re = await sendUrlSmartstore(...payload).then(JSON.parse)

    console.log(re)

    result.list.push(re)

    continue

    console.log('----------------')
    console.log(re)
    console.log('----------------')

    if (re.code) {
      result.fail += 1
    } else {
      const product: any = {
        shop_prod_code: row.product_code,
        name: re.originProduct.name,
        price: re.originProduct.salePrice,
        stock: re.originProduct.stockQuantity,
        content: re.originProduct.detailContent,
        model: re.originProduct.detailAttribute.naverShoppingSearchInfo.modelName,
        brand: re.originProduct.detailAttribute.naverShoppingSearchInfo.brandName,
        manufacturer: re.originProduct.detailAttribute.naverShoppingSearchInfo.manufacturerName,
        as_tel: re.originProduct.detailAttribute.afterServiceInfo.afterServiceTelephoneNumber,
        as_guide: re.originProduct.detailAttribute.afterServiceInfo.afterServiceGuideContent,
        summary_info: re.originProduct.detailAttribute.productInfoProvidedNotice.productInfoProvidedNoticeType,
        deliv_code: re.originProduct.deliveryInfo.deliveryCompany,
        delivery_price: re.originProduct.deliveryInfo.deliveryFee.baseFee,
        delivery_fee_pay_type: re.originProduct.deliveryInfo.deliveryFee.deliveryFeeType,
        redeliv_priority_type: re.originProduct.deliveryInfo.claimDeliveryInfo.returnDeliveryCompanyPriorityType,
        exchange_delivery_fee: re.originProduct.deliveryInfo.claimDeliveryInfo.exchangeDeliveryFee,
        images: re.originProduct.images,
        // shop_status: this.statusTypeList[re.originProduct.statusType],
      }

      if (re.originProduct.saleEndDate) {
        product.shop_end_date = `${re.originProduct.saleEndDate.replace('T', ' ').split('+')[0]}:00`
      }

      if (re.originProduct.detailAttribute.productCertificationInfos) {
        const [cert] = re.originProduct.detailAttribute.productCertificationInfos

        product.certification = {
          certification: cert.certificationInfoId,
          certificationName: cert.name,
          certificationCompanyName: cert.companyName,
          exclude_content: 'FALSE-2',
          kcCertifiedProductExclusionYn: 'FALSE',
        }
      }
      result.success += 1
      result.list.push(product)
    }
  }

  console.log(result)

  return result
}

export async function getGroupAddressList(token: string) {
  const headers = { Authorization: token }
  const endpoint = 'product-delivery-info/bundle-groups'
  const payload = ['GET', endpoint, {}, headers] as const
  return await sendUrlSmartstore(...payload).then(JSON.parse)
}

export async function getAddressList(token: string) {
  const headers = { Authorization: token }
  const endpoint = 'seller/addressbooks-for-page'
  const payload = ['GET', endpoint, {}, headers, 'form'] as const
  return await sendUrlSmartstore(...payload).then(JSON.parse)
}

export async function callProducts(body: any, token: string, mode: 'regist' | 'update' | 'partialEdit', shopProdCode = '') {
  let method: 'PUT' | 'POST' | 'GET' = 'POST'
  let endpoint = ''
  let version = ''

  if (mode === 'regist') {
    method = 'POST'
    endpoint = 'products'
    version = 'v2'
  } else if (mode === 'update') {
    method = 'PUT'
    endpoint = `products/channel-products/${shopProdCode}`
    version = 'v2'
  } else if (mode === 'partialEdit') {
    method = 'PUT'
    endpoint = 'products/origin-products/bulk-update'
    version = 'v1'
  }

  const headers = { Authorization: token }
  const payload = [method, endpoint, body, headers, 'body', version] as const

  return await sendUrlSmartstore(...payload)
}

export async function productEdit(params: any, token: string) {
  const headers = { Authorization: token }
  const endpoint = `products/channel-products/${params.product_code}`

  const payload = ['PUT', endpoint, params.body, headers, 'form', 'v2'] as const
  const re = await sendUrlSmartstore(...payload)

  return re
}

export async function productSearch(params: any, token: string) {
  const result: any = {}

  const headers = { Authorization: token }
  const data = {
    searchKeywordType: 'CHANNEL_PRODUCT_NO',
    channelProductNos: params.shop_prod_code,
    page: 1,
    size: 1000,
  }

  result.list = []

  const payload = ['POST', 'products/search', data, headers] as const
  const re = await sendUrlSmartstore(...payload)

  result.total += re.totalElements

  for (const content of re.contents) {
    const [row] = content.channelProducts

    result.list.push({
      shop_prod_code: row.channelProductNo,
      shop_prod_code_sub: row.originProductNo,
      manage_code: row.sellerManagementCode,
      prod_name: row.name,
      shop_status: row.statusType,
      sale_end_date: row.saleEndDate,
    })
  }

  result.result = 'SUCCESS'

  return result
}
