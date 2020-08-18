/*
 * File google.ts
 * Author:         Navi
 * Created Date:   2020-08-12 11:43
 */
import { launch, LaunchOptions, Page } from "puppeteer";
import { mkdir } from "fs";
import { configAxios, googleDownload } from "./downloader";

// 浏览器开始运行
const run = async (url: string, country: string, config: LaunchOptions) => {
  const browser = await launch(config);
  const page = await browser.newPage();
  page.setDefaultNavigationTimeout(60000);

  await runInDevice(page, url, country);

  await browser.close();
};

// 获取图片链接
const getImgs = async (page: Page): Promise<string[]> => {
  // src="https://lh3.googleusercontent.com/rI4Zoy6Yf4XzTeobxuEuXlP2lih-PvBVuDILY0CyeUpvkZZ5ai_u13DYgOopkk0CwtE=w720-h310-rw"
  // srcset="https://lh3.googleusercontent.com/rI4Zoy6Yf4XzTeobxuEuXlP2lih-PvBVuDILY0CyeUpvkZZ5ai_u13DYgOopkk0CwtE=w1440-h620-rw 2x"
  return await page.$$eval(
    "body > div > div > c-wiz > div > div > div > div > main > c-wiz:nth-child(1) > c-wiz:nth-child(3) > c-wiz > div > div > div > button > img",
    (imgs) => {
      let srcs: string[] = [];
      imgs.forEach((img) => {
        let srcs: string[] = [];
        const src = img.getAttribute("src");
        const srcset = img.getAttribute("srcset");
        srcs.push(src);
        srcs.push(srcset.replace(/ 2x$/, ""));
      });
      return srcs;
    }
  );
};

// 获取图标链接
const getIcons = async (page: Page): Promise<string[]> => {
  // src="https://lh3.googleusercontent.com/1byNc8Mr2o1gV5Qd_42xF5y_RjTVUFhW_fKF8SMPfYbYoiAhSteBckNKwEU28hj0lXc=s180-rw"
  // srcset="https://lh3.googleusercontent.com/1byNc8Mr2o1gV5Qd_42xF5y_RjTVUFhW_fKF8SMPfYbYoiAhSteBckNKwEU28hj0lXc=s360-rw 2x"
  return await page.$eval(
    "body >  div > div > c-wiz > div > div > div > div > main > c-wiz:nth-child(1) > c-wiz:nth-child(1) > div > div > div > img",
    (icon) => {
      let srcs: string[] = [];
      const src = icon.getAttribute("src");
      const srcset = icon.getAttribute("srcset");
      srcs.push(src);
      srcs.push(srcset.replace(/ 2x$/, ""));
      return srcs;
    }
  );
};

// 获取视频连接
const getVideo = async (page: Page): Promise<string> => {
  // data-trailer-url="https://www.youtube.com/embed/kIe5CHbOZVE?ps=play&amp;vq=large&amp;rel=0&amp;autohide=1&amp;showinfo=0&amp;authuser=0"
  const element = await page.$(
    "body > div > div > c-wiz > div > div > div > div > main > c-wiz:nth-child(1) > c-wiz:nth-child(3) > c-wiz > div > div > div > div > div > button"
  );
  if (element) {
    return await page.$eval(
      "body > div > div > c-wiz > div > div > div > div > main > c-wiz:nth-child(1) > c-wiz:nth-child(3) > c-wiz > div > div > div > div > div > button",
      (video) => video.getAttribute("data-trailer-url")
    );
  }

  return "";
};

// 切换设备打开页面解析
const runInDevice = async (page: Page, url: string, country: string) => {
  try {
    await page.goto(url);
    // 等待google icon
    await page.waitForSelector(
      "body >  div > div > c-wiz > div > div > div > div > main > c-wiz:nth-child(1) > c-wiz:nth-child(1) > div > div > div > img"
    );
    // 等待截图展示加载图片
    await page.waitForSelector(
      "body > div > div > c-wiz > div > div > div > div > main > c-wiz:nth-child(1) > c-wiz:nth-child(3) > c-wiz > div > div > div > button > img"
    );
    // 稍等一会
    await page.waitFor(500);

    // 获取app标题
    let name = await page.$eval(
      "body > div > div > c-wiz > div > div > div > div > main > c-wiz:nth-child(1) > c-wiz:nth-child(1) > div > div > div > div > c-wiz:nth-child(1) > h1 > span",
      (title) => title.textContent
    );

    // 处理名字
    name = name.trim();

    // 建立文件夹
    mkdir(
      `${__dirname}/../images/google/${name}/${country}`,
      { recursive: true },
      (err) => {
        if (err) {
          console.log(err);
          process.exit();
        }
      }
    );

    const imgs = await getImgs(page);
    const icons = await getIcons(page);

    // 下载图片
    for (let i = 0; i < imgs.length; i++) {
      const paths = imgs[i].split("=");
      googleDownload(
        imgs[i],
        `${__dirname}/../images/google/${name}/${country}/${i + 1}_${
          paths[paths.length - 1]
        }.png`
      );
    }

    // 下载图标
    for (let i = 0; i < icons.length; i++) {
      const paths = icons[i].split("=");
      googleDownload(
        icons[i],
        `${__dirname}/../images/google/${name}/${country}/icon_${
          paths[paths.length - 1]
        }.png`
      );
    }

    console.log(`### ${name} video address: `, await getVideo(page));
  } catch (error) {
    if (error.name && error.name === "TimeoutError") {
      console.log("timeout, maybe you need set a proxy");
    }
    console.log(`### ${url} error:\n`);
    console.log(error);
  }
};

export default async (url: string, country: string, proxy: string) => {
  let args: string[] = [
    "--no-sandbox",
    "--disable-setuid-sandbox",
    "--incognito",
  ];

  if (proxy) {
    args.push(`--proxy-server=${proxy}`);
  }

  // chrome设置
  const config = {
    headless: true,
    ignoreHTTPSErrors: true,
    devTools: true,
    args,
    ignoreDefaultArgs: ["--enable-automation"],
  };

  // 设置下载代理
  if (proxy) {
    configAxios(proxy);
    console.log(`with proxy: ${proxy}`);
  }

  await run(url, country, config);
};
