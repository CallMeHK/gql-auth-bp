import { Request, Response, NextFunction } from 'express'
import { pgQuery } from '../resolver-factories/postgres/make-query'
import { Pool } from 'pg'
import { createPgPool } from '../resolver-factories/postgres/create-pool'
import { signJwt, comparePassword } from './jwt.service'

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

export interface IAuthenticateUserFactory {
  getUserCreds: typeof getUserCreds,
  signJwt: typeof signJwt,
  comparePassword: typeof comparePassword
}

export interface IAuthResponse {
  success: boolean,
  token: string | null
}

const getUserCredsFactory = (dependencies: IUserFactory) =>
  (pool: Pool) => {

    const { pgQuery } = dependencies
    const query = pgQuery(pool)
    return async (userName: string): Promise<IUserQuery> => {
      const [user] = await query<IUserQuery>(`SELECT * FROM users WHERE name='${userName}'`)
      return user
    }
  }

const getUserCreds = getUserCredsFactory({ pgQuery })

const authenticateUserFactory = (dependencies: IAuthenticateUserFactory) =>
  (pool: Pool) => {
    const { getUserCreds, signJwt, comparePassword } = dependencies
    const getUser = getUserCreds(pool)

    return async (userName: string, password: string): Promise<IAuthResponse> => {
      const user = await getUser(userName)
      const success = await comparePassword(password, user.password)
      return {
        success,
        token: success ? signJwt(user.id, user.name) : null
      }
    }
  }

const authenticateUser = authenticateUserFactory({ getUserCreds, signJwt, comparePassword })

const AuthenticateRoute = async (req: IAuthRequest, res: Response, next: NextFunction) => {
  const { userName, password } = req.body
  const pool = createPgPool()

  const authResponse = await authenticateUser(pool)(userName, password)
  console.log(authResponse)
  res.json(authResponse)
}

export default AuthenticateRoute

export {
  authenticateUser
}