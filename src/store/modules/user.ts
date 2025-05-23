import { defineStore } from "pinia";
import {
  type userType,
  store,
  router,
  resetRouter,
  routerArrays,
  storageLocal
} from "../utils";

import { useMultiTagsStoreHook } from "./multiTags";
import { setToken, removeToken, userKey } from "@/utils/auth";
import {
  type AccessToken,
  getAccessTokenApi,
  getLoginApi,
  logoutApi,
  refreshTokenApi
} from "@/api/login";
import type { UserInfo } from "@/api/system/user";
import { getMineApi } from "@/api/system/user";

export const useUserStore = defineStore("pure-user", {
  state: (): userType => ({
    //id
    id: storageLocal().getItem<UserInfo>(userKey)?.id ?? 0,
    // 头像
    avatar: storageLocal().getItem<UserInfo>(userKey)?.avatar ?? "",
    // 用户名
    username: storageLocal().getItem<UserInfo>(userKey)?.username ?? "",
    // 昵称
    nickname: storageLocal().getItem<UserInfo>(userKey)?.nickname ?? "",
    // 页面级别权限
    // roles: storageLocal().getItem<UserInfo>(userKey)?.roles ?? [],
    // 按钮级别权限
    permissions: storageLocal().getItem<UserInfo>(userKey)?.permissions ?? [],
    // 前端生成的验证码（按实际需求替换）
    verifyCode: "",
    // 判断登录页面显示哪个组件（0：登录（默认）、1：手机登录、2：二维码登录、3：注册、4：忘记密码）
    currentPage: 0,
    // 是否勾选了登录页的免登录
    isRemembered: false,
    // 登录页的免登录存储几天，默认7天
    loginDay: 7
  }),
  actions: {
    /** 存储ID */
    SET_ID(id: number) {
      this.id = id;
    },
    /** 存储头像 */
    SET_AVATAR(avatar: string) {
      this.avatar = avatar;
    },
    /** 存储用户名 */
    SET_USERNAME(username: string) {
      this.username = username;
    },
    /** 存储昵称 */
    SET_NICKNAME(nickname: string) {
      this.nickname = nickname;
    },
    /** 存储角色 */
    SET_ROLES(roles: Array<string>) {
      this.roles = roles;
    },
    /** 存储按钮级别权限 */
    SET_PERMS(permissions: Array<string>) {
      this.permissions = permissions;
    },
    /** 存储前端生成的验证码 */
    SET_VERIFYCODE(verifyCode: string) {
      this.verifyCode = verifyCode;
    },
    /** 存储登录页面显示哪个组件 */
    SET_CURRENTPAGE(value: number) {
      this.currentPage = value;
    },
    /** 存储是否勾选了登录页的免登录 */
    SET_ISREMEMBERED(bool: boolean) {
      this.isRemembered = bool;
    },
    /** 设置登录页的免登录存储几天 */
    SET_LOGINDAY(value: number) {
      this.loginDay = Number(value);
    },
    /** 登入 */
    async loginByUsername(data) {
      return new Promise((resolve, reject) => {
        getLoginApi(data)
          .then(data => {
            // if (data?.success) setToken(data.data);
            resolve(data);
          })
          .catch(error => {
            reject(error);
          });
      });
    },
    /** 前端登出（不调用接口） */
    async logOut() {
      await logoutApi();
      this.username = "";
      this.roles = [];
      this.permissions = [];
      removeToken();
      useMultiTagsStoreHook().handleTags("equal", [...routerArrays]);
      resetRouter();
      router.push("/login");
    },
    /** 获取token */
    async handAccessToken(data) {
      data.client_id = import.meta.env.VITE_OAUTH_CLIENT_ID;
      data.client_secret = import.meta.env.VITE_OAUTH_CLIENT_SECRET;
      return new Promise<AccessToken>((resolve, reject) => {
        getAccessTokenApi(data)
          .then(data => {
            if (data) {
              setToken(data);
              resolve(data);
            }
          })
          .catch(error => {
            reject(error);
          });
      });
    },
    /** 刷新`token` */
    async handRefreshToken(data) {
      return new Promise<AccessToken>((resolve, reject) => {
        refreshTokenApi(data)
          .then(data => {
            if (data) {
              setToken(data);
              resolve(data);
            }
          })
          .catch(error => {
            reject(error);
          });
      });
    },
    /** 获取用户信息 */
    async handGetUserInfo() {
      return new Promise<UserInfo>((resolve, reject) => {
        getMineApi()
          .then(data => {
            if (data) {
              resolve(data);
            }
          })
          .catch(error => {
            reject(error);
          });
      });
    }
  }
});

export function useUserStoreHook() {
  return useUserStore(store);
}
