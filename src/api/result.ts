export type ResultTable = {
  /** 列表数据 */
  records: Array<any>;
  /** 总条目数 */
  total?: number;
  /** 是否存在下一页 */
  pages?: number;
  /** 当前页 */
  current?: number;
  /** 每页显示条数 */
  size?: number;
};
