// src/utils/router.ts
import { useRouter, Router } from 'vue-router';

let router: Router;

export const setGlobalRouter = (r: Router) => {
  router = r;
};

export const getGlobalRouter = () => {
  if (!router) {
    throw new Error('Router 未初始化，请先调用 setGlobalRouter');
  }
  return router;
};
