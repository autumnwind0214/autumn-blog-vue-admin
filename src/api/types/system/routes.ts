export type Menu = {
  /** 唯一id */
  id: number;
  /** 菜单类型 101: 目录 102: 菜单 103: 按钮 */
  menuType: number;
  /** 元数据 */
  meta: Meta;
  /** 父级id */
  parentId: number;
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
  /** 菜单级别 */
  rank: number;
  /** 子级 */
  children: Array<Menu>;
};

export type Meta = {
  icon: string;
  sort: number;
  title: string;
  rank: number;
};
