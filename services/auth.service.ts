import queryPromise from '@/lib/mysql'

type LoginParams = {
  email: string
  password: string
}

export default class AuthService {
  async login(params: LoginParams) {
    const queryString = `SELECT * FROM \`kmong.com\`.User WHERE email = '${params.email}' AND password = '${params.password}'`

    return queryPromise(queryString)
  }

  async getShopInfo(params: { user_no: number }) {
    const queryString = `
      SELECT * FROM \`kmong.com\`.SolShop
      WHERE user_no = ${params.user_no} AND \`type\` = 'update';
    `

    return queryPromise(queryString)
  }
}
