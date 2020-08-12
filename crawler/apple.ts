/*
 * File apple.ts
 * Author:         Navi
 * Created Date:   2020-08-12 11:43
 */
import { devices, launch, LaunchOptions } from "puppeteer";

const run = async (url: string, country: string, config: LaunchOptions) => {
  const phone = devices["Pixel 2"];
  const browser = await launch(config);
  const page = await browser.newPage();
  await page.emulate(phone);
  page.setDefaultNavigationTimeout(60000);

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
      timeout: 60000,
    });

    // todo 截图
    const images = await page.$("li > picture > img");
    await images.screenshot({
      omitBackground: true,
      path: "./res",
    });
  } catch (error) {
    console.log(error);
  }

  await browser.close();
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
