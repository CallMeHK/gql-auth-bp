import { Pool } from 'pg'
import { IPgTime, IGetPgTime } from './make-query.d'

const pgQuery = (pool: Pool) =>
  async <T>(query: string): Promise<Array<T>> => {
    const result = await pool.query(query)
    const rows: Array<T> = result.rows
    return rows
  }

const getPgTimeFactory = (dependencies: IGetPgTime) =>

  (pool: Pool) => {
    const { pgQuery } = dependencies
    const query = pgQuery(pool)

    return async (): Promise<string> => {
      const time = await query<IPgTime>('SELECT NOW()')
      const now = time[0].now
      return now
    }
  }

const getPgTime = getPgTimeFactory({ pgQuery })

export { pgQuery, getPgTime }