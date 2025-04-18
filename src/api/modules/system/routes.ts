import { http } from "@/utils/http";
import type { RouteVo } from "@/api/types/system/routes";

const prefix = "/system-api";

export const getAsyncRoutes = () => {
  return http.request<Array<RouteVo>>("get", `${prefix}/menu/getAsyncRoutes`);
};
