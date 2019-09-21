import { Request, Response, NextFunction } from 'express'
import { pgQuery } from '../resolver-factories/postgres/make-query'
import { Pool } from 'pg'
import { createPgPool } from '../resolver-factories/postgres/create-pool'

export interface IUserFactory {
  pgQuery: typeof pgQuery
}

export interface IUserQuery {
  id: number,
  name: string,
  email: string,
  password: string
}

export interface IAuthRequest extends Request {
  userName: string,
  password: string
}

const getUserFactory = (dependencies: IUserFactory) =>
  (pool: Pool) => {

    const { pgQuery } = dependencies
    const query = pgQuery(pool)
    return async (userName: string): Promise<IUserQuery> => {
      const [user] = await query<IUserQuery>(`SELECT * FROM users WHERE name='${userName}'`)
      return user
    }
  }

const getUser = getUserFactory({ pgQuery })

const AuthenticateRoute = async (req: IAuthRequest, res: Response, next: NextFunction) => {
  const { userName, password } = req.body
  console.log(req.body)
  const pool = createPgPool()

  const userInfo = await getUser(pool)(userName)
  console.log(userInfo)
  res.json(userInfo)
}

export default AuthenticateRoute