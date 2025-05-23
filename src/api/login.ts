import { http } from "@/utils/http";
import { base64Str } from "@/utils/auth";

const prefix = "/auth-api";

export type AccessToken = {
  accessToken: string;
  tokenType: string;
  expiresAt: Date;
  issuedAt: Date;
  expires: number;
  issued: number;
  refreshToken: {
    tokenValue: string;
    expiresAt: Date;
    issuedAt: Date;
    expires: number;
    issued: number;
  };
};

export type DecodeToken = {
  authorities: Array<string>;
  scope: Array<string>;
  // 唯一标识 用户名
  uniqueId: string;
};

export type RefreshTokenResult = {
  /** `token` */
  accessToken: string;
  /** 用于调用刷新`accessToken`的接口时所需的`token` */
  refreshToken: string;
  /** `accessToken`的过期时间（格式'xxxx/xx/xx xx:xx:xx'） */
  expires: number;
};

export type Captcha = {
  captchaId: string;
  code: string;
  imageData: string;
};

/** 登录 */
export const getLoginApi = (data?: object) => {
  return http.post(`${prefix}/login`, {
    data,
    headers: {
      "Content-Type": "multipart/form-data"
    }
  });
};

/** 刷新token */
export const refreshTokenApi = (data?: any) => {
  const headers: any = {
    "Content-Type": "application/x-www-form-urlencoded"
  };

  if (data.client_id && data.client_secret) {
    // 添加 Basic Auth 认证
    headers.Authorization = `Basic ${base64Str(`${data.client_id}:${data.client_secret}`)}`;
    // 移除入参中的key
    delete data.client_id;
    delete data.client_secret;
  }
  return http.request<AccessToken>("post", `${prefix}/oauth2/token`, {
    data,
    headers
  });
};

// 获取图形验证码
export const getCaptchaApi = () => {
  return http.request<Captcha>("get", `${prefix}/getCaptcha`, {});
};

// 获取访问令牌
export const getAccessTokenApi = (data: any) => {
  const headers: any = {
    "Content-Type": "application/x-www-form-urlencoded"
  };
  if (data.client_secret) {
    // 设置客户端的basic认证
    headers.Authorization = `Basic ${base64Str(`${data.client_id}:${data.client_secret}`)}`;
    // 移除入参中的key
    delete data.client_id;
    delete data.client_secret;
  }
  return http.request<AccessToken>("post", `${prefix}/oauth2/token`, {
    data,
    headers
  });
};

// 退出登录
export const logoutApi = () => {
  return http.request("post", `${prefix}/logout`, {});
};
