export type Menu = {
  /** 菜单类型 101: 目录 102: 菜单 103: 按钮 */
  menuType: MenuType;
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
  children: Array<Menu>;
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
  DIRECTORY = 101,
  MENU = 102,
  BUTTON = 103
}
