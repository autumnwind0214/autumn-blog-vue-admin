import { http } from "@/utils/http";

const prefix = "/media-service";

export type UploadResult = {
  reviewUrl: string;
  originName: string;
  filename: string;
};

export const checkFileApi = (data?: object) => {
  return http.request<boolean>("post", `${prefix}/upload/checkFile`, { data });
};

export const checkChunkApi = (data?: object) => {
  return http.request<boolean>("post", `${prefix}/upload/checkChunk`, { data });
};

export const uploadChunkApi = (data?: object) => {
  return http.request<boolean>("post", `${prefix}/upload/chunk`, { data });
};

export const mergeChunksApi = (data?: object) => {
  return http.request<boolean>("post", `${prefix}/upload/mergeChunks`, {
    data
  });
};

export const uploadFileApi = (data?: object) => {
  return http.request<UploadResult>("post", `${prefix}/upload/file`, {
    data,
    headers: {
      "Content-Type": "multipart/form-data"
    }
  });
};

export const uploadImgBase64Api = (data?: object) => {
  return http.request<UploadResult>("post", `${prefix}/upload/imgBase64`, {
    data,
    headers: {
      "Content-Type": "multipart/form-data"
    }
  });
};
