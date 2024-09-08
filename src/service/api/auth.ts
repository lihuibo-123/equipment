import { request } from '../request';

/**
 * Login
 *
 * @param userName User name
 * @param password Password
 */
export function fetchLogin(userName: string, password: string) {
  return request({
    // url: '/auth/login',
    url: 'iotapi/login',
    method: 'post',
    headers: {
      'content-type': 'text/plain'
    },
    data: {
      username: userName.trim(), password: password
    }
  });
}

/** Get user info */
export function gettoken(name:string) {
  return request({ url: `/iotapi/token?name=${name}` });
}

/**
 * Refresh token
 *
 * @param refreshToken Refresh token
 */
export function fetchRefreshToken(refreshToken: string) {
  return request<Api.Auth.LoginToken>({
    url: '/auth/refreshToken',
    method: 'post',
    data: {
      refreshToken
    }
  });
}

/**
 * return custom backend error
 *
 * @param code error code
 * @param msg error message
 */
export function fetchCustomBackendError(code: string, msg: string) {
  return request({ url: '/auth/error', params: { code, msg } });
}
