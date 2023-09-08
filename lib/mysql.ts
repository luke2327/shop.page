import { createConnection } from 'mysql2/promise'

async function getConnection(dbName?: 'private') {
  return createConnection({
    host: 'faker.cqpmauffywbw.ap-northeast-2.rds.amazonaws.com',
    user: 'admin',
    password: 'asdlkj11411',
    database: 'kmong.com',
  })
}

export default async function queryPromise<T = any>(queryString: string, values?: any): Promise<T> {
  const conn = await getConnection()
  let returnObject

  try {
    ;[returnObject] = await conn.query(queryString, values)
  } catch (e) {
    console.log(e)
  } finally {
    conn.end()
  }

  return returnObject as any
}

export async function connection() {
  return getConnection()
}
