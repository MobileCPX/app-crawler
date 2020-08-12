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

const APP_PARAMS: string[] = ARGS[2].split("=");

// country
if (ARGS[3]) {
  const COUNTRY_PARAMS: string[] = ARGS[3].split("=");
  if (COUNTRY_PARAMS[0] === "country" && COUNTRY_PARAMS[1]) {
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
if (APP_PARAMS[0] === "app" && APP_PARAMS[1]) {
  appId = APP_PARAMS[1].toLowerCase();
} else {
  console.log("wrong value for app ", ARGS[2]);
  process.exit();
}

// 区分商店类别
import STORE from "./crawler/index";

// 输入的是网址
if (appId.indexOf("http") !== -1) {
  let params: string[] = appId.split("id");
  if (params.length < 2) {
    console.log("not a valid url ", appId);
    process.exit();
  }

  if (params[1].startsWith("=")) {
    // google: https://play.google.com/store/apps/details?id=com.openwow.win
    STORE.googlePlayCrawler(appId, country);
  } else {
    // apple: https://apps.apple.com/jp/app/id1472822892#?platform=iphone
    // apple: https://apps.apple.com/jp/app/id1472822892#?platform=ipad
    STORE.appleStoreCrawler(appId, country);
  }
} else {
  // 为apple app id
  if (appId.startsWith("id")) {
    STORE.appleStoreCrawler(appId, country);
  } else {
    // 为包名
    STORE.googlePlayCrawler(appId, country);
  }
}
