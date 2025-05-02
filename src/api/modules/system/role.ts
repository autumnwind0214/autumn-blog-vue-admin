import { http } from "@/utils/http";
import type { ResultTable } from "@/api/result";
const prefix = "/system-api";

/** 获取角色列表 */
export const getRoleListApi = (data?: object) => {
  return http.request<ResultTable>("post", `${prefix}/role/listPage`, { data });
};

/** 获取角色菜单列表 */
export const getRoleMenuIdApi = (id?: number) => {
  return http.request<Array<any>>("get", `${prefix}/role/roleMenuId/${id}`, {});
};

/** 获取所有菜单权限 */
export const getRoleMenuApi = () => {
  return http.request<Array<any>>("get", `${prefix}/role/roleMenus`, {});
};

/** 获取角色详情 */
export const editRoleStatusApi = (id: number, isLock: number) => {
  return http.request<boolean>(
    "put",
    `${prefix}/role/isLock/${id}/${isLock}`,
    {}
  );
};
