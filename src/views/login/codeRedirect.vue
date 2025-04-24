<script setup lang="ts">
import { useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import {
  getQueryString,
  removeToken,
  generateCodeVerifier
} from "@/utils/auth";
import { message } from "@/utils/message";
import { getTopMenu, initRouter } from "@/router/utils";
import { useUserStoreHook } from "@/store/modules/user";

const router = useRouter();

const { t } = useI18n();

// 生成state
let state: string = generateCodeVerifier();

// 获取地址栏授权码
const code = getQueryString("code");

if (code) {
  // 从缓存中获取 codeVerifier
  const state = localStorage.getItem("state");
  // 校验state，防止cors
  const urlState = getQueryString("state");
  if (urlState !== state) {
    message("state校验失败.", { type: "error" });
  } else {
    const data = {
      grant_type: "authorization_code",
      client_id: import.meta.env.VITE_OAUTH_CLIENT_ID,
      client_secret: import.meta.env.VITE_OAUTH_CLIENT_SECRET,
      redirect_uri: import.meta.env.VITE_CODE_REDIRECT_URI,
      code,
      state
    };
    useUserStoreHook()
      .handAccessToken(data)
      .then((res: any) => {
        // 获取用户信息
        useUserStoreHook()
          .handGetUserInfo()
          .then(() => {
            // todo 获取后端路由
            // return initRouter()
            //   .then(() => {
            //     router.push(getTopMenu(true).path).then(() => {
            //       message(t("login.pureLoginSuccess"), { type: "success" });
            //     });
            //   })
            //   .catch((e: any) => {
            //     console.log("getAsyncRoutes fail: ", e);
            //   });
          });
      });
  }
} else {
  gotoLogin();
}

function gotoLogin() {
  // 缓存state
  localStorage.setItem("state", state);
  window.location.href = `${import.meta.env.VITE_OAUTH_ISSUER}/oauth2/authorize?client_id=${
    import.meta.env.VITE_OAUTH_CLIENT_ID
  }&response_type=code&scope=openid%20profile%20message.read%20message.write&redirect_uri=${
    import.meta.env.VITE_CODE_REDIRECT_URI
  }&state=${state}`;
}
</script>

<template>加载中...</template>
