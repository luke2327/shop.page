import React, { ReactNode } from 'react'
import { useRecoilState } from 'recoil'
import { common } from '@/lib/store/common'
import styles from '@/styles/Home.module.css'
import FileUpload from '@/components/CsvUpload'

type ILayoutProps = {
  children: ReactNode
}
const ExcelUpload: React.FC<ILayoutProps> = (params) => {
  const [commonState, setCommonState] = useRecoilState(common)

  return commonState.step === 2 ? (
    <div className={styles.container}>
      <FileUpload />
    </div>
  ) : null
}

export default ExcelUpload
