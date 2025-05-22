import { http } from "@/utils/http";

const prefix = "/auth-api";

export type RouteVo = {
  /** 菜单类型 `0`代表菜单、`1`代表`iframe`、`2`代表外链、`3`代表按钮 */
  menuType: number;
  /** 元数据 */
  meta: Meta;
  /** 菜单名称 */
  name: string;
  /** 菜单图标 */
  icon: string;
  /** 菜单路由 */
  path: string;
  /** 权限标识 */
  permission: string;
  /** 菜单排序 */
  sort: number;
  /** 子级 */
  children: Array<RouteVo>;
};

export type MenuVo = {
  menuType: number;
  parentId: number;
  title: string;
  name: string;
  path: string;
  component: string;
  sort: number;
  redirect: string;
  icon: string;
  extraIcon: string;
  enterTransition: string;
  leaveTransition: string;
  activePath: string;
  auths: string;
  frameSrc: string;
  frameLoading: boolean;
  keepAlive: boolean;
  hiddenTag: boolean;
  fixedTag: boolean;
  showLink: boolean;
  showParent: boolean;
};

export type Meta = {
  icon: string;
  sort: number;
  title: string;
  auths: [];
  showLink: boolean;
  roles: [];
};

export const getAsyncRoutes = () => {
  return http.request<Array<RouteVo>>("get", `${prefix}/menu/getAsyncRoutes`);
};

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
