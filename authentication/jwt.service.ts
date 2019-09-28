import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'

export interface IJwtFactory {
  jwt: typeof jwt,
  secret: string
}

export interface IJwtVerifyResponse {
  success: boolean,
  id?: number,
  name?: string,
  iat?: number,
  error?: string
}

export interface IComparePasswordFactory {
  bcrypt: typeof bcrypt
}

const signJwtFactory = (dependencies: IJwtFactory) => {
  const { jwt, secret } = dependencies
  return (id: number, name: string): string => {
    const token = jwt.sign({ id, name }, secret)
    return token
  }
}

const signJwt = signJwtFactory({ jwt, secret: process.env.JWT_SECRET })

const verifyJwtFactory = (dependencies: IJwtFactory) => {
  const { jwt, secret } = dependencies
  return ({ token }: { token: string }): IJwtVerifyResponse => {
    let res: IJwtVerifyResponse
    jwt.verify(token, secret, (err, decoded: object) => {
      res = err ? { success: false, error: err.message } : { success: true, ...decoded }
    })
    return res
  }
}

const verifyJwt = verifyJwtFactory({
  jwt,
  secret: process.env.JWT_SECRET
})

const comparePasswordFactory = (dependencies: IComparePasswordFactory) => {
  const { bcrypt } = dependencies
  return async (password: string, hashedPassword: string): Promise<boolean> => {
    const isPasswordValid = await bcrypt.compare(password, hashedPassword)
    return isPasswordValid
  }
}

const comparePassword = comparePasswordFactory({ bcrypt })

export {
  signJwtFactory,
  signJwt,
  verifyJwtFactory,
  verifyJwt,
  comparePasswordFactory,
  comparePassword
}