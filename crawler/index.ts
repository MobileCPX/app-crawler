/*
 * File index.js
 * Author:         Navi
 * Created Date:   2020-08-12 10:58
 */
import apple from "./apple";
import google from "./google";

// 访问构造
// google: https://play.google.com/store/apps/details?id=com.openwow.win
const googlePlayCrawler = async (appId: string, country: string) => {
  const url = `https://play.google.com/store/apps/details?id=${appId}`;
  console.log(`google: ${url}`);
  await google(url, country);
};

// apple: https://itunes.apple.com/us/app/id1472822892?mt=8 跳转
// apple: https://apps.apple.com/jp/app/id1472822892#?platform=iphone
// apple: https://apps.apple.com/jp/app/id1472822892#?platform=ipad
const appleStoreCrawler = async (appId: string, country: string) => {
  const url = `https://itunes.apple.com/${country}/app/${appId}?mt=8`;
  console.log(`apple: ${url}`);
  await apple(url, country);
};

export default {
  googlePlayCrawler,
  appleStoreCrawler,
};
