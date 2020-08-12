/*
 * File index.js
 * Author:         Navi
 * Created Date:   2020-08-12 10:58
 */
import apple from "./apple";
import google from "./google";

// 访问构造
// google: https://play.google.com/store/apps/details?id=com.openwow.win
const googlePlayCrawler = (appId: string, country: string) => {
  console.log(`google: https://play.google.com/store/apps/details?id=${appId}`);
  google();
};

// apple: https://apps.apple.com/jp/app/id1472822892#?platform=iphone
// apple: https://apps.apple.com/jp/app/id1472822892#?platform=ipad
const appleStoreCrawler = (appId: string, country: string) => {
  console.log(
    `apple: https://apps.apple.com/${country}/app/${appId}#?platform=iphone`
  );
  apple();
};

export default {
  googlePlayCrawler,
  appleStoreCrawler,
};
