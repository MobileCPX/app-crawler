/*
 * File apple.ts
 * Author:         Navi
 * Created Date:   2020-08-12 11:43
 */
import { devices, launch, LaunchOptions, Page } from "puppeteer";
import { mkdir, createWriteStream } from "fs";
import { request } from "https";

// 设备: 6.5英寸、5.5英寸、ipad pro 3、ipad pro 2
const MyDevices = {
  phone: devices["Pixel 2 XL"],
  desktop: devices["Pixel 2 XL landscape"],
};

// 下载图片资源
const download = (url: string, path: string) => {
  const req = request(url, (res) => {
    res.pipe(createWriteStream(path));
  });
  req.on("error", (err: Error) => {
    console.log(url, "error");
    console.log(err);
  });
  req.end(() => {
    console.log(url, "done");
  });
};

// 浏览器开始运行
const run = async (url: string, country: string, config: LaunchOptions) => {
  const browser = await launch(config);
  const page = await browser.newPage();
  page.setDefaultNavigationTimeout(60000);

  for (const key in MyDevices) {
    await runInDevice(page, MyDevices[key], url, country, key);
  }

  await browser.close();
};

// 切换设备打开页面解析
const runInDevice = async (
  page: Page,
  phone: devices.Device,
  url: string,
  country: string,
  folder: string
) => {
  // 模拟设备
  await page.emulate(phone);

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
    mkdir(
      `${__dirname}/../images/apple/${name}/${country}/${folder}`,
      { recursive: true },
      (err) => {
        if (err) {
          console.log(err);
          process.exit();
        }
      }
    );

    // 获取图片链接
    const imgs = await page.$$eval(
      "div.we-screenshot-viewer__screenshots > ul > li > picture > img",
      (imgs) => imgs.map((img) => img.getAttribute("src"))
    );

    // 获取图标链接
    const icon = await page.$eval(
      "picture.we-artwork.ember-view.product-hero__artwork.we-artwork--fullwidth.we-artwork--ios-app-icon > img",
      (icon) => icon.getAttribute("src")
    );

    // 下载图片
    for (let i = 0; i < imgs.length; i++) {
      download(
        imgs[i],
        `${__dirname}/../images/apple/${name}/${country}/${folder}/${i + 1}.png`
      );
    }
    // 下载图标
    download(
      icon,
      `${__dirname}/../images/apple/${name}/${country}/${folder}/icon.png`
    );

    // 点击ipad选项
    await page.tap("ul.gallery-nav__items > li:nth-child(2) >a");
    // 等待截图展示加载图片
    await page.waitForSelector(
      "div.we-screenshot-viewer__screenshots > ul > li > picture > img"
    );

    // 稍等一会
    await page.waitFor(500);

    // 获取图片链接
    const ipadImgs = await page.$$eval(
      "div.we-screenshot-viewer__screenshots > ul > li > picture > img",
      (imgs) => imgs.map((img) => img.getAttribute("src"))
    );

    // 下载ipad图片
    for (let i = 0; i < ipadImgs.length; i++) {
      download(
        ipadImgs[i],
        `${__dirname}/../images/apple/${name}/${country}/${folder}/ipad${
          i + 1
        }.png`
      );
    }
  } catch (error) {
    console.log(`${url} error:\n`);
    console.log(error);
  }
};

export default async (url: string, country: string, proxy: string) => {
  const config = {
    headless: true,
    ignoreHTTPSErrors: true,
    devTools: true,
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--incognito",
      `--proxy-server=${proxy}`,
      // `--lang=${info.lang}`
    ],
    ignoreDefaultArgs: ["--enable-automation"],
  };

  if (proxy) {
    console.log(`with proxy: ${proxy}`);
  }

  await run(url, country, config);
};
