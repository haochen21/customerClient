var config = require('./config');
var appConfig = require('../config');
var express = require('express');
var request = require("request");
var OAuth = require('wechat-oauth');
var router = express.Router();
var xmlparser = require('express-xml-bodyparser');
var securityService = require('../service/security');

var client = new OAuth(config.appid, config.appsecret);

router.get('/', function (req, res) {
	var msg_signature = req.query.msg_signature;
	var timestamp = req.query.timestamp;
	var nonce = req.query.nonce;
	var echostr = req.query.echostr;
	console.log('msg_signature: ' + msg_signature);
	console.log('timestamp: ' + timestamp);
	console.log('nonce: ' + nonce);
	console.log('echostr: ' + echostr);
	res.status(200).send(echostr);
});

router.post('/', xmlparser({ trim: false, explicitArray: false }), function (req, res) {
	console.log(req.body);
	var weixinEvent = req.body.xml;
	if (weixinEvent.event === 'subscribe') {
		var openId = weixinEvent.fromusername;
		var merchantId = weixinEvent.eventkey.substring(8);
		//console.log('weixinEvent:' + openId + "," + merchantId);
		securityService.findCustomerByOpenId(openId, function (err, customer) {
			//console.log('portal auth,返回的customer = ' + JSON.stringify(customer));
			if (err || customer === null) {
				//console.log('customer is not exist.');
				var _user = {};
				_user.openId = openId;
				_user.password = '123456';

				securityService.createCustomerByWeixin(_user, function (err, result) {
					if (err) {
						console.log('customer save error ....' + err);
					} else {
						//console.log('Customer save sucess ....' + JSON.stringify(result));
						createMerchantOfCustomer(result.id, merchantId);
					}
				});
			} else {
				createMerchantOfCustomer(customer.id, merchantId);
			}
		});
	} else if (weixinEvent.event === 'SCAN') {
		var openId = weixinEvent.fromusername;
		var merchantId = weixinEvent.eventkey;
		//console.log('scan weixinEvent:' + openId + "," + merchantId);
		securityService.findCustomerByOpenId(openId, function (err, customer) {
			//console.log('portal scan auth,返回的customer = ' + JSON.stringify(customer));
			if (customer != null) {
				createMerchantOfCustomer(customer.id, merchantId);
			}

		});
	}
});

function createMerchantOfCustomer(customerId, merchantId) {
	request({
		url: appConfig.remoteServer + '/security/customer/qrcodeMerchant',
		method: 'PUT',
		form: {
			customerId: customerId,
			merchantId: merchantId
		}
				}, function (err, response, body) {
		if (err) {
			console.error("modify merchant of customer error:", err, " (status: " + err.status + ")");
		}
				});
}
module.exports = router;