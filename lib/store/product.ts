import { SmartstoreCsvDataMap } from '@/components/engines/smartstore/List'
import { atom } from 'recoil'

export const product = atom<{
  uploadExcelData: SmartstoreCsvDataMap[]
}>({
  key: 'productState',
  default: {
    uploadExcelData: [],
  },
})
