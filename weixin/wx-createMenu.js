var config = require('./config');  
var API = require('wechat-api');  
  
  
var api = new API(config.appid, config.appsecret);  

api.getAccessToken(function (err, token) {  
    console.log(err);  
    console.log(token);  
});  
  
var menu = JSON.stringify(require('./wx_menu.json'));  
api.createMenu(menu, function (err, result) {  
    console.log(result);  
});  