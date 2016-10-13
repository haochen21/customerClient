var config = require('./config');
var request = require("request");
var systemConfig = require("../config");

var express = require('express');
var router = express.Router();
var fs = require('fs');
var get_ip = require('ipware')().get_ip;

var wechatApi = require('./wx-sendMessage').api;

var middleware = require('wechat-pay').middleware;
var Payment = require('wechat-pay').Payment;

var initConfig = {
    appId: config.appid,
    mchId: config.mch_id,
    partnerKey: config.partnerKey,
    notifyUrl: config.notifyUrl,
    pfx: fs.readFileSync(config.payFile)

};
var payment = new Payment(initConfig);

/** 
 * 支付 
 **/
router.get('/jsconfig', function (req, res) {
    var param = {
        debug: false,
        jsApiList: ['scanQRCode', 'chooseWXPay'],
        url: config.jsUrl
    };
    wechatApi.getJsConfig(param, function (err, result) {
        console.log('jsconfig: ' + JSON.stringify(result));
        res.json(result);
    });

});

/** 
 * 支付 
 **/
router.post('/info', function (req, res) {
    let cart = req.body.cart;
    var customer = req.session.customer;

    var clientIp = getClientIp4(req);

    var order = {
        body: '订单支付',//商品描述 
        attach: '微信支付',
        out_trade_no: cart.no, //商家订单号 
        total_fee: cart.totalPrice * 100,//商品金额,以分为单位   
        spbill_create_ip: clientIp,//订单生成的机器IP，指用户浏览器端IP  
        openid: customer.openId,
        trade_type: 'JSAPI'
    };
    console.log('order: ' + JSON.stringify(order));
    payment.getBrandWCPayRequestParams(order, function (err, payargs) {
        if (err) {
            console.log(err);
        }
        console.log('payargs: ' + JSON.stringify(payargs));
        res.json(payargs);
    });

});



/** 
* 微信支付回调 
*（点击支付后微信回调的目录） 
*/
router.post('/notify', middleware(initConfig).getNotify()
    .done(function (message, req, res, next) {
        console.log('pay notify: ' + JSON.stringify(message));//微信返回的数据  
        if (message.return_code == 'SUCCESS' && message.result_code == 'SUCCESS') {
            request.post({
                url: systemConfig.remoteServer + '/order/cart/weixin/paid',
                form: {
                    no: message.out_trade_no,
                    transactionId: message.transaction_id
                }
            }, function (err, response, body) {
                if (err) {
                    console.error("pay cart error", err);
                    res.status(404).end();
                } else {
                    res.status(200).send(message.return_code);
                }
            });
        }
    })
);

function getClientIp4(req) {
    var ip = get_ip(req).clientIp;
    return (ip.length <= 15 ? ip : (ip.substring(0, 7) === '::ffff:' ? ip.substring(7) : undefined));
}


// 导出  
module.exports = router;  