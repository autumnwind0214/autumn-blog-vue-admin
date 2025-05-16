import { message } from "@/utils/message";
import { getGlobalRouter } from "@/utils/router";
import { removeToken } from "@/utils/auth";

/**
 * 成功状态
 * @type {string}
 */
export const SUCCESS: number = 200;
/**
 * 无效Token
 * @type {string}
 */
export const TOKEN_FAIL: number = 201;
/**
 * 无效用户
 * @type {string}
 */
export const USER_FAIL: number = 202;

/**
 * @description: 校验网络请求状态码
 * @param {Number} status
 * @param msg
 * @return void
 */
export const checkStatus = (status: number, msg?: string) => {
  const router = getGlobalRouter();
  switch (status) {
    case 400:
      message(msg || "请求失败！请您稍后重试", { type: "error" });
      break;
    case 401:
      message(msg || "登录失效！请您重新登录", { type: "error" });
      removeToken();
      router.push({ path: "/login" });
      break;
    case 403:
      message(msg || "当前账号无权限访问！", { type: "error" });
      router.push({ path: "/error/403" });
      break;
    case 404:
      message(msg || "你所访问的资源不存在！", { type: "error" });
      router.push({ path: "/error/404" });
      break;
    case 405:
      message(msg || "请求方式错误！请您稍后重试", { type: "error" });
      break;
    case 408:
      message(msg || "请求超时！请您稍后重试", { type: "error" });
      break;
    case 409:
      message(msg || "请求冲突！", { type: "error" });
      break;
    case 422:
      message(msg || "请求参数异常！", { type: "error" });
      break;
    case 500:
      message(msg || "服务异常！", { type: "error" });
      router.push({ path: "/error/500" });
      break;
    case 502:
      message(msg || "网关错误！", { type: "error" });
      break;
    case 503:
      message(msg || "服务不可用！", { type: "error" });
      break;
    case 504:
      message(msg || "网关超时！", { type: "error" });
      break;
    default:
      message(msg || "请求失败！", { type: "error" });
      break;
  }
};
