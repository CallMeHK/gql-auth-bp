import { Request, Response, NextFunction } from 'express'
import { authenticateUser } from "./authenticate.service"
import { createPgPool } from '../resolver-factories/postgres/create-pool'
import { Pool } from 'pg'

export interface IAuthRequest extends Request {
  userName: string,
  password: string
}

export interface IAuthRouteFactory {
  authenticateUser: typeof authenticateUser
  createPgPool: typeof createPgPool
}

const AuthenticateRouteFactory = (dependencies: IAuthRouteFactory) => {
  const { authenticateUser, createPgPool} = dependencies
  const pool = createPgPool()
  const authRequest = authenticateUser(pool)
  return async (req: IAuthRequest, res: Response, next: NextFunction) => {
    const { userName, password } = req.body
    const authResponse = await authRequest(userName, password)
    res.json(authResponse)
  }
}

const AuthenticateRoute = AuthenticateRouteFactory({ authenticateUser, createPgPool })

export default AuthenticateRoute

export {
  AuthenticateRouteFactory
}