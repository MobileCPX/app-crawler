/*
 * File index.js
 * Author:         Navi
 * Created Date:   2020-08-12 10:58
 */
import parser from "./parser";

let [f, appId, country, proxy] = parser();

(async () => {
  await f(appId, country, proxy);
})();
