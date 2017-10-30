var request = require("request");
var config = require("../config");

exports.findCategoryByMerchantId = function (req, res) {
    let merchantId = req.params.merchantId;
    request.get({
        url: config.remoteServer + '/store/category/merchant/' + merchantId
    }, function (err, response, body) {
        if (err) {
            console.error("find categorys error:", err, " (status: " + err.status + ")");
            res.status(404).end();
        } else {
            res.status(200).send(body);
        }
    });
}

exports.findProduct = function (req, res) {
    let id = req.params.id;
    request.get({
        url: config.remoteServer + '/store/product/' + id
    }, function (err, response, body) {
        if (err) {
            console.error("find product error:", err, " (status: " + err.status + ")");
            res.status(404).end();
        } else {
            res.status(200).send(body);
        }
    });
}

exports.findProductByMerchantId = function (req, res) {
    let merchantId = req.params.merchantId;
    request.get({
        url: config.remoteServer + '/store/product/merchant/' + merchantId
    }, function (err, response, body) {
        if (err) {
            console.error("find products error:", err, " (status: " + err.status + ")");
            res.status(404).end();
        } else {
            res.status(200).send(body);
        }
    });
}

exports.quickSearch = function (req, res) {
    let merchantId = req.params.merchantId;
    let code = req.params.code;
    request.get({
        url: config.remoteServer + '/store/product/quicksearch/' + merchantId+'/'+encodeURI(code)
    }, function (err, response, body) {
        if (err) {
            console.error("find products error:", err, " (status: " + err.status + ")");
            res.status(404).end();
        } else {
            res.status(200).send(body);
        }
    });
}