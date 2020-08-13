/*
 * File downloader.ts
 * Author:         Navi
 * Created Date:   2020-08-13 16:58
 */
import axios, { AxiosError } from "axios-https-proxy-fix";
import { createWriteStream } from "fs";
import { devices } from "puppeteer";

// 设置header
axios.defaults.headers["User-Agent"] =
  "Mozilla/5.0 (iPhone; CPU iPhone OS 11_0 like Mac OS X) AppleWebKit/604.1.38 (KHTML, like Gecko) Version/11.0 Mobile/15A372 Safari/604.1";

// 下载资源
const download = (url: string, path: string) => {
  axios({
    method: "get",
    url,
    responseType: "stream",
  })
    .then((res) => {
      res.data.pipe(createWriteStream(path));
      console.log(url, "done");
    })
    .catch((err: AxiosError) => {
      console.log(url, "error");
      console.log(err.message);
    });
};

// 基础设置
const configAxios = (proxy: string) => {
  const params = proxy.split(":");
  const host = params[1].replace(/\/\//, ""); // 去http头
  const port = parseInt(params[2]);
  // 设置下载器代理
  axios.defaults.proxy = {
    host,
    port,
  };
};

export { configAxios, download };
