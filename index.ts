/*
 * File index.js
 * Author:         Navi
 * Created Date:   2020-08-12 10:58
 */
const ARGS: string[] = process.argv;

// 参数检测
if (ARGS.length < 3) {
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

const APP_PARAMS: string[] = ARGS[2].split("app=");

// country
if (ARGS[3]) {
  const COUNTRY_PARAMS: string[] = ARGS[3].split("country=");
  if (COUNTRY_PARAMS[1]) {
    country = COUNTRY_PARAMS[1].toLowerCase();
  } else {
    // 未正确解析，默认us
    console.log("wrong value for country ", ARGS[3]);
    console.log("set default value 'us' for country");
    country = "us";
  }
} else {
  console.log("set default value 'us' for country");
  country = "us";
}

// app
if (APP_PARAMS[1]) {
  appId = APP_PARAMS[1].toLowerCase();
} else {
  console.log("wrong value for app ", ARGS[2]);
  process.exit();
}

// 区分商店类别
import STORE from "./crawler/index";

// 输入的是网址
if (appId.startsWith("http")) {
  const APPLE_REG = /^http.*\.com\/(\w+)\/app\/(id\d+)#?/;
  const GOOGLE_REG = /^http.*\?id=(.*)/;

  if (APPLE_REG.test(appId)) {
    country = appId.match(APPLE_REG)[1];
    appId = appId.match(APPLE_REG)[2];
    console.log(`apple: use country ${country} in url`);
    STORE.appleStoreCrawler(appId, country);
    process.exit();
  }

  if (GOOGLE_REG.test(appId)) {
    appId = appId.match(GOOGLE_REG)[1];
    STORE.googlePlayCrawler(appId, country);
    process.exit();
  }

  console.log("not a valid url ", appId);
  process.exit();
}

// 为apple app id
if (appId.startsWith("id")) {
  STORE.appleStoreCrawler(appId, country);
} else {
  // 为包名
  STORE.googlePlayCrawler(appId, country);
}
