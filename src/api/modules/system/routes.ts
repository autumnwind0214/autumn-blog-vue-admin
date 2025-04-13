import { http } from "@/utils/http";
import type { Menu } from "@/api/types/system/routes";

const prefix = "/system-api";

export const getAsyncRoutes = () => {
  return http.request<Array<Menu>>("get", `${prefix}/menu/getAsyncRoutes`);
};
