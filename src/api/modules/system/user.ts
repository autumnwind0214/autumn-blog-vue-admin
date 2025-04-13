import { http } from "@/utils/http";
import type { ResultTable, UserInfo } from "@/api/types/system/user";

const prefix = "/system-api";

export const getUserInfo = () => {
  return http.request<UserInfo>("get", `${prefix}/user`);
};

/** 账户设置-个人信息 */
export const getMine = (data?: object) => {
  return http.request<UserInfo>("get", "/mine", { data });
};

/** 账户设置-个人安全日志 */
export const getMineLogs = (data?: object) => {
  return http.request<ResultTable>("get", "/mine-logs", { data });
};
