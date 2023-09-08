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
  userInfo: any
  shopInfo: any
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
    shopInfo: {},
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
