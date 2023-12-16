import axios from "axios";
import router from "@/router";
import { OpenAPI } from "../../generated";

// 携带凭证
OpenAPI.WITH_CREDENTIALS = true;
const baseUrl =
  process.env.NODE_ENV === "development"
    ? "http://localhost:8101"
    : "http://60.204.157.168:8091";

OpenAPI.BASE = baseUrl;
console.log("当前环境：", process.env.NODE_ENV, "请求地址", baseUrl);

axios.interceptors.request.use(
  function (config) {
    return config;
  },
  function (error) {
    // Do something with request error
    return Promise.reject(error);
  }
);
axios.interceptors.response.use(
  function (response) {
    console.log("响应拦截器,response=", response);
    // 服务端判断未登录
    if (response.data.code == 401) {
      router.push({
        path: `/user/login`,
      });
      return response;
    }
    return response;
  },
  function (error) {
    return Promise.reject(error);
  }
);
