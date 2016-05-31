#微信命令行客戶端

一個基於微信Web版的API的命令行客戶端，是基於[wechat4u](https://github.com/nodeWechat/wechat4u)的庫，因為微信沒有一個桌面的客戶端，經常就是要使用手機查看和找所要的訊息，所以這個項目的最終的目的是可以實現一個自己self-host的，持續運行的微信客戶端，紀錄收到的訊息，自帶一個持久的訊息資料庫（目前還沒有），方便整理在微信所收到的信息，可以簡單的發訊息，或做一些機器人和自動化的工作。

由於微信Web版中，好友的ID是每一次Session都不同，所以這個工具必需要使用一些機制把不同Session的好友ID做一一對應，也是早期開發的主要的工作之一。

##設置
```
git clone https://github.com/snakewa/wechat-cli
npm install
```

##運行
```
npm test
```
或者看更多的debug訊息：
```
DEBUG=wechat,wechat-cli node index.js
```
##使用

運行後會在命令行顯示二維碼，使用微信掃二維碼，就會開始顯示收到的訊息，並且可以使用有me {message}和{friend-nick-name} {message}二個命令。也可以使用dump，把朋友例表等資訊存在logs的目錄作為debug用

##Todo
- 發信息給群
- 現示群的訊息（現在不能出名字，只能出ID）
- 持久的訊息資料庫，包括自動下載相關的相片和語音等
- 更好的命令行介面


##現關的項目

* [wechat4u - WeChat Web API library](https://github.com/nodeWechat/wechat4u)
