import { verifyRequestFactory } from "./verify-request.service";

describe("#verifyRequestFactory", () => {
  let verifyJwt: any;
  it("returns payload on successful verification", () => {
    const payload: any = {
      success: true,
      id: 1,
      name: "testname",
      iat: 123123,
      error: ""
    };
    verifyJwt = jest.fn().mockReturnValue(payload);
    const verifyRequest = verifyRequestFactory({ verifyJwt });
    expect(verifyRequest({ headers: { token: "testToken" } })).toEqual(payload);
  });
  it("throws error on failed verification", () => {
    const err: string = "Could not authenticate user";
    verifyJwt = jest.fn().mockRejectedValue(err);
    const verifyRequest = verifyRequestFactory({ verifyJwt });
    expect(verifyRequest({ headers: { token: "testToken" } })).toThrow(err);
  });
});
