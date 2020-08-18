/*
 * File parser.ts
 * Author:         Navi
 * Created Date:   2020-08-12 14:39
 */
// 区分商店类别
import { googlePlayCrawler, appleStoreCrawler } from "./crawler/index";

interface IArgs {
  app: string;
  country: string;
  proxy: string;
}

const parse = (): [Function, string, string, string] => {
  let ARGS: IArgs = { app: "", country: "", proxy: "" };

  process.argv.map((value) => {
    if (value.startsWith("app=")) {
      ARGS.app = value.split("app=")[1];
      return;
    }

    if (value.startsWith("country=")) {
      ARGS.country = value.split("country=")[1];
      return;
    }

    if (value.startsWith("proxy=")) {
      ARGS.proxy = value.split("proxy=")[1];
      return;
    }
  });

  // 参数检测
  if (!ARGS.app) {
    console.log("please enter app info.");
    console.log("default value for country would be us.\n");
    console.log("example:");
    console.log(
      "  npm run start app=id1472822892 country=us (for apple app store)"
    );
    console.log(
      "  npm run start app=com.openwow.win country=us (for google play)"
    );
    process.exit();
  }

  // 参数解析
  let appId: string;
  let country: string;
  let proxy: string;
  let executer: Function;

  // country
  if (ARGS.country) {
    country = ARGS.country.toLowerCase();
  } else {
    // 默认使用us
    country = "us";
  }

  // app
  if (ARGS.app) {
    appId = ARGS.app.toLowerCase();
  } else {
    console.log("no value for app ");
    process.exit();
  }

  // 输入的是网址
  if (appId.startsWith("http")) {
    const APPLE_REG = /^http.*\.com\/(\w+)\/app\/(id\d+)/;
    const GOOGLE_REG = /^http.*\?id=(.*)/;

    if (APPLE_REG.test(appId)) {
      country = appId.match(APPLE_REG)[1];
      appId = appId.match(APPLE_REG)[2];
      console.log(`apple: use country ${country} in url`);
      executer = appleStoreCrawler;
    } else if (GOOGLE_REG.test(appId)) {
      appId = appId.match(GOOGLE_REG)[1];
      executer = googlePlayCrawler;
    } else {
      console.log("not a valid url ", appId);
      process.exit();
    }
  }

  // 为apple app id
  if (appId.startsWith("id")) {
    executer = appleStoreCrawler;
  } else {
    // 为包名
    executer = googlePlayCrawler;
  }

  // 代理配置
  if (ARGS.proxy) {
    proxy = ARGS.proxy;
    // 加上http
    if (proxy.length > 1 && !proxy.startsWith("http")) {
      proxy = "http://" + proxy;
    }
  }

  return [executer, appId, country, proxy];
};

export default parse;
