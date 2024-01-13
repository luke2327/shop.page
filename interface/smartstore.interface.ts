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
  detail?: Detail
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

export type Sort = {
  sorted: boolean
  fields: Field[]
}

export type Field = {
  name: string
  direction: string
}

export type Detail = {
  originProduct: OriginProduct
  smartstoreChannelProduct: SmartstoreChannelProduct
}

export type OriginProduct = {
  statusType: string
  saleType: string
  leafCategoryId: string
  name: string
  images: Images
  salePrice: number
  stockQuantity: number
  deliveryInfo: DeliveryInfo
  detailAttribute: DetailAttribute
  customerBenefit: CustomerBenefit
}

export type CustomerBenefit = {
  immediateDiscountPolicy: ImmediateDiscountPolicy
  giftPolicy: GiftPolicy
}

export type GiftPolicy = {
  presentContent: string
}

export type ImmediateDiscountPolicy = {
  discountMethod: DiscountMethod
  mobileDiscountMethod: DiscountMethod
}

export type DiscountMethod = {
  value: number
  unitType: string
}

export type DeliveryInfo = {
  deliveryType: string
  deliveryAttributeType: string
  deliveryCompany: string
  deliveryBundleGroupUsable: boolean
  deliveryBundleGroupId: number
  deliveryFee: DeliveryFee
  claimDeliveryInfo: ClaimDeliveryInfo
  installationFee: boolean
}

export type ClaimDeliveryInfo = {
  returnDeliveryCompanyPriorityType: string
  returnDeliveryFee: number
  exchangeDeliveryFee: number
  shippingAddressId: number
  returnAddressId: number
  freeReturnInsuranceYn: boolean
}

export type DeliveryFee = {
  deliveryFeeType: string
  baseFee: number
  freeConditionalAmount: number
  deliveryFeePayType: string
  differentialFeeByArea: string
}

export type DetailAttribute = {
  naverShoppingSearchInfo: NaverShoppingSearchInfo
  afterServiceInfo: AfterServiceInfo
  originAreaInfo: OriginAreaInfo
  optionInfo: OptionInfo
  supplementProductInfo: SupplementProductInfo
  purchaseReviewInfo: PurchaseReviewInfo
  eventPhraseCont: string
  taxType: string
  certificationTargetExcludeContent: CertificationTargetExcludeContent
  sellerCommentUsable: boolean
  minorPurchasable: boolean
  productInfoProvidedNotice: ProductInfoProvidedNotice
  itselfProductionProductYn: boolean
  seoInfo: SEOInfo
}

export type AfterServiceInfo = {
  afterServiceTelephoneNumber: string
  afterServiceGuideContent: string
}

export type CertificationTargetExcludeContent = object

export type NaverShoppingSearchInfo = {
  modelName: string
  manufacturerName: string
  brandName: string
}

export type OptionCombinations = {
  id: number
  optionName1: string
  optionName2: string
  price: number
  stockQuantity: number
  usable: boolean
}

export type OptionInfo = Partial<{
  simpleOptionSortType: string
  optionSimple: any[]
  optionCustom: any[]
  optionCombinations: OptionCombinations[]
  optionCombinationSortType: string
  useStockManagement: boolean
  optionDeliveryAttributes: any[]
}>

export type OriginAreaInfo = {
  originAreaCode: string
  content: string
  plural: boolean
}

export type ProductInfoProvidedNotice = {
  productInfoProvidedNoticeType: string
  generalFood: GeneralFood
}

export type GeneralFood = {
  returnCostReason: string
  noRefundReason: string
  qualityAssuranceStandard: string
  compensationProcedure: string
  troubleShootingContents: string
  productName: string
  foodType: string
  producer: string
  location: string
  packDateText: string
  consumptionDateText: string
  weight: string
  amount: string
  ingredients: string
  geneticallyModified: boolean
  consumerSafetyCaution: string
  importDeclarationCheck: boolean
  customerServicePhoneNumber: string
}

export type PurchaseReviewInfo = {
  purchaseReviewExposure: boolean
}

export type SEOInfo = {
  sellerTags: SellerTag[]
}

export type SellerTag = {
  code?: number
  text: string
}

export type SupplementProductInfo = {
  sortType: string
  supplementProducts: SupplementProduct[]
}

export type SupplementProduct = {
  id: number
  groupName: string
  name: string
  price: number
  stockQuantity: number
  usable: boolean
}

export type Images = {
  representativeImage: RepresentativeImage
  optionalImages: any[]
}

export type SmartstoreChannelProduct = {
  storeKeepExclusiveProduct: boolean
  naverShoppingRegistration: boolean
  channelProductDisplayStatusType: string
}

export type ProductSendResult = {
  result: {
    message: string
    success: number
    fail: number
    total: number
    errors: ProductSendErrors[]
  }
}

export type ProductSendErrors = {
  productNo: number
  errorList: {
    type: string
    message: string
    name: string
  }[]
}

export interface Item {
  key: string
  statusType: string
  productName: string
  productNo: number
  productImg: string
  productLink: string
  productTag: string
  salePrice: number
  productQuantity: number
  productDiscountedPrice: number
  productCategory: string
  regDate: Date
  modifiedDate: Date
  productCoupon: {
    periodType: string
    periodDays: number
    publicInformationContents: string
    contactInformationContents: string
    usePlaceType: string
    usePlaceContents: string
    siteName: string
    restrictCart: boolean
  }
  productOption?: OptionInfo
}
