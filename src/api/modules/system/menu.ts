import { http } from "@/utils/http";
import type { MenuVo } from "@/api/types/system/routes";

const prefix = "/system-api";

/** 系统管理-菜单管理-列表 */
export const getMenuList = () => {
  return http.request<Array<MenuVo>>("get", `${prefix}/menu/list`);
};

/** 系统管理-菜单管理-新增 */
export const addMenu = (data?: object) => {
  return http.request<boolean>("post", `${prefix}/menu`, { data });
};

/** 系统管理-菜单管理-修改 */
export const editMenu = (data?: object) => {
  return http.request<boolean>("put", `${prefix}/menu`, { data });
};

/** 系统管理-菜单管理-删除 */
export const deleteMenu = (id?: object) => {
  return http.request<boolean>("delete", `${prefix}/menu/${id}`);
};
