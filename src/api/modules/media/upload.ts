import { http } from "@/utils/http";

const prefix = "/media-service";

export const checkFile = (data?: object) => {
  return http.request<boolean>("post", `${prefix}/upload/checkFile`, { data });
};

export const checkChunk = (data?: object) => {
  return http.request<boolean>("post", `${prefix}/upload/checkChunk`, { data });
};

export const uploadChunk = (data?: object) => {
  return http.request<boolean>("post", `${prefix}/upload/chunk`, { data });
};

export const mergeChunks = (data?: object) => {
  return http.request<boolean>("post", `${prefix}/upload/mergeChunks`, {
    data
  });
};

export const uploadImg = (data?: object) => {
  return http.request<string>("post", `${prefix}/upload/img`, { data });
};
