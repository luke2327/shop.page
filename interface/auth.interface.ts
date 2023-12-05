export type ShopInfo = {
  client_key: string
  client_secret_key: string
  shop_disp_id: string
  shop_id: string
  shop_name: 'smartstore'
  sol_shop_no: number
  type: 'receive' | 'send' | 'upload' | 'update'
  user_no: UserInfo['user_no']
}

export type UserInfo = {
  email: string
  id: string
  password: string
  registered_at: string
  tel?: string
  user_no: number
}

export type LoginResult = {
  result: {
    userInfo: UserInfo
    shopInfo: ShopInfo
    message: 'SUCCESS'
  }
}

export type LoginFieldType = {
  email?: string
  shopId?: string
  password?: string
  remember?: string
}
