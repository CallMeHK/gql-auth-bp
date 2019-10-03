import { verifyJwt, IJwtVerifyResponse } from "./jwt.service";
import cookie from 'cookie'

export interface IVerifyRequestFactory {
  verifyJwt: typeof verifyJwt;
}

export interface ICookies {
  token?: string
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

export { verifyRequest, verifyRequestFactory };
