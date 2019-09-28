import { verifyJwt, IJwtVerifyResponse } from "./jwt.service";

export interface IVerifyRequestFactory {
  verifyJwt: typeof verifyJwt;
}

const verifyRequestFactory = (dependencies: IVerifyRequestFactory) => {
  const { verifyJwt } = dependencies;
  return ({ headers }: { headers: any }): IJwtVerifyResponse => {
    const { token } = headers;
    const payload = verifyJwt(token);
    if (!payload.success) {
      throw "Could not authenticate user";
    }
    return payload;
  };
};

const verifyRequest = verifyRequestFactory({ verifyJwt });

export { verifyRequest, verifyRequestFactory };
