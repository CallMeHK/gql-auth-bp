import { verifyRequestFactory } from "./verify-request.service";

describe("#verifyRequestFactory", () => {
  let verifyJwt: any;
  const testHeaders: any = { headers: { token: "testToken" } };
  const payload: any = {
    success: true,
    id: 1,
    name: "testname",
    iat: 123123,
    error: ""
  };
  const badPayload: any = {
    success: false,
    error: "Could not find user"
  };

  describe("on successful verification", () => {
    it("executes callback", () => {
      verifyJwt = jest.fn().mockReturnValue(payload);
      const verifyRequest = verifyRequestFactory({ verifyJwt });
      interface callbackReturn {
        test: boolean;
      }
      const callback = (): callbackReturn => ({ test: true });
      const result = verifyRequest<callbackReturn>(testHeaders, callback);
      expect(result).toEqual({ test: true });
    });

    it("executes callback with payload args", () => {
      verifyJwt = jest.fn().mockReturnValue(payload);
      const verifyRequest = verifyRequestFactory({ verifyJwt });
      const callback = (pl: any): any => ({ test: true, ...pl });
      const result = verifyRequest<any>(testHeaders, callback);
      expect(result).toEqual({ test: true, ...payload });
    });
  });

  describe("on unsuccessful verification", () => {
    it("returns fail object", () => {
      verifyJwt = jest.fn().mockReturnValue(badPayload);
      const verifyRequest = verifyRequestFactory({ verifyJwt });
      const callback = jest.fn().mockReturnValue({ test: true });
      const result = verifyRequest<any>(testHeaders, callback);
      expect(callback).not.toBeCalled();
      expect(result).toBe(badPayload);
    });
  });
});
