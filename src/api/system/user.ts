import { http } from "@/utils/http";
import type { ResultTable } from "@/api/result";
import type { FormItemProps } from "@/views/system/user/utils/types";

export type LoginUser = {
  id: number;
  avatar: string;
  nickname: string;
  permissions: Array<string>;
};

export type UserInfo = {
  /** id */
  id: number;
  /** 头像 */
  avatar: string;
  /** 用户名 */
  username: string;
  /** 昵称 */
  nickname: string;
  /** 邮箱 */
  email: string;
  /** 联系电话 */
  mobile: string;
  /** 简介 */
  remark: string;
  /** 按钮级别权限 */
  permissions: Array<string>;
  /** 当前登录用户的角色 */
  roles: Array<string>;
};

export type MineInfo = {
  id: number;
  avatar: string;
  username: string;
  nickname: string;
};

const prefix = "/auth-api";

export const getUserInfoApi = (id?: number) => {
  return http.request<FormItemProps>("get", `${prefix}/user/${id}`, {});
};

/** 账户设置-个人信息 */
export const getMine = () => {
  return http.request<UserInfo>("get", `${prefix}/user/mine`, {});
};

/** todo 账户设置-个人安全日志 */
export const getMineLogs = (data?: object) => {
  return http.request<ResultTable>("get", "/mine-logs", { data });
};

/** 账户设置-修改信息  */
export const editMine = (data?: object) => {
  return http.request<boolean>("put", `${prefix}/user/mine`, { data });
};

/** 用户管理-列表 */
export const getUserList = (data?: object) => {
  return http.request<ResultTable>("post", `${prefix}/user/listPage`, { data });
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

/** 用户管理-用户角色 */
export const getUserRoleIds = (userId?: object) => {
  return http.request<Array<number>>(
    "get",
    `${prefix}/user/roleIds/${userId}`,
    {}
  );
};

/** 用户管理-分配角色 */
export const assignRoleApi = (data?: object) => {
  return http.request<boolean>("put", `${prefix}/user/assignRole`, { data });
};

/** 用户管理-上传头像 */
export const uploadAvatarApi = (data?: object) => {
  return http.request<boolean>("put", `${prefix}/user/uploadAvatar`, { data });
};
