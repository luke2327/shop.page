import { SmartstoreCsvDataMap } from '@/components/engines/smartstore/List'
import { V2List } from 'interface/smartstore.interface'
import { atom } from 'recoil'
import dummy from './dummy.json'

export const product = atom<{
  uploadExcelData: SmartstoreCsvDataMap[]
}>({
  key: 'productState',
  default: {
    uploadExcelData: [],
  },
})

export const productV2 = atom<{
  smartstore: V2List
}>({
  key: 'productV2State',
  default: {
    smartstore: dummy as unknown as V2List,
  },
  // default: {
  //   smartstore: {
  //     contents: [],
  //     first: true,
  //     last: true,
  //     page: 1,
  //     size: 0,
  //     sort: { sorted: false, fields: [{ name: '', direction: '' }] },
  //     totalElements: 0,
  //     totalPages: 0,
  //   },
  // },
})
