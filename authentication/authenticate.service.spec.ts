import { authenticateUserFactory } from "./authenticate.service";

describe("#authenticateUserFactory", () => {
  let pool: any;
  let getUserCreds: any, signJwt: any, comparePassword: any;

  beforeEach(() => {
    signJwt = jest.fn().mockReturnValue("token");
  });
  it("returns token on success", async () => {
    getUserCreds = () =>
      jest
        .fn()
        .mockResolvedValue({ id: 1, name: "test", password: "password" });
    comparePassword = jest.fn().mockResolvedValue(true);
    const dependencies: any = {
      getUserCreds,
      comparePassword,
      signJwt
    };
    const authenticateUser = authenticateUserFactory(dependencies)(pool);
    const authRes: any = await authenticateUser("user", "pw");
    expect(authRes).toEqual({ success: true, token: "token" });
  });
  it("does not return token on failure", async () => {
    getUserCreds = () =>
      jest
        .fn()
        .mockResolvedValue({ id: 1, name: "test", password: "password" });
    comparePassword = jest.fn().mockResolvedValue(false);
    const dependencies: any = {
      getUserCreds,
      comparePassword,
      signJwt
    };
    const authenticateUser = authenticateUserFactory(dependencies)(pool);
    const authRes: any = await authenticateUser("user", "pw");
    expect(authRes).toEqual({ success: false, token: null });
  });
  it("does not return token on error", async () => {
    comparePassword = jest.fn().mockResolvedValue(true);
    getUserCreds = () => jest.fn().mockRejectedValue("Failed to find user");
    const dependencies: any = {
      getUserCreds,
      comparePassword,
      signJwt
    };
    const authenticateUser = authenticateUserFactory(dependencies)(pool);
    const authRes: any = await authenticateUser("user", "pw");
    expect(authRes).toEqual({ success: false, token: null });
  });
});
