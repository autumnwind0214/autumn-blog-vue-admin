import "./reset.css";
import dayjs from "dayjs";
import roleForm from "../form/role.vue";
import editForm from "../form/index.vue";
import { zxcvbn } from "@zxcvbn-ts/core";
import { message } from "@/utils/message";
import userAvatar from "@/assets/user.jpg";
import { usePublicHooks } from "../../hooks";
import { addDialog } from "@/components/ReDialog";
import type { PaginationProps } from "@pureadmin/table";
import ReCropperPreview from "@/components/ReCropperPreview";
import type { FormItemProps, RoleFormItemProps } from "../utils/types";
import { getKeyList, isAllEmpty, deviceDetection } from "@pureadmin/utils";
import {
  ElForm,
  ElInput,
  ElFormItem,
  ElProgress,
  ElMessageBox
} from "element-plus";
import {
  type Ref,
  h,
  ref,
  toRaw,
  watch,
  computed,
  reactive,
  onMounted
} from "vue";
import {
  addUserApi,
  assignRoleApi,
  changePasswordApi,
  deleteUserApi,
  editUserApi,
  editUserStatusApi,
  getUserInfoApi,
  getUserListApi,
  getUserRoleIdsApi,
  uploadAvatarApi
} from "@/api/system/user";
import { getAllRoleListApi } from "@/api/system/role";
import { encryptByAES } from "@/utils/auth";
import { uploadImgBase64Api } from "@/api/media/upload";

export function useUser(tableRef: Ref) {
  const form = reactive({
    // 左侧部门树的id
    deptId: "",
    username: "",
    phone: "",
    status: ""
  });
  const formRef = ref();
  const ruleFormRef = ref();
  const dataList = ref([]);
  const loading = ref(true);
  // 上传头像信息
  const avatarInfo = ref();
  const switchLoadMap = ref({});
  const { switchStyle } = usePublicHooks();
  const treeData = ref([]);
  const treeLoading = ref(true);
  const selectedNum = ref(0);
  const pagination = reactive<PaginationProps>({
    total: 0,
    pageSize: 10,
    currentPage: 1,
    background: true
  });
  const columns: TableColumnList = [
    {
      label: "勾选列", // 如果需要表格多选，此处label必须设置
      type: "selection",
      fixed: "left",
      reserveSelection: true, // 数据刷新后保留选项
      selectable: selectable => {
        return ![1].includes(selectable.id);
      }
    },
    {
      label: "序号",
      type: "index",
      width: 90
    },
    {
      label: "用户头像",
      prop: "avatar",
      cellRenderer: ({ row }) => (
        <el-image
          fit="cover"
          preview-teleported={true}
          src={row.avatar || userAvatar}
          preview-src-list={Array.of(row.avatar || userAvatar)}
          class="w-[24px] h-[24px] rounded-full align-middle"
        />
      ),
      width: 90
    },
    {
      label: "用户名",
      prop: "username",
      minWidth: 130
    },
    {
      label: "用户昵称",
      prop: "nickname",
      minWidth: 130
    },
    {
      label: "性别",
      prop: "sex",
      minWidth: 90,
      cellRenderer: ({ row, props }) => (
        <el-tag
          size={props.size}
          type={row.sex === 1 ? "danger" : null}
          effect="plain"
        >
          {row.sex === 1 ? "女" : "男"}
        </el-tag>
      )
    },
    {
      label: "手机号码",
      prop: "mobile",
      minWidth: 90
    },
    {
      label: "邮箱",
      prop: "email",
      minWidth: 90
    },
    {
      label: "状态",
      prop: "status",
      minWidth: 90,
      cellRenderer: scope => (
        <el-switch
          size={scope.props.size === "small" ? "small" : "default"}
          loading={switchLoadMap.value[scope.index]?.loading}
          v-model={scope.row.status}
          active-value={1}
          inactive-value={0}
          active-text="已启用"
          inactive-text="已停用"
          inline-prompt
          style={switchStyle.value}
          disabled={scope.row.id === 1}
          onChange={() => onChange(scope as any)}
        />
      )
    },
    {
      label: "有效期",
      minWidth: 90,
      prop: "accountExpire",
      formatter: ({ accountExpire }) => {
        if (isAllEmpty(accountExpire)) {
          return "--";
        } else {
          return dayjs(accountExpire).format("YYYY-MM-DD HH:mm:ss");
        }
      }
    },
    {
      label: "上次登录时间",
      minWidth: 90,
      prop: "loginTime",
      formatter: ({ loginTime }) => {
        if (isAllEmpty(loginTime)) {
          return "--";
        } else {
          return dayjs(loginTime).format("YYYY-MM-DD HH:mm:ss");
        }
      }
    },
    {
      label: "操作",
      fixed: "right",
      width: 180,
      slot: "operation"
    }
  ];
  const buttonClass = computed(() => {
    return [
      "h-[20px]!",
      "reset-margin",
      "text-gray-500!",
      "dark:text-white!",
      "dark:hover:text-primary!"
    ];
  });
  // 重置的新密码
  const pwdForm = reactive({
    newPwd: "",
    confirmPwd: ""
  });
  const pwdProgress = [
    { color: "#e74242", text: "非常弱" },
    { color: "#EFBD47", text: "弱" },
    { color: "#ffa500", text: "一般" },
    { color: "#1bbf1b", text: "强" },
    { color: "#008000", text: "非常强" }
  ];
  // 当前密码强度（0-4）
  const curScore = ref();
  const roleOptions = ref([]);

  function onChange({ row, index }) {
    // 新增 ID 校验逻辑
    if (row.id === 1) {
      message("系统管理员不可停用", {
        type: "warning"
      });
      // 直接终止后续流程
      row.status === true;
      return;
    }
    ElMessageBox.confirm(
      `确认要<strong>${
        row.status === 0 ? "停用" : "启用"
      }</strong><strong style='color:var(--el-color-primary)'>${
        row.username
      }</strong>用户吗?`,
      "系统提示",
      {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        dangerouslyUseHTMLString: true,
        draggable: true
      }
    )
      .then(async () => {
        switchLoadMap.value[index] = Object.assign(
          {},
          switchLoadMap.value[index],
          {
            loading: true
          }
        );
        await editUserStatusApi(row?.id ?? null, row?.status ?? 0)
          .then(() => {
            setTimeout(() => {
              message("已成功修改用户状态", {
                type: "success"
              });
            }, 300);
          })
          .catch(() => {
            row.status === 0 ? (row.status = 1) : (row.status = 0);
          });
        switchLoadMap.value[index] = Object.assign(
          {},
          switchLoadMap.value[index],
          {
            loading: false
          }
        );
      })
      .catch(() => {
        row.status === 0 ? (row.status = 1) : (row.status = 0);
      });
  }

  function handleUpdate(row) {
    console.log(row);
  }

  async function handleDelete(row) {
    await deleteUserApi(row.id).then(() => {
      message(`您删除了用户编号为${row.id}的这条数据`, { type: "success" });
    });
    onSearch();
  }

  function handleSizeChange(val: number) {
    console.log(`${val} items per page`);
  }

  function handleCurrentChange(val: number) {
    console.log(`current page: ${val}`);
  }

  /** 当CheckBox选择项发生变化时会触发该事件 */
  function handleSelectionChange(val) {
    selectedNum.value = val.length;
    // 重置表格高度
    tableRef.value.setAdaptive();
  }

  /** 取消选择 */
  function onSelectionCancel() {
    selectedNum.value = 0;
    // 用于多选表格，清空用户的选择
    tableRef.value.getTableRef().clearSelection();
  }

  /** 批量删除 */
  async function onBatchDel() {
    // 返回当前选中的行
    const curSelected = tableRef.value.getTableRef().getSelectionRows();
    await deleteUserApi(getKeyList(curSelected, "id")).then(() => {
      // 接下来根据实际业务，通过选中行的某项数据，比如下面的id，调用接口进行批量删除
      message(`已删除用户编号为 ${getKeyList(curSelected, "id")} 的数据`, {
        type: "success"
      });
    });
    tableRef.value.getTableRef().clearSelection();
    onSearch();
  }

  async function onSearch() {
    loading.value = true;
    await getUserListApi(toRaw(form))
      .then(data => {
        dataList.value = data.records;
        pagination.total = data.total;
        pagination.pageSize = data.size;
        pagination.currentPage = data.current;
      })
      .finally(() => {
        setTimeout(() => {
          loading.value = false;
        }, 500);
      });
  }

  const resetForm = formEl => {
    if (!formEl) return;
    formEl.resetFields();
    onSearch();
  };

  async function openDialog(title = "新增", row?: FormItemProps) {
    if (row?.id) {
      row = await getUserInfoApi(row?.id);
    }
    addDialog({
      title: `${title}用户`,
      props: {
        formInline: {
          title,
          id: row?.id ?? null,
          birthday: row?.birthday ?? "",
          nickname: row?.nickname ?? "",
          username: row?.username ?? "",
          password: row?.password ?? "",
          newPassword: "",
          mobile: row?.mobile ?? "",
          email: row?.email ?? "",
          sex: row?.sex ?? "",
          status: row?.status ?? 1,
          accountExpire: row?.accountExpire ?? ""
        }
      },
      width: "46%",
      draggable: true,
      fullscreen: deviceDetection(),
      fullscreenIcon: true,
      closeOnClickModal: false,
      contentRenderer: () => h(editForm, { ref: formRef, formInline: null }),
      beforeSure: (done, { options }) => {
        const FormRef = formRef.value.getRef();
        const curData = options.props.formInline as FormItemProps;

        function chores() {
          message(`您${title}了账号为${curData.username}的这条数据`, {
            type: "success"
          });
          done(); // 关闭弹框
          onSearch(); // 刷新表格数据
        }

        FormRef.validate(async valid => {
          if (valid) {
            console.log("curData", curData);
            // 表单规则校验通过
            if (title === "新增") {
              // 实际开发先调用新增接口，再进行下面操作
              await addUserApi(curData);
              chores();
            } else {
              // 实际开发先调用修改接口，再进行下面操作
              await editUserApi(curData);
              chores();
            }
          }
        });
      }
    });
  }

  const cropRef = ref();

  /** 上传头像 */
  function handleUpload(row) {
    addDialog({
      title: "裁剪、上传头像",
      width: "40%",
      closeOnClickModal: false,
      fullscreen: deviceDetection(),
      contentRenderer: () =>
        h(ReCropperPreview, {
          ref: cropRef,
          imgSrc: row.avatar || userAvatar,
          onCropper: info => (avatarInfo.value = info)
        }),
      beforeSure: async done => {
        await uploadImgBase64Api({ base64: avatarInfo.value.base64 }).then(
          async res => {
            await uploadAvatarApi({
              userId: row.id,
              reviewUrl: res.reviewUrl
            }).then(() => {
              message("修改头像成功", { type: "success" });
            });
            done(); // 关闭弹框
            onSearch(); // 刷新表格数据
          }
        );
      },
      closeCallBack: () => cropRef.value.hidePopover()
    });
  }

  watch(
    pwdForm,
    ({ newPwd }) =>
      (curScore.value = isAllEmpty(newPwd) ? -1 : zxcvbn(newPwd).score)
  );

  /** 重置密码 */
  function handleReset(row) {
    addDialog({
      title: `重置 ${row.username} 用户的密码`,
      width: "30%",
      draggable: true,
      closeOnClickModal: false,
      fullscreen: deviceDetection(),
      contentRenderer: () => (
        <>
          <ElForm ref={ruleFormRef} model={pwdForm}>
            <ElFormItem
              prop="newPwd"
              rules={[
                {
                  required: true,
                  message: "请输入新密码",
                  trigger: "blur"
                }
              ]}
            >
              <ElInput
                clearable
                show-password
                type="password"
                v-model={pwdForm.newPwd}
                placeholder="请输入新密码"
              />
            </ElFormItem>
            <ElFormItem
              prop="confirmPwd"
              rules={[
                {
                  required: true,
                  message: "请确认新密码",
                  trigger: "blur"
                },
                {
                  validator: (rule, value, callback) => {
                    if (value !== pwdForm.newPwd) {
                      callback(new Error("两次输入的密码不一致"));
                    } else {
                      callback();
                    }
                  },
                  trigger: "blur"
                }
              ]}
            >
              <ElInput
                clearable
                show-password
                type="password"
                v-model={pwdForm.confirmPwd}
                placeholder="请确认新密码"
              />
            </ElFormItem>
          </ElForm>
          <div class="my-4 flex">
            {pwdProgress.map(({ color, text }, idx) => (
              <div
                class="w-[19vw]"
                style={{ marginLeft: idx !== 0 ? "4px" : 0 }}
              >
                <ElProgress
                  striped
                  striped-flow
                  duration={curScore.value === idx ? 6 : 0}
                  percentage={curScore.value >= idx ? 100 : 0}
                  color={color}
                  stroke-width={10}
                  show-text={false}
                />
                <p
                  class="text-center"
                  style={{ color: curScore.value === idx ? color : "" }}
                >
                  {text}
                </p>
              </div>
            ))}
          </div>
        </>
      ),
      closeCallBack: () => (pwdForm.newPwd = ""),
      beforeSure: done => {
        ruleFormRef.value.validate(async valid => {
          if (valid) {
            await changePasswordApi({
              userId: row.id,
              password: encryptByAES(pwdForm.newPwd),
              confirmPwd: encryptByAES(pwdForm.confirmPwd)
            }).then(() => {
              // 表单规则校验通过
              message(`已成功重置 ${row.username} 用户的密码`, {
                type: "success"
              });
            });
            console.log(pwdForm.newPwd);
            // 根据实际业务使用pwdForm.newPwd和row里的某些字段去调用重置用户密码接口即可
            done(); // 关闭弹框
            onSearch(); // 刷新表格数据
          }
        });
      }
    });
  }

  /** 分配角色 */
  async function handleRole(row) {
    // 选中的角色列表
    const ids = (await getUserRoleIdsApi(row.id)) ?? [];
    addDialog({
      title: `分配 ${row.username} 用户的角色`,
      props: {
        formInline: {
          username: row?.username ?? "",
          nickname: row?.nickname ?? "",
          roleOptions: roleOptions.value ?? [],
          ids
        }
      },
      width: "400px",
      draggable: true,
      fullscreen: deviceDetection(),
      fullscreenIcon: true,
      closeOnClickModal: false,
      contentRenderer: () => h(roleForm),
      beforeSure: async (done, { options }) => {
        const curData = options.props.formInline as RoleFormItemProps;
        await assignRoleApi({
          userId: row.id,
          roleIds: curData.ids
        }).then(() => {
          message(`已成功分配 ${row.username} 用户的角色`, {});
        });
        // 根据实际业务使用curData.ids和row里的某些字段去调用修改角色接口即可
        done(); // 关闭弹框
      }
    });
  }

  onMounted(async () => {
    // treeLoading.value = true;
    onSearch();

    // 角色列表
    roleOptions.value = await getAllRoleListApi();
  });

  return {
    form,
    loading,
    columns,
    dataList,
    treeData,
    treeLoading,
    selectedNum,
    pagination,
    buttonClass,
    deviceDetection,
    onSearch,
    resetForm,
    onBatchDel,
    openDialog,
    handleUpdate,
    handleDelete,
    handleUpload,
    handleReset,
    handleRole,
    handleSizeChange,
    onSelectionCancel,
    handleCurrentChange,
    handleSelectionChange
  };
}
