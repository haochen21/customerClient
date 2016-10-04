var request = require("request");
var config = require("../config");

exports.listCartByFilter = function (req, res) {
    let filter = req.body.filter;
    request({
        url: config.remoteServer + '/order/cart/list',
        method: 'POST',
        json: filter
    }, function (err, response, body) {
        if (err || response.statusCode != 200) {
            res.status(404).end();
        } else {
            res.status(200).send(body);
        }
    });
}

exports.pageCartByFilter = function (req, res) {
    let filter = req.body.filter;
    request({
        url: config.remoteServer + '/order/cart/page',
        method: 'POST',
        json: filter
    }, function (err, response, body) {
        if (err || response.statusCode != 200) {
            res.status(404).end();
        } else {
            res.status(200).send(body);
        }
    });
}

exports.statCartByStatus = function (req, res) {
    let filter = req.body.filter;
    request({
        url: config.remoteServer + '/order/cart/stat/status',
        method: 'POST',
        json: filter
    }, function (err, response, body) {
        if (err || response.statusCode != 200) {
            res.status(404).end();
        } else {
            res.status(200).send(body);
        }
    });
}

exports.statCartByProduct = function (req, res) {
    let filter = req.body.filter;
    request({
        url: config.remoteServer + '/order/cart/stat/product',
        method: 'POST',
        json: filter
    }, function (err, response, body) {
        if (err || response.statusCode != 200) {
            res.status(404).end();
        } else {
            res.status(200).send(body);
        }
    });
}

exports.statCartNumberByStatus = function (req, res) {
    let filter = req.body.filter;    
    request({
        url: config.remoteServer + '/order/cart/stat/number',
        method: 'POST',
        json: filter
    }, function (err, response, body) {
        if (err || response.statusCode != 200) {
            res.status(404).end();
        } else {
            res.status(200).send({number:body});
        }
    });
}

exports.statCartEarningByStatus = function (req, res) {
    let filter = req.body.filter;
    
    request({
        url: config.remoteServer + '/order/cart/stat/earning',
        method: 'POST',
        json: filter
    }, function (err, response, body) {
        if (err || response.statusCode != 200) {
            res.status(404).end();
        } else {
            res.status(200).send({earning:body});
        }
    });
}

exports.statEarningByCreatedOn = function (req, res) {
    let filter = req.body.filter;
    var user = req.session.user;
    filter.merchantId = user.id;
    request({
        url: config.remoteServer + '/order/cart/stat/earning/createdOn',
        method: 'POST',
        json: filter
    }, function (err, response, body) {
        if (err || response.statusCode != 200) {
            res.status(404).end();
        } else {
            res.status(200).send(body);
        }
    });
}

exports.purchase = function (req, res) {
    let cart = req.body.cart;

    request({
        url: config.remoteServer + '/order/cart/purchase',
        method: 'POST',
        json: cart
    }, function (err, response, body) {
        if (err || response.statusCode != 200) {
            res.status(404).end();
        } else {
            res.status(200).send(body);
        }
    });
}

exports.paying = function (req, res) {
    let id = req.params.id;

    request.get({
        url: config.remoteServer + '/order/cart/paying/' + id
    }, function (err, response, body) {
        if (err) {
            console.error("paying cart error:", err, " (status: " + err.status + ")");
            res.status(404).end();
        } else {
            res.status(200).send(body);
        }
    });
}

exports.paid = function (req, res) {
    let id = req.params.id;

    request.get({
        url: config.remoteServer + '/order/cart/paid/' + id
    }, function (err, response, body) {
        if (err) {
            console.error("paid cart error:", err, " (status: " + err.status + ")");
            res.status(404).end();
        } else {
            res.status(200).send(body);
        }
    });
}

exports.deliver = function (req, res) {
    let id = req.params.id;

    request.get({
        url: config.remoteServer + '/order/cart/deliver/' + id
    }, function (err, response, body) {
        if (err) {
            console.error("deliver cart error:", err, " (status: " + err.status + ")");
            res.status(404).end();
        } else {
            res.status(200).send(body);
        }
    });
}