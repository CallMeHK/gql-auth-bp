import { verifyJwt, IJwtVerifyResponse } from "./jwt.service";
import cookie from 'cookie'
import { IContext } from "../resolver-factories/postgres/make-query";

export interface IVerifyRequestFactory {
  verifyJwt: typeof verifyJwt;
}

export interface ICookies {
  token?: string
}

export interface IUserInfoFactory {
  verifyRequest: typeof verifyRequest
}

export interface IUserInfoResponse {
  success: boolean,
  error?: string,
  data?: {
    id: number,
    name: string,
    iat: number
  }
}

const verifyRequestFactory = (dependencies: IVerifyRequestFactory) => {
  const { verifyJwt } = dependencies;
  return <T>(
    { headers }: { headers: any },
    callback: (payload?: IJwtVerifyResponse) => T
  ): IJwtVerifyResponse | T => {
    const cookies = cookie.parse(headers.cookie) as ICookies
    const payload = verifyJwt(cookies);
    if (!payload.success) {
      return payload;
    }
    return callback(payload);
  };
};

const verifyRequest = verifyRequestFactory({ verifyJwt });

const parseUserInfo = (payload: IJwtVerifyResponse) =>
  ({
    success: payload.success,
    error: payload.error,
    data: {
      id: payload.id,
      name: payload.name,
      iat: payload.iat
    }
  })

const userInfoFactory = (dependencies: IUserInfoFactory) => {
  const { verifyRequest } = dependencies
  return (_: any, context: IContext): IUserInfoResponse => {
    return verifyRequest<IUserInfoResponse>(context, parseUserInfo)
  }
}

const userInfo = userInfoFactory({ verifyRequest })

export { verifyRequest, verifyRequestFactory, userInfo };
