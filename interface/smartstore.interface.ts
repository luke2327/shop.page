export type AddressBookList = {
  address: string
  addressBookNo: number
  addressType: string
  baseAddress: string
  detailAddress: string
  name: string
  phoneNumber1: string
  phoneNumber2: string
  postalCode: string
  roadNameAddress: boolean
}[]
export type AddressGroupList = {
  id: number
  name: string
  usable: boolean
  baseGroup: boolean
  deliveryFeeChargeMethodType: 'MIN'
}[]
export type V2List = {
  contents: Content[]
  page: number
  size: number
  totalElements: number
  totalPages: number
  sort: Sort
  first: boolean
  last: boolean
}

export type Content = {
  originProductNo: number
  channelProducts: ChannelProduct[]
}

export type ChannelProduct = {
  originProductNo: number
  channelProductNo: number
  channelServiceType: string
  categoryId: string
  name: string
  statusType: string
  channelProductDisplayStatusType: string
  salePrice: number
  discountedPrice: number
  mobileDiscountedPrice: number
  stockQuantity: number
  knowledgeShoppingProductRegistration: boolean
  deliveryFee: number
  managerPurchasePoint: number
  wholeCategoryName: string
  wholeCategoryId: string
  representativeImage: RepresentativeImage
  brandName: string
  sellerTags: SellerTag[]
  regDate: Date
  modifiedDate: Date
}

export type RepresentativeImage = {
  url: string
}

export type SellerTag = {
  text: string
}

export type Sort = {
  sorted: boolean
  fields: Field[]
}

export type Field = {
  name: string
  direction: string
}
