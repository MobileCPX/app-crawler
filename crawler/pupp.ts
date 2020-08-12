/*
 * File pupp.ts
 * Author:         Navi
 * Created Date:   2020-08-12 13:25
 */
import { devices, launch } from "puppeteer";

interface IPayload {
  url: string;
  country: string;
}

const runInDevice = (f: Function, payload: IPayload) => {
  run(f, payload).then((res) => {});
};

// 使用模拟安卓手机，否则apple会跳出打开app提示
const run = async (f: Function, payload: IPayload) => {
  const phone = devices["Pixel 2"];
  const browser = await launch();
  const page = await browser.newPage();
  await page.emulate(phone);

  console.log("running");

  try {
    await f(page, payload.url, payload.country);
  } catch (error) {
    console.log("error", error);
  }
  await browser.close();
};

export default runInDevice;
