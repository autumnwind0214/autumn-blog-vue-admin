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

enum MenuType {
  MENU = 0,
  IFRAME = 1,
  BACKLINK = 2,
  BUTTON = 3
}
