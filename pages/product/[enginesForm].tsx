import Head from 'next/head'
import styles from '@/styles/Home.module.css'
import SmartstoreForm from '@/components/engines/SmartstoreForm'
import { useRecoilState } from 'recoil'
import { common } from '@/lib/store/common'
import { useEffect } from 'react'
import { useRouter } from 'next/router'

const Home = () => {
  const router = useRouter()
  const [commonState, setCommonState] = useRecoilState(common)

  useEffect(() => {
    if (!commonState.isLogin) {
      router.push('/')
    }
  }, [commonState.isLogin, router])

  return (
    <div className={styles.container}>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {router.query.enginesForm === 'smartstore' && <SmartstoreForm />}
    </div>
  )
}

export default Home
