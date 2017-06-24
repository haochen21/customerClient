var config = require('./config');
var appConfig = require('../config');
var request = require("request");
var OAuth = require('wechat-oauth');
var express = require('express');
var router = express.Router();
var securityService = require('../service/security');

// 微信授权和回调
var client = new OAuth(config.appid, config.appsecret);

var wechatApi = require('./wx-sendMessage').api;

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

  if (req.session && req.session.customer) {
    securityService.findCustomerByOpenId(req.session.customer.openId, function (err, customer) {
      console.log('findCustomerByOpenId---'+JSON.stringify(customer)+',typeof'+typeof(customer));
      if (err || customer === null || typeof(reValue) == "undefined" || customer.name === null) {
        createCustomer(code, req, res);
      } else {
        req.session.customer = customer;
        //console.log('----weixin session exist------' + JSON.stringify(req.session.customer));
        // if phone_number exist,go home page
        if (customer.phone) {
          res.redirect('/?#/portal');
        } else {
          res.redirect('/?#/modifyphone');
        }
      }
    });

  } else {
    createCustomer(code, req, res);
  }
});

function createCustomer(code, req, res) {
  client.getAccessToken(code, function (err, result) {

    //result = fakeData;

    //console.log(result);
    if(!result || !result.data || !result.data.access_token){
      console.log(result);
      return;
    }
    var accessToken = result.data.access_token;
    var openid = result.data.openid;

    //console.log('token=' + accessToken);
    //console.log('openid=' + openid);

    securityService.findCustomerByOpenId(openid, function (err, customer) {
      //console.log('createCustomer,返回的customer = ' + JSON.stringify(customer));
      if (err || customer === null || typeof(customer) == "undefined") {
        console.log('customer is not exist.');

        client.getUser(openid, function (err, result) {
          //console.log('weixin api get user,err: ' + err);
          console.log('weixin api get user,result: ' + JSON.stringify(result));

          var oauth_user = result;

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
              console.error('customer save error ....' + err);
            } else {
              //console.log('Customer save sucess ....' + JSON.stringify(result));
              if (result) {
                req.session.auth = true;
                req.session.customer = result;
                res.redirect('/?#/modifyphone');
              } else {
                req.session.auth = false;
                req.session.customer = null;
              }
            }
          });

        });
      } else if (customer.name == null) {
        client.getUser(openid, function (err, result) {
          console.log('update weixin api get user,err: ' + err);
          console.log('update weixin api get user,result: ' + JSON.stringify(result));

          var oauth_user = result;

          var _user = {};
          _user.id = customer.id
          _user.openId = oauth_user.openid;
          _user.loginName = oauth_user.nickname;
          _user.name = oauth_user.nickname;
          _user.city = oauth_user.city;
          _user.province = oauth_user.province;
          _user.country = oauth_user.country;
          _user.headImgUrl = oauth_user.headimgurl;

          request({
            url: appConfig.remoteServer + '/security/customer',
            method: 'PUT',
            json: _user
          }, function (err, response, body) {
            if (err) {
              console.error('customer update error ....' + err);
            } else {
              console.log('Customer update sucess ....' + JSON.stringify(body));
              if (body) {
                req.session.auth = true;
                req.session.customer = body;
                res.redirect('/?#/modifyphone');
              } else {
                req.session.auth = false;
                req.session.customer = null;
              }

            }
          });
        });
      } else {
        //console.log('根据openid查询，用户已经存在');
        req.session.auth = true;
        req.session.customer = customer;
        if (customer.phone) {
          res.redirect('/?#/portal');
        } else {
          res.redirect('/?#/modifyphone');
        }
      }
    });
  });
}

router.get('/qrcode/:id', function (req, res) {
  let id = req.params.id;

  wechatApi.createLimitQRCode('' + id, function (err, result) {
    if (err) {
      console.error("modify qrCode error:", err, " (status: " + err.status + ")");
      res.status(404).end();
    } else {
      request({
        url: appConfig.remoteServer + '/security/merchant/wechatQrCode',
        method: 'PUT',
        form: {
          id: id,
          ticket: result.ticket
        }
      }, function (err, response, body) {
        if (err) {
          console.error("modify ticket error:", err, " (status: " + err.status + ")");
          res.status(404).end();
        } else {
          res.status(200).send({ ticket: result.ticket });
        }
      });
    }
  });
});

module.exports = router;
