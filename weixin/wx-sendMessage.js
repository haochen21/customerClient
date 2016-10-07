var config = require('./config');

var moment = require('moment');
var API = require('wechat-api');
var api = new API(config.appid, config.appsecret);

const UNPAIDTEMPLATE = '6XyBGszgnetQTR_vYGh7OYHltPXV8yR8Kz4uevgri0k';
const DELIVEREDTEMPLATE = 'E49gjhslP7_i4lA-5Vz4rgYkFMw5ZwLq6jLzOx-u_Wo';
const TAKETEMPLATE = 'ugwsoSOpz6uWUmEZxUmfW3abruUK7c7Rr8M4zGDGssg';

exports.getLatestToken = function (callback) {
    api.getLatestToken(callback);
}

exports.sendMessage = function (cart) {
    var openId = cart.customer.openId;
    if (openId) {
        var templateId = '';
        var data = {};
        if (cart.status === 3) { //CONFIRMED
            templateId = TAKETEMPLATE;
            data = createTakeStr(cart);
        } else if (cart.status === 4) { //DELIVERED
            templateId = DELIVEREDTEMPLATE;
            data = createDeliverStr(cart);
        } else if (cart.status === 5) { //CANCELLED
            templateId = UNPAIDTEMPLATE;
            data = createCanceledStr(cart);
        }
        

        if (templateId !== '') {
            console.log('weixing message: ' + JSON.stringify(data));
            api.sendTemplate(openId, templateId, null, data, sendResult);
        }
    }

}

function createUnpaidStr(cart) {
    var json = {};
    json.first = {};
    json.first.value = '您的订单未支付，即将关闭';
    json.first.color = '#173177';

    json.ordertape = {};
    var createdOn = moment(new Date().setTime(cart.createdOn));
    json.ordertape.value = createdOn.format('YYYY-MM-DD HH:mm:ss');

    json.ordeID = {};
    json.ordeID.value = cart.no;

    json.remark = {};
    var payTime = moment(new Date().setTime(cart.payTime));
    json.remark.value = '订单将在: ' + payTime.format('YYYY-MM-DD HH:mm:ss') + '关闭，请及时付款';
    json.remark.color = '#d9534f';

    return json;
}

function createDeliverStr(cart) {
    var json = {};
    json.first = {};
    json.first.value = '尊敬的用户您好，您的订单已完成。';
    json.first.color = '#173177';

    json.keyword1 = {};
    json.keyword1.value = cart.no;

    json.keyword2 = {};
    var updatedOn = moment(new Date().setTime(cart.updatedOn));
    json.keyword2.value = updatedOn.format('YYYY-MM-DD HH:mm:ss');

    json.remark = {};
    var phone = cart.merchant.phone ? cart.merchant.phone : '';
    json.remark.value = '如有任何疑问，请拨打商家电话：' + phone;

    return json;
}

function createTakeStr(cart) {
    var json = {};
    json.first = {};
    json.first.value = '尊敬的用户您好，您的订单已下单。';
    json.first.color = '#173177';

    json.OrderSn = {};
    json.OrderSn.value = cart.no;

    json.OrderStatus = {};
    json.OrderStatus.value = '待取货';
    json.OrderStatus.color = '#d9534f';

    json.remark = {};
    var takeBeginTime = moment(new Date().setTime(cart.takeBeginTime));
    var takeEndTime = moment(new Date().setTime(cart.takeEndTime));
    var phone = cart.merchant.phone ? cart.merchant.phone : '';
    json.remark.value = '请在以下时间取货：' + takeBeginTime.format('YYYY-MM-DD HH:mm:ss') + ' - ' + takeEndTime.format('HH:mm:ss') + '，如有任何疑问，请拨打商家电话：' + phone;

    return json;
}

function createCanceledStr(cart) {
    var json = {};
    json.first = {};
    json.first.value = '您的订单未在指定时间付款，已经取消';
    json.first.color = '#173177';

    json.ordertape = {};
    var createdOn = moment(new Date().setTime(cart.createdOn));
    json.ordertape.value = createdOn.format('YYYY-MM-DD HH:mm:ss');

    json.ordeID = {};
    json.ordeID.value = cart.no;

    json.remark = {};
    var payTime = moment(new Date().setTime(cart.takeEndTime));
    json.remark.value = '现场付款订单在: ' + payTime.format('YYYY-MM-DD HH:mm:ss') + '关闭';
    json.remark.color = '#d9534f';

    return json;
}

function sendResult(err, result) {
    if (err) {
        console.log(err);
    } else {
        console.log(result);
    }
}

exports.api = api;