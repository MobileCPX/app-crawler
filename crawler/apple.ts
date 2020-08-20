/*
 * File apple.ts
 * Author:         Navi
 * Created Date:   2020-08-12 11:43
 */
import { launch, LaunchOptions, Page } from "puppeteer";
import { mkdir } from "fs";
import { dirname } from "path";
import { configAxios, appleDownload } from "./downloader";

// 浏览器开始运行
const run = async (url: string, country: string, config: LaunchOptions) => {
  const browser = await launch(config);
  const page = await browser.newPage();
  page.setDefaultNavigationTimeout(60000);

  // 设备: 6.5英寸、5.5英寸、ipad pro 3、ipad pro 2
  await runInDevice(page, url, country);

  await browser.close();
};

// 获取图片链接
const getImgs = async (page: Page): Promise<string[]> => {
  // srcset="https://is4-ssl.mzstatic.com/image/thumb/PurpleSource114/v4/21/12/c8/2112c844-5eff-a3e4-a224-6f9537959c96/e83018c5-f420-4654-ab03-c778fdbe2151__U6392_U884c_U699c_copy_2.png/300x0w.png 1x,https://is4-ssl.mzstatic.com/image/thumb/PurpleSource114/v4/21/12/c8/2112c844-5eff-a3e4-a224-6f9537959c96/e83018c5-f420-4654-ab03-c778fdbe2151__U6392_U884c_U699c_copy_2.png/600x0w.png 2x"
  return await page.$$eval(
    "div.we-screenshot-viewer__screenshots > ul > li > picture > source",
    (imgs) => {
      let srcs: string[] = [];
      imgs.forEach((img) => {
        const srcset = img.getAttribute("srcset");
        srcs.push(...srcset.replace(/ 2x$/, "").split(" 1x,"));
      });
      return srcs;
    }
  );
};

// 获取图标链接
const getIcons = async (page: Page): Promise<string[]> => {
  return await page.$eval(
    "picture.we-artwork.ember-view.product-hero__artwork.we-artwork--fullwidth.we-artwork--ios-app-icon > source",
    (icon) => {
      let srcs: string[] = [];
      const srcset = icon.getAttribute("srcset");
      srcs.push(...srcset.replace(/ 2x$/, "").split(" 1x,"));
      return srcs;
    }
  );
};

// 切换设备打开页面解析
const runInDevice = async (page: Page, url: string, country: string) => {
  try {
    await page.goto(url);
    // 等待app icon
    await page.waitForSelector(
      "picture.we-artwork.ember-view.product-hero__artwork.we-artwork--fullwidth.we-artwork--ios-app-icon > img"
    );
    // 等待截图展示加载图片
    await page.waitForSelector(
      "div.we-screenshot-viewer__screenshots > ul > li > picture > img"
    );
    // 稍等一会
    await page.waitFor(500);

    // 获取app标题
    let name = await page.$eval(
      "h1.product-header__title.app-header__title",
      (title) => title.textContent
    );

    // 处理名字
    name = name.trim();
    name = name.split("\n")[0];
    name = name.trim();

    // 建立文件夹
    const basePath = `${dirname(__dirname)}/downloads/apple/${name}/${country}`;
    mkdir(basePath, { recursive: true }, (err) => {
      if (err) {
        console.log(err);
        process.exit();
      }
    });

    const imgs = await getImgs(page);
    const icons = await getIcons(page);

    // 下载图片
    for (let i = 0; i < imgs.length; i++) {
      const paths = imgs[i].split("/");
      appleDownload(imgs[i], `${basePath}/${i + 1}_${paths[paths.length - 1]}`);
    }

    // 下载图标
    for (let i = 0; i < icons.length; i++) {
      const paths = icons[i].split("/");
      appleDownload(icons[i], `${basePath}/icon_${paths[paths.length - 1]}`);
    }

    // 点击ipad选项
    await page.tap("ul.gallery-nav__items > li:nth-child(2) >a");
    // 等待截图展示加载图片
    await page.waitForSelector(
      "div.we-screenshot-viewer__screenshots > ul > li > picture > img"
    );

    // 稍等一会
    await page.waitFor(500);

    // 获取ipad图片链接
    const ipadImgs = await getImgs(page);

    // 下载ipad图片
    for (let i = 0; i < ipadImgs.length; i++) {
      const paths = imgs[i].split("/");
      appleDownload(
        ipadImgs[i],
        `${basePath}/ipad${i + 1}_${paths[paths.length - 1]}`
      );
    }

    // todo 如果存在视频
  } catch (error) {
    if (error.name && error.name === "TimeoutError") {
      console.log("timeout, maybe you need a proxy");
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
    devTools: false,
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
