import { http } from "@/utils/http";
import { base64Str } from "@/utils/auth";

const prefix = "/system-api";

export type AccessToken = {
  accessToken: string;
  tokenType: string;
  expiresAt: number;
  issuedAt: number;
  refreshToken: {
    tokenValue: string;
    expiresAt: number;
    issuedAt: number;
  };
};

export type DecodeToken = {
  payload: {
    authorities: Array<string>;
  };
  scope: Array<string>;
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
export const getLogin = (data?: object) => {
  return http.post(`${prefix}/login`, {
    data,
    headers: {
      "Content-Type": "multipart/form-data"
    }
  });
};

/** 刷新token */
export const refreshTokenApi = (data?: object) => {
  return http.request<AccessToken>("post", `${prefix}/refresh-token`, {
    data
  });
};

// 获取图形验证码
export const getCaptcha = () => {
  return http.request<Captcha>("get", `${prefix}/getCaptcha`, {});
};

export const getAccessToken = (data: any) => {
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
