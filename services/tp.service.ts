import bcrypt from 'bcrypt'
import Request from '@/services/request.service'
import momentTZ from 'moment-timezone'

export type GetTokenInfoParams = {
  client_secret_key: string
  client_key: string
}

type TokenInfo = {
  token: string
}

export default class TpService {
  requestService = new Request()

  async sendUrlSmartstore(
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
      return await this.requestService.sendUrl(method, options.uri, data, headers)
    } else {
      return await this.requestService.sendUrlJson(method, options.uri, data, headers, bodyType as any)
    }
  }
  async getTokenInfo(params: GetTokenInfoParams) {
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
    const tokenInfo = await this.sendUrlSmartstore(...payload)

    return `${tokenInfo.token_type} ${tokenInfo.access_token}`
  }
  async getChannelInfo(params: TokenInfo) {
    const headers = {
      Authorization: params.token,
    }

    const payload = ['GET', 'seller/channels', {}, headers] as const
    const response = await this.sendUrlSmartstore(...payload)

    return response as [{ channelNo: number; channelType: string; name: string }]
  }

  async productRegist(params: any, list: any) {
    const format = this.createProductFormat(list)
  }

  async productSearchList(params: any) {
    const result: any = { list: [], fail: 0, success: 0 }
    console.log('start!', params.send)

    const token = await this.getTokenInfo(params.send)
    console.log('-----------------1')
    console.log(token)
    console.log('-----------------1')
    const headers = { Authorization: token }

    for (const row of params.selectedRows) {
      console.log(111111)
      const payload = ['GET', `products/channel-products/${row.product_code}`, {}, headers, 'form', 'v2'] as const
      const re = await this.sendUrlSmartstore(...payload).then(JSON.parse)

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

  async getGroupAddressList(token: string) {
    const headers = { Authorization: token }
    const endpoint = 'product-delivery-info/bundle-groups'
    const payload = ['GET', endpoint, {}, headers] as const
    return await this.sendUrlSmartstore(...payload).then(JSON.parse)
  }

  async getAddressList(token: string) {
    const headers = { Authorization: token }
    const endpoint = 'seller/addressbooks-for-page'
    const payload = ['GET', endpoint, {}, headers, 'form'] as const
    return await this.sendUrlSmartstore(...payload).then(JSON.parse)
  }

  async callProducts(body: any, token: string, mode: 'regist' | 'update' | 'partialEdit', shopProdCode = '') {
    let method = 'POST'
    let endpoint
    let version

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

    return await this.sendUrlSmartstore(...payload)
  }

  // 상품 전송 데이터 가공
  async createProductFormat(params) {
    const images = []

    try {
      // for (let i = 1; i < 8; i++) {
      //   if (params[`prod_img${i}`]) {
      //     images.push(params[`prod_img${i}`])
      //   }
      // }

      // // 등록할 이미지 스마트스토어에 업로드
      // const uploadedImages = await this.callProductImagesUpload(params.add_img_list, smartstoreToken)
      // // 메인 이미지
      // const representativeImage = { url: uploadedImages[0].url }
      // // 서브 이미지(복수)
      // const optionalImages = uploadedImages.slice(1)
      //
      // const [notice, noticeType] = this.getProductSummaryInfo(params)

      const body = {
        originProduct: {
          statusType: 'SALE',
          saleType: 'NEW',
          saleStartDate: `${params.sale_start_date || momentTZ().tz('Asia/Seoul').format('YYYY-MM-DD')}T00:00:00Z`,
          saleEndDate: `${params.sale_end_date || '2099-12-31'}T23:59:59Z`,
          name: params.prod_name,
          images: {
            representativeImage: params.images.representativeImage,
            optionalImages: params.imges.optionalImages,
          },
          detailContent: params.content,
          salePrice: params.sale_price,
          stockQuantity: params.prod_cnt,
          deliveryInfo: {
            deliveryType: 'DELIVERY',
            deliveryAttributeType: params.delivery.type,
            deliveryCompany: params.delivery.deliv_code,
            deliveryBundleGroupId: Number(params.shop_etc.group_place.code),
            deliveryFee: { deliveryFeeType: Number(params.delivery.price) === 0 ? 'FREE' : 'PAID' },
            claimDeliveryInfo: {
              returnDeliveryCompanyPriorityType: params.shop_etc.redeliv_priority_type,
              returnDeliveryFee: Number(params.delivery.return_price),
              exchangeDeliveryFee: Number(params.shop_etc.exchange_delivery_fee),
            },
          },
          detailAttribute: {
            naverShoppingSearchInfo: {
              manufacturerName: params.manufacturer,
              brandName: params.brand,
              modelName: params.model ? params.model.name : undefined,
            },
            sellerCodeInfo: {
              sellerManagementCode: params.manage_code,
            },
            afterServiceInfo: {
              afterServiceTelephoneNumber: params.shop_etc.as_tel,
              afterServiceGuideContent: params.shop_etc.as_guide,
            },
            originAreaInfo: {
              originAreaCode: params.origin,
              importer: params.brand,
            },
            minorPurchasable: true,
            // 상품정보제공고시
            productInfoProvidedNotice: {
              productInfoProvidedNoticeType: noticeType,
              ...notice,
            },
          },
        },
        smartstoreChannelProduct: {
          channelProductName: params.prod_name, // 스마트스토어 전용 상품명
          naverShoppingRegistration: true,
          channelProductDisplayStatusType: 'ON',
        },
      }

      // 카테고리 등록시에만 적용
      if (mode !== 'update') {
        body.originProduct.leafCategoryId = params.category_id
      }

      // 배송비 무료가 아닌경우 배송비 대입
      if (body.originProduct.deliveryInfo.deliveryFee.deliveryFeeType === 'PAID') {
        body.originProduct.deliveryInfo.deliveryFee.baseFee = `${params.delivery.price}`
        body.originProduct.deliveryInfo.deliveryFee.deliveryFeePayType = 'PREPAID'
      }

      // KC 인증정보
      if (params.certification_list && params.certification_list.length) {
        body.originProduct.detailAttribute.productCertificationInfos = []

        for (const [idx, cert] of Object.entries(params.certification_list)) {
          if (cert.certification) {
            const insertCert = {
              certificationInfoId: Number(cert.certification),
              certificationKindType: 'KC_CERTIFICATION',
              certificationMark: false,
            }
            if (cert.certificationName) {
              insertCert.name = cert.certificationName
            }
            if (cert.certificationNumber) {
              insertCert.certificationNumber = cert.certificationNumber
            }
            if (cert.certificationCompanyName) {
              insertCert.companyName = cert.certificationCompanyName
            }

            body.originProduct.detailAttribute.productCertificationInfos.push(insertCert)
          }

          if (cert.kcCertifiedProductExclusionYn) {
            body.originProduct.detailAttribute.certificationTargetExcludeContent = {
              kcCertifiedProductExclusionYn: cert.kcCertifiedProductExclusionYn,
            }

            if (cert.kcExemptionType) {
              body.originProduct.detailAttribute.certificationTargetExcludeContent.kcExemptionType = cert.kcExemptionType

              if (
                ['OVERSEAS', 'PARALLEL_IMPORT'].includes(cert.kcExemptionType) &&
                cert.certification &&
                ![1042, 1041, 1040].includes(cert.certification)
              ) {
                body.originProduct.detailAttribute.productCertificationInfos[Number(idx)].certificationKindType =
                  cert.kcExemptionType
              }
            }

            // 어린이 제품일 경우에는 무조건
            if (cert.certification && [1042, 1041, 1040].includes(cert.certification)) {
              body.originProduct.detailAttribute.productCertificationInfos[Number(idx)].certificationKindType =
                'CHILD_CERTIFICATION'
              body.originProduct.detailAttribute.certificationTargetExcludeContent = { kcCertifiedProductExclusionYn: 'TRUE' }
            }
          }
        }
      } else {
        // KC 인증관리대상 아님
        body.originProduct.detailAttribute.certificationTargetExcludeContent = { kcCertifiedProductExclusionYn: 'TRUE' }
      }

      // 옵션정보
      if (params.option) {
        body.originProduct.detailAttribute.optionInfo = {
          optionCombinationGroupNames: (() => {
            const groupNames = {}

            Object.entries(params.option.names).forEach(([idx, optionName]) => {
              if (optionName) {
                groupNames[`optionGroupName${Number(idx) + 1}`] = optionName
              }
            })

            return groupNames
          })(),
          optionCombinations: params.option.items.map((opt) => ({
            optionName1: opt.value1,
            optionName2: opt.value2 ? opt.value2 : undefined,
            optionName3: opt.value3 ? opt.value3 : undefined,
            price: Number(opt.add_price), // 가격이 0인 옵션이 1개이상 있어야함
            stockQuantity: Number(opt.cnt),
            sellerManagerCode: opt.code,
            usable: opt.usable === 'Y',
          })),
        }
      }

      // 직접입력인 경우 한정 content(원산지 직접입력 정보 추가)
      if (body.originProduct.detailAttribute.originAreaInfo.originAreaCode === '04') {
        body.originProduct.detailAttribute.originAreaInfo.content = params.shop_etc.sku_origin_detail
      } else {
        body.originProduct.detailAttribute.originAreaInfo.originAreaCode = '04'
        body.originProduct.detailAttribute.originAreaInfo.content = '기타'
      }

      return body
    } catch (e) {
      console.log('상품등록 에러', e)

      throw e
    }
  }
}
