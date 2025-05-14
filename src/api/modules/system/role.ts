import { http } from "@/utils/http";
import type { ResultTable } from "@/api/result";

const prefix = "/auth-api";

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

/** 获取所有角色列表 */
export const getAllRoleListApi = () => {
  return http.request<Array<any>>("get", `${prefix}/role/listAll`, {});
};

/** 修改角色锁定 */
export const editRoleStatusApi = (id: number, isLock: number) => {
  return http.request<boolean>(
    "put",
    `${prefix}/role/isLock/${id}/${isLock}`,
    {}
  );
};

/** 修改角色权限 */
export const roleAuthApi = (data?: object) => {
  return http.request<boolean>("put", `${prefix}/role/auth`, { data });
};

/** 新增角色 */
export const addRoleApi = (data?: object) => {
  return http.request<boolean>("post", `${prefix}/role`, { data });
};

/** 修改角色 */
export const editRoleApi = (data?: object) => {
  return http.request<boolean>("put", `${prefix}/role`, { data });
};

/** 删除角色 */
export const delRoleApi = (ids?: Array<number>) => {
  return http.request<boolean>("delete", `${prefix}/role/${ids}`, {});
};
