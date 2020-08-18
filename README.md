# 环境需求

node.js >= 12.18.3

npm >= 6.14.6

ts-node >= 8.10.2

# 安装依赖

```sh
npm install -g ts-node
PUPPETEER_DOWNLOAD_HOST=https://npm.taobao.org/mirrors npm install
```

# 使用

```sh
# for apple app store
npm run start app=id1472822892 [country=us proxy=localhost:8001]
# for google play
npm run start app=com.openwow.win [country=us proxy=localhost:8001]
```
