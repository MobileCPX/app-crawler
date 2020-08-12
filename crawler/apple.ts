/*
 * File apple.ts
 * Author:         Navi
 * Created Date:   2020-08-12 11:43
 */
import { devices, launch } from "puppeteer";

const run = async (url: string, country: string) => {
  const phone = devices["Pixel 2"];
  const browser = await launch();
  const page = await browser.newPage();
  await page.emulate(phone);

  try {
    await page.goto(url);
    // todo 重定向等待
    await page.waitForNavigation();

    // 等待重定向
    await page.waitForSelector("source.we-artwork__source");

    await page.screenshot({ path: "./res.png" });
  } catch (error) {
    console.log(error);
  }

  await browser.close();
};

export default async (url: string, country: string) => {
  await run(url, country);
};
