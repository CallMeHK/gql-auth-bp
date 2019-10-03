import { userInfo } from "../authentication/verify-request.service"

const rootUserReducer = () => {
  return {
    userInfo,
  }
}

export { rootUserReducer }