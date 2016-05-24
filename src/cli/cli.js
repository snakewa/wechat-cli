"use strict" /* @flow */

const debug = require('debug')('wechat-cli')
const wechat4u = require('wechat4u')
const inquirer = require('inquirer');
const qrcode = require('qrcode-terminal');
const fs = require('fs')

let log = console.log

class WechatCliCLient extends wechat4u {

  constructor() {
    super()
    let bot = this
    let logger = (msg_type) => (msg) => {
      debug(msg_type + ':' + (msg['Content'] ? msg['Content'] : ''))
      debug(msg)
    }
    let msg_logger = (msg_type) => (msg) => {
      debug(msg_type + ':' + (msg['Content'] ? msg['Content'] : ''))
      debug(msg)
      if( msg['Content'] ){
        log( "\n"+ this.friend_name(msg['FromUserName']) + ": " +  msg['Content']  + ( msg_type=='text-message' ? '' : ("("+msg_type+")") ) )
      }
    }

    this.on('uuid', uuid => {
      debug('uuid:' + uuid)
      this.uuid = uuid
    })

    bot.on('scan', () => {
      debug('scan')
    })

    bot.on('confirm', () => {
      debug('confirm')
    })

    bot.on('login', memberList => {
      debug('login')
      for (var mi in memberList) {
        var m = memberList[mi]
        if (m.hasOwnProperty('Alias')) {
          if (m.Alias == 'timmth') {
            this.me = m.UserName;
          }
        }
      }
    })

    bot.on('logout', msg => {
      debug('logout')
      debug(msg)
    })

    bot.on('error', err => debug(err))

    bot.on('init-message', (a) => {
      debug('init-message');
      debug(a)
    })

    bot.on('text-message', msg_logger('text-message') )
    bot.on('picture-message', msg_logger('picture-message'))
    bot.on('voice-message', msg_logger('voice-message'))
    bot.on('emoticon-message', msg_logger('emoticon-message'))
    bot.on('verify-message', logger('verify-message'))
  }


  findFriendByUsername(username){
    if( typeof this.friends === 'undefined' ){
      this.friends = {}
    }
    //build freinds dict for first time or user not found
    if( !this.friends.hasOwnProperty(username) ){
      for (var mi in this.friendList) {
        var m = this.friendList[mi]
        this.friends[m.username] = m
      }
    }
    return this.friends[username]
  }

  friend_name(username){
    let f = this.findFriendByUsername(username);
    if(f){
      return f.nickname
    }else{
      return username
    }
  }

  findFriends(name){
    let friends = []
    for (var mi in this.friendList) {
      var m = this.friendList[mi]
      if ( m.py.toLowerCase().indexOf(name.toLowerCase() ) !== -1 ) {
        let key = m.py.toLowerCase();
        friends.push(m)
      }
    }
    return friends;
  }

  sendMessage(msg,user){
    log( this.user.NickName +": "+ msg + " (to:" + this.friend_name(user) + ")")
    return this.sendMsg(msg,user)
  }

  showQR(){
    let bot = this
    return bot.getUUID().then(uuid => { /*处理uuid*/
      var url = 'https://login.weixin.qq.com/l/' + uuid;
      debug('getUUID login:' + url)
      qrcode.generate(url)

      bot.start()
        .then(() => {
          debug('started')

          var questions = [
            {
              type: 'input',
              name: 'question',
              message: 'cmd:',
              validate: function(value) {

                if(value==""){
                  log( "\nhow to send message:")
                  log( "\n - me {msg}")
                  log( "\n or ")
                  log( "\n - user_nickname {msg}")
                }else if (value == 'dump') {
                  log( "\n dump user's information")
                  bot.dump_bot()
                } else {
                  log("\n")
                  let parts = value.split(" ")
                  let name = parts.shift()
                  let msg = parts.join(' ')
                  if( name=='me' ){
                      bot.sendMessage(msg,bot.user.UserName)
                  }else{
                      let friends = bot.findFriends(name)
                      if( friends.length == 0 ){
                        log("No frirend matached")
                      }else if( friends.length == 1 ){
                          bot.sendMessage( msg,friends[0].username )
                      }else{
                          log( "There are more than one friend matached:" + friends.map( e=> e.nickname ).join(",")  )
                      }
                  }
                }
                return "\n"
              }

            }
          ];

          inquirer.prompt(questions).then(function (answers) {

          });

        }) ;
    })
  }

  dump_bot() {
    let bot = this
    let keys = [
      'friendList',
      'user',
      'memberList',
      'contactList',
      'groupList',
      'groupMemberList',
      'publicList',
      'specialList'
    ]

    keys.forEach(key => {
      fs.writeFile('logs/' + key + '.txt', JSON.stringify(bot[key], null, '\t'), function(err) {
        if (err) debug('error:' + err)
        else debug('saved: ' + key + '.txt')
      });
    });
  }
}


module.exports = WechatCliCLient;
