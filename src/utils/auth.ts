import Cookies from "js-cookie";
import { useUserStoreHook } from "@/store/modules/user";
import { storageLocal, isString, isIncludeAllChildren } from "@pureadmin/utils";
import CryptoJS from "crypto-js";
import type { AccessToken } from "@/api/login";
import { jwtDecode } from "jwt-decode";
import type { UserInfo } from "@/api/system/user";
import type { DecodeToken } from "@/api/login";

export const userKey = "user-info";
export const TokenKey = "authorized-token";
export const StateKey = "state";
/**
 * 通过`multiple-tabs`是否在`cookie`中，判断用户是否已经登录系统，
 * 从而支持多标签页打开已经登录的系统后无需再登录。
 * 浏览器完全关闭后`multiple-tabs`将自动从`cookie`中销毁，
 * 再次打开浏览器需要重新登录系统
 * */
export const multipleTabsKey = "multiple-tabs";

/** 获取`token` */
export function getToken(): AccessToken {
  // 此处与`TokenKey`相同，此写法解决初始化时`Cookies`中不存在`TokenKey`报错
  if (Cookies.get(TokenKey)) {
    return JSON.parse(Cookies.get(TokenKey));
  } else {
    return;
  }
}

/**
 * @description 设置`token`以及一些必要信息并采用无感刷新`token`方案
 * 无感刷新：后端返回`accessToken`（访问接口使用的`token`）、`refreshToken`（用于调用刷新`accessToken`的接口时所需的`token`，`refreshToken`的过期时间（比如30天）应大于`accessToken`的过期时间（比如2小时））、`expires`（`accessToken`的过期时间）
 * 将`accessToken`、`expires`、`refreshToken`这三条信息放在key值为authorized-token的cookie里（过期自动销毁）
 * 将`avatar`、`username`、`nickname`、`roles`、`permissions`、`refreshToken`、`expires`这七条信息放在key值为`user-info`的localStorage里（利用`multipleTabsKey`当浏览器完全关闭后自动销毁）
 */
export function setToken(data: AccessToken) {
  let expires = 0;
  const { accessToken, refreshToken } = data;
  const { isRemembered, loginDay } = useUserStoreHook();
  // 如果后端直接设置时间戳，将此处代码改为expires = data.expires，然后把上面的DataInfo<Date>改成DataInfo<number>即可
  expires = new Date(data.expiresAt).getTime();
  const cookieString = JSON.stringify({ accessToken, expires, refreshToken });
  const refreshExpires = new Date(refreshToken.expiresAt).getTime();
  refreshExpires > 0
    ? Cookies.set(TokenKey, cookieString, {
        expires: (refreshExpires - Date.now()) / 86400000
      })
    : Cookies.set(TokenKey, cookieString);

  Cookies.set(
    multipleTabsKey,
    "true",
    isRemembered
      ? {
          expires: loginDay
        }
      : {}
  );
  // 解析access_token 获取用户和权限信息
  const decodeToken = jwtDecode<DecodeToken>(data.accessToken);
  // 查询用户信息
  useUserStoreHook()
    .handGetUserInfo()
    .then((res: UserInfo) => {
      setUserKey({
        id: res.id,
        avatar: res.avatar,
        username: res.username,
        nickname: res.nickname,
        permissions: decodeToken.authorities
      });
    });

  function setUserKey({ id, avatar, username, nickname, permissions }) {
    useUserStoreHook().SET_ID(id);
    useUserStoreHook().SET_AVATAR(avatar);
    useUserStoreHook().SET_USERNAME(username);
    useUserStoreHook().SET_NICKNAME(nickname);
    useUserStoreHook().SET_PERMS(permissions);
    storageLocal().setItem(userKey, {
      avatar,
      username,
      nickname,
      permissions
    });
  }
}

/** 删除`token`以及key值为`user-info`的localStorage信息 */
export function removeToken() {
  Cookies.remove(TokenKey);
  Cookies.remove(multipleTabsKey);
  storageLocal().removeItem(userKey);
  storageLocal().removeItem(StateKey);
  const cookies = document.cookie.split(";");
  cookies.forEach(cookie => {
    const eqPos = cookie.indexOf("=");
    const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
  });
}

/** 格式化token（jwt格式） */
export const formatToken = (token: string): string => {
  return "Bearer " + token;
};

/** 是否有按钮级别的权限（根据登录接口返回的`permissions`字段进行判断）*/
export const hasPerms = (value: string | Array<string>): boolean => {
  if (!value) return false;
  const allPerms = "*:*:*";
  const { permissions } = useUserStoreHook();
  if (!permissions) return false;
  if (permissions.length === 1 && permissions[0] === allPerms) return true;
  const isAuths = isString(value)
    ? permissions.includes(value)
    : isIncludeAllChildren(value, permissions);
  return !!isAuths;
};

/**
 * 根据参数name获取地址栏的参数
 * @param name 地址栏参数的key
 * @returns key对用的值
 */
export const getQueryString = (name: string): string => {
  const reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
  const r = window.location.search.substr(1).match(reg);
  if (r != null) {
    return decodeURIComponent(r[2]);
  }
  return null;
};

/**
 * 生成 CodeVerifier
 *
 * return CodeVerifier
 */
export function generateCodeVerifier() {
  return generateRandomString(32);
}

/**
 * 生成随机字符串
 * @param length 随机字符串的长度
 * @returns 随机字符串
 */
export function generateRandomString(length: number) {
  let text = "";
  const possible =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}

/**
 * 生成 Code Challenge
 * @param code_verifier 上边生成的 CodeVerifier
 * @returns Code Challenge
 */
export function generateCodeChallenge(code_verifier: string) {
  return base64URL(CryptoJS.SHA256(code_verifier));
}

/**
 * 将字符串base64加密后在转为url string
 * @param str 字符串
 * @returns bese64转码后转为url string
 */
export function base64URL(str: CryptoJS.lib.WordArray) {
  return str
    .toString(CryptoJS.enc.Base64)
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
}

/**
 * 将字符串加密为Base64格式的
 * @param str 将要转为base64的字符串
 * @returns 返回base64格式的字符串
 */
export function base64Str(str: string) {
  return CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(str));
}

const key = "qwertyuiopasdfgh"; // 必须为 16 字节
const iv = "jklzxcvbnm123456"; // 必须为 16 字节
/**
 * AES 加密字符串
 */
export function encryptByAES(content: string) {
  const cipher = CryptoJS.AES.encrypt(content, CryptoJS.enc.Utf8.parse(key), {
    iv: CryptoJS.enc.Utf8.parse(iv),
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7
  });
  return cipher.toString();
}

/**
 * 使用 AES 解密字符串
 * @returns 解密后的明文字符串
 */
export function decryptByAES(content: string): string {
  const decipher = CryptoJS.AES.decrypt(content, CryptoJS.enc.Utf8.parse(key), {
    iv: CryptoJS.enc.Utf8.parse(iv),
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7
  });
  // 返回 UTF-8 明文
  return decipher.toString(CryptoJS.enc.Utf8);
}
