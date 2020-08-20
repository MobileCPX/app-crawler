/*
 * File downloader.ts
 * Author:         Navi
 * Created Date:   2020-08-13 16:58
 */
import axios, { AxiosError } from "axios-https-proxy-fix";
import { createWriteStream } from "fs";
import { Page } from "puppeteer";
import { exec } from "child_process";

// 设置header
axios.defaults.headers["User-Agent"] =
  "Mozilla/5.0 (iPhone; CPU iPhone OS 11_0 like Mac OS X) AppleWebKit/604.1.38 (KHTML, like Gecko) Version/11.0 Mobile/15A372 Safari/604.1";

// 下载资源
const appleDownload = (url: string, path: string) => {
  axios({
    method: "get",
    url,
    responseType: "stream",
  })
    .then((res) => {
      res.data.pipe(createWriteStream(path));
      console.log("###", path, "done");
    })
    .catch((err: AxiosError) => {
      console.log("###", path, "\n###", url, "failed");
      console.log(err.message);
    });
};

// google 图片为webp格式，使用截图方法
const googleDownload = async (page: Page, url: string, path: string) => {
  try {
    await page.goto(url);
    await page.waitForSelector("img", { visible: true });
    const img = await page.$("img");
    await img.screenshot({
      path,
      omitBackground: true,
    });

    console.log("###", path, "done");
  } catch (err) {
    console.log("###", path, "\n###", url, "failed");
    console.log(err.message);
  }
};

// youtube视频下载
const youtubeDownload = (videoUrl: string, dirPath: string, proxy: string) => {
  if (!videoUrl) {
    console.log(`### no video address`);
    return;
  }

  console.log(`### downloading ${videoUrl} to ${dirPath}`);

  let cmd: string;
  if (proxy) {
    // youtube-dl --proxy "http://localhost:8001" url
    cmd = `youtube-dl --proxy "${proxy}" "${videoUrl}"`;
  } else {
    cmd = `youtube-dl "${videoUrl}"`;
  }

  exec(cmd, { cwd: dirPath }, (err, stdout, stderr) => {
    if (err) {
      console.log(`### download ${videoUrl} failed`);
      console.log(err);
      return;
    }

    if (stderr) {
      console.log(`### download ${videoUrl} failed`);
      console.log(stderr);
      return;
    }

    console.log(`### download ${videoUrl} success`);
    console.log(stdout);
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

export { configAxios, appleDownload, googleDownload, youtubeDownload };
