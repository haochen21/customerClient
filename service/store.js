var request = require("request");
var config = require("../config");

exports.findCategoryByMerchant = function (req, res) {
    let user = req.session.user;
    let merchantId = user.id;

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

exports.createCategory = function (req, res) {
    let category = req.body.category;
    let user = req.session.user;
    category.merchant = user;

    request({
        url: config.remoteServer + '/store/category',
        method: 'POST',
        json: category
    }, function (err, response, body) {
        if (err || response.statusCode != 200) {
            res.status(404).end();
        } else {
            res.status(200).send(body);
        }
    });
}

exports.modifyCategory = function (req, res) {
    let category = req.body.category;
    let user = req.session.user;
    category.merchant = user;
    
    request({
        url: config.remoteServer + '/store/category',
        method: 'PUT',
        json: category
    }, function (err, response, body) {
        if (err || response.statusCode != 200) {
            res.status(404).end();
        } else {
            res.status(200).send(body);
        }
    });
}

exports.deleteCategory = function (req, res, next) {
    var id = req.params.id;
    request.del({
        url: config.remoteServer + '/store/category/' + id
    }, function (err, response, body) {
        if (err || response.statusCode != 200) {
            res.status(404).end();
        } else {
            if (body === "true") {
                res.status(200).send({ result: true });
            } else {
                res.status(200).send({ result: false });
            }
        }
    });
};

exports.findCategory = function (req, res) {
    let id = req.params.id;
    request.get({
        url: config.remoteServer + '/store/category/' + id
    }, function (err, response, body) {
        if (err) {
            console.error("find category error:", err, " (status: " + err.status + ")");
            res.status(404).end();
        } else {
            res.status(200).send(body);
        }
    });
}

exports.createProduct = function (req, res) {
    let user = req.session.user;

    let product = req.body.product;
    product.merchant = user;

    request({
        url: config.remoteServer + '/store/product',
        method: 'POST',
        json: product
    }, function (err, response, body) {
        if (err || response.statusCode != 200) {
            res.status(404).end();
        } else {
            res.status(200).send(body);
        }
    });
}

exports.modifyProduct = function (req, res) {
    let user = req.session.user;

    let product = req.body.product;
    product.merchant = user;

    request({
        url: config.remoteServer + '/store/product',
        method: 'PUT',
        json: product
    }, function (err, response, body) {
        if (err || response.statusCode != 200) {
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

exports.findProductByMerchant = function (req, res) {
    let user = req.session.user;
    let merchantId = user.id;
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