var config = require('./config');
var OAuth = require('wechat-oauth');
var express = require('express');
var router = express.Router();
var securityService = require('../service/security');

// 微信授权和回调
var client = new OAuth(config.appid, config.appsecret);

// 主页,主要是负责OAuth认真
router.get('/', function (req, res) {
  var url = client.getAuthorizeURL(config.url + '/weixin/customer/callback', '', 'snsapi_userinfo');
  //url = config.url + '/weixin/customer/callback';
  // 重定向请求到微信服务器
  res.redirect(url)
})

/**
 * 认证授权后回调函数
 *
 * 根据openid判断是否用户已经存在
 * - 如果是新用户，注册并绑定，然后跳转到手机号验证界面
 * - 如果是老用户，跳转到主页
 */
router.get('/callback', function (req, res) {
  console.log('----weixin callback -----')
  var code = req.query.code;

  client.getAccessToken(code, function (err, result) {

    //result = fakeData;

    console.log(result);
    var accessToken = result.data.access_token;
    var openid = result.data.openid;

    console.log('token=' + accessToken);
    console.log('openid=' + openid);

    securityService.findUserByOpenId(openid, function (err, user) {
      console.log('微信回调后,返回的user = ' + user);
      if (err || user === null ) {
        console.log('user is not exist.');
        
        client.getUser(openid, function (err, result) {
          console.log('use weixin api get user,err: ' + err);
          console.log('use weixin api get user,result: ' + result);

          var oauth_user = result;
          
          //oauth_user = fakeUser;

          var _user = {};
          _user.openId = oauth_user.openid;
          _user.loginName = oauth_user.nickname;
          _user.name = oauth_user.nickname;
          _user.city = oauth_user.city;
          _user.province = oauth_user.province;
          _user.country = oauth_user.country;
          _user.headImgUrl = oauth_user.headimgurl;
          _user.name = oauth_user.nickname;
          _user.password = '123456';

          securityService.createCustomerByWeixin(_user, function (err, result) {
            if (err) {
              console.log('Customer save error ....' + err);
            } else {
              console.log('Customer save sucess ....'+result);
              console.log(result);
              req.session.auth = true;
              req.session.user = JSON.parse(result);
              res.redirect('/?#/modifyphone');
            }
          });

        });
      } else {
        console.log('根据openid查询，用户已经存在');
        req.session.auth = true;
        req.session.user = user;
        // if phone_number exist,go home page
        if (user.phone) {
          res.redirect('/?#/portal');
        } else {
          res.redirect('/?#/modifyphone');
        }
      }
    });
  });
});

module.exports = router;

const fakeData = {
 data: {
   "access_token": "ACCESS_TOKEN",
   "expires_in": 7200,
   "refresh_token": "REFRESH_TOKEN",
   "openid": "111212121",
   "scope": "SCOPE"
 }
};

const fakeUser = {
  openid: '111212121',
  nickname: 'xiaomian',
  city: '重庆',
  province: '',
  country: '',
  headimgurl:''
};