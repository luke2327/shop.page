import Head from 'next/head'
import styles from '@/styles/Home.module.css'
import LoginForm from '@/components/auth/LoginForm'

const Home = () => {
  return (
    <div className={styles.container}>
      <Head>
        <title>Login</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <LoginForm />
    </div>
  )
}

export default Home
