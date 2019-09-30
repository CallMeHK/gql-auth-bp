import { verifyJwt, IJwtVerifyResponse } from "./jwt.service";

export interface IVerifyRequestFactory {
  verifyJwt: typeof verifyJwt;
}

const verifyRequestFactory = (dependencies: IVerifyRequestFactory) => {
  const { verifyJwt } = dependencies;
  return <T>(
    { headers }: { headers: any },
    callback: (payload?: IJwtVerifyResponse) => T
  ): IJwtVerifyResponse | T => {
    const { token } = headers;
    const payload = verifyJwt(token);
    if (!payload.success) {
      return payload;
    }
    return callback(payload);
  };
};

const verifyRequest = verifyRequestFactory({ verifyJwt });

export { verifyRequest, verifyRequestFactory };
