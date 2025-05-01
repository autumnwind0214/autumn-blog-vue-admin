import { http } from "@/utils/http";
import type { UserInfo } from "@/api/types/system/user";
import type { ResultTable } from "@/api/result";

const prefix = "/system-api";

export const getUserInfo = () => {
  return http.request<UserInfo>("get", `${prefix}/user`);
};

/** 账户设置-个人信息 */
// export const getMine = (data?: object) => {
//   return http.request<UserInfo>("get", "/mine", { data });
// };
//
// /** 账户设置-个人安全日志 */
// export const getMineLogs = (data?: object) => {
//   return http.request<ResultTable>("get", "/mine-logs", { data });
// };

/** 用户管理-列表 */
export const getUserList = (data?: object) => {
  return http.request<ResultTable>("post", `${prefix}/user/list`, { data });
};

/** 用户管理-新增 */
export const addUser = (data?: object) => {
  return http.request<boolean>("post", `${prefix}/user`, { data });
};

/** 用户管理-编辑 */
export const editUser = (data?: object) => {
  return http.request<boolean>("put", `${prefix}/user`, { data });
};

/** 用户管理-修改状态 */
export const editUserStatus = (id: number, status: number) => {
  return http.request<boolean>(
    "put",
    `${prefix}/user/status/${id}/${status}`,
    {}
  );
};

/** 用户管理-删除 */
export const deleteUser = (ids: Array<number>) => {
  return http.request<boolean>("delete", `${prefix}/user/${ids}`, {});
};

/** 用户管理-重置密码 */
export const changePassword = (data?: object) => {
  return http.request<boolean>("put", `${prefix}/user/changePassword`, {
    data
  });
};
