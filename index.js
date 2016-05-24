"use strict" /* @flow */

const debug = require('debug')('index')
const WechatCliCLient = require('./src/cli')

console.log("[CTRL+C] to Quit");

let bot = new WechatCliCLient()

bot.showQR()
.catch(err => {
  debug(err)
});

process.on('SIGINT', function() {
  bot.logout();
  setTimeout(() => {
    process.exit();
  }, 1000);
});
