import { Permissions, ShopInfo, UserInfo } from 'interface/auth.interface'
import { atom, selector } from 'recoil'

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

interface Solution {
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
}

export const solution = atom<Solution>({
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

export const userInfo = selector({
  key: 'userInfo',
  get: ({ get }) => {
    const solutionState = get(solution)

    return solutionState.userInfo as UserInfo
  },
})

export const permission = selector({
  key: 'permission',
  get: ({ get }) => {
    const solutionState = get(solution)

    return (solutionState.userInfo as UserInfo).role as Permissions
  },
})

export type ProductNotificationValue = {
  success: number
  fail: number
  total: number
  title: string
}

export const productNotification = atom<
  ProductNotificationValue & {
    isShow: boolean
  }
>({
  key: 'productNotificationState',
  default: {
    isShow: false,
    title: '',
    success: 0,
    fail: 0,
    total: 0,
  },
})
