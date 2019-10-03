import { Pool } from 'pg'
import { IPgTime, IGetPgTime } from './make-query.d'
import { verifyRequest } from '../../authentication/verify-request.service'
import { IJwtVerifyResponse } from '../../authentication/jwt.service'

export interface IAuthGetPgTimeFactory {
  getPgTime: typeof getPgTime,
  verifyRequest: typeof verifyRequest
}

export interface IContext {
  headers: {
    token?: string
  }
}

export interface IAuthGetPgTime extends IJwtVerifyResponse {
  data?: {
    time: string
  }
}

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

    return async (): Promise<IAuthGetPgTime> => {
      try {
        const time = await query<IPgTime>('SELECT NOW()')
        return {
          success: true,
          data: {
            time:time[0].now
          }
        }
      } catch (e) {
        return {
          success: false,
          error: JSON.stringify(e)
        }
      }
    }
  }

const getPgTime = getPgTimeFactory({ pgQuery })

const authGetPgTimeFactory = (dependencies: IAuthGetPgTimeFactory) =>
  (pool: Pool) => {
    const { getPgTime, verifyRequest } = dependencies
    const getTime = getPgTime(pool)
    return async (_: any, context: IContext): Promise<IAuthGetPgTime> => {
      const response = await verifyRequest(context, async () => {
        return await getTime()
      })
      return response
    }
  }

const authGetPgTime = authGetPgTimeFactory({ getPgTime, verifyRequest })

export { pgQuery, getPgTime, authGetPgTime }