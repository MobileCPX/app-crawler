/*
 * File index.js
 * Author:         Navi
 * Created Date:   2020-08-12 10:58
 */
import parser from "./parser";

// 解析命令行
let [f, appId, country, proxy] = parser();

(async () => {
  await f(appId, country, proxy);
})();
