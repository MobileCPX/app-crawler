/*
 * File apple.ts
 * Author:         Navi
 * Created Date:   2020-08-12 11:43
 */
import { devices, launch, LaunchOptions, Page } from "puppeteer";
import { mkdir } from "fs";

const inch5 = devices["Nexus 7"];
const inch6 = devices["Nexus 7"];

// 6.5英寸、5.5英寸、ipad pro 3、ipad pro 2
const run = async (url: string, country: string, config: LaunchOptions) => {
  const browser = await launch(config);
  const page = await browser.newPage();
  page.setDefaultNavigationTimeout(60000);

  await runInDevice(page, devices["Pixel 2"], url, "5.5");
  // await runInDevice(page, devices["Pixel 2"], url);
  // await runInDevice(page, devices["Pixel 2"], url);
  // await runInDevice(page, devices["Pixel 2"], url);

  await browser.close();
};

const runInDevice = async (
  page: Page,
  phone: devices.Device,
  url: string,
  folder: string
) => {
  // 模拟设备
  await page.emulate(phone);

  try {
    await page.goto(url);
    // 等待app icon
    await page.waitForSelector(
      "picture.we-artwork.ember-view.product-hero__artwork.we-artwork--fullwidth.we-artwork--ios-app-icon > img",
      {
        visible: true,
        timeout: 60000,
      }
    );
    // 等待截图展示加载图片
    await page.waitForSelector("li > picture > img", {
      visible: true,
      timeout: 0,
    });

    // 选取图片
    const imgs = await page.$$(
      "div.we-screenshot-viewer__screenshots > ul > li > picture > img"
    );

    // 获取图标
    const icon = await page.$(
      "picture.we-artwork.ember-view.product-hero__artwork.we-artwork--fullwidth.we-artwork--ios-app-icon > img"
    );

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
      `${__dirname}/../images/apple/${name}/${folder}`,
      { recursive: true },
      (err, path) => {
        if (err) {
          console.log(err);
          process.exit();
        }
      }
    );

    // 下载图片
    for (let i = 0; i < imgs.length; i++) {
      await imgs[i].screenshot({
        path: `./images/apple/${name}/${folder}/${i + 1}.png`,
        omitBackground: true,
      });
    }

    // 下载图标
    await icon.screenshot({
      path: `./images/apple/${name}/${folder}/icon.png`,
      omitBackground: true,
    });
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
