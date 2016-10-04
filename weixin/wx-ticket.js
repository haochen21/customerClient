var wechatApi = require('./wx-sendMessage').api;

exports.createTicket = function (merchantId, callback) {
    wechatApi.createLimitQRCode(100, callback);
}
