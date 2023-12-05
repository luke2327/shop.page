import { ShopInfo, UserInfo } from 'interface/auth.interface'
import { atom } from 'recoil'

export const common = atom<{
  step: number
  isLogin: boolean
  loginShopId: string
}>({
  key: 'commonState',
  default: {
    step: 1,
    isLogin: false,
    loginShopId: '',
  },
})

export const solution = atom<{
  userInfo: UserInfo | NonNullable<unknown>
  shopInfo: ShopInfo
  send: any
  receive: any
  shippingAddressList: any
  returnAddressList: any
  groupAddressList: any
  shippingAddress: any
  returnAddress: any
  groupAddress: any
}>({
  key: 'solutionState',
  default: {
    userInfo: {},
    shopInfo: {
      client_key: '',
      client_secret_key: '',
      shop_disp_id: '',
      shop_id: '',
      shop_name: 'smartstore',
      sol_shop_no: 0,
      type: 'update',
      user_no: 0,
    },
    send: {},
    receive: {},
    shippingAddressList: [],
    returnAddressList: [],
    groupAddressList: [],
    shippingAddress: {},
    returnAddress: {},
    groupAddress: {},
  },
})
