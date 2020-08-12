/*
 * File index.js
 * Author:         Navi
 * Created Date:   2020-08-12 10:58
 */
// google: https://play.google.com/store/apps/details?id=com.openwow.win
const googlePlayCrawler = (appId: string, country: string) => {
  console.log(`https://play.google.com/store/apps/details?id=${appId}`);
};

// apple: https://apps.apple.com/jp/app/id1472822892#?platform=iphone
// apple: https://apps.apple.com/jp/app/id1472822892#?platform=ipad
const appleStoreCrawler = (appId: string, country: string) => {
  console.log(
    `https://apps.apple.com/${country}/app/${appId}#?platform=iphone`
  );
};

export default {
  googlePlayCrawler,
  appleStoreCrawler,
};
