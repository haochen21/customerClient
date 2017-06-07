var request = require("request");
var config = require("../config");

exports.login = function (req, res) {
    let loginName = req.body.loginName;
    let password = req.body.password;
    var session = req.session;
    request.post({
        url: config.remoteServer + '/security/customer/login',
        form: {
            loginName: loginName,
            password: password
        }
    }, function (err, response, body) {
        if (err) {
            console.error("login error:", err, " (status: " + err.status + ")");
            res.status(404).end();
        } else {
            var loginResult = {};
            var loginObj = JSON.parse(body);
            loginResult.result = loginObj.loginResult;

            if (loginObj.result === 'AUTHORIZED') {
                session.auth = true;
                session.customer = loginObj.customer;
            }
            res.status(200).send(body);
        }
    });
}

exports.loginNameExists = function (req, res) {
    let loginName = req.params.loginName;

    request.get({
        url: config.remoteServer + '/security/customer/loginNameExists/' + loginName
    }, function (err, response, body) {
        if (err || response.statusCode != 200) {
            res.status(404).end();
        } else {
            if (body === "true") {
                res.status(200).send({ exist: true });
            } else {
                res.status(200).send({ exist: false });
            }
        }
    });
}

exports.cardExists = function (req, res) {
    let cardNo = req.params.cardNo;

    request.get({
        url: config.remoteServer + '/security/card/' + cardNo
    }, function (err, response, body) {
        if (err || response.statusCode != 200) {
            res.status(404).end();
        } else {
            if (body === "true") {
                res.status(200).send({ exist: true });
            } else {
                res.status(200).send({ exist: false });
            }
        }
    });
}

exports.phoneExists = function (req, res) {
    let phone = req.params.phone;

    request.get({
        url: config.remoteServer + '/security/customer/phone/' + phone
    }, function (err, response, body) {
        if (err || response.statusCode != 200) {
            res.status(404).end();
        } else {
            if (body === "true") {
                res.status(200).send({ exist: true });
            } else {
                res.status(200).send({ exist: false });
            }
        }
    });
}

exports.findCustomer = function (req, res) {
    var customer = req.session.customer;
    let id = customer.id;
    request.get({
        url: config.remoteServer + '/security/customer/' + id
    }, function (err, response, body) {
        if (err) {
            console.error("find customer error:", err, " (status: " + err.status + ")");
            res.status(404).end();
        } else {
            res.status(200).send(body);
        }
    });
}

exports.findCustomerWithOrderAddress = function (req, res) {
    var customer = req.session.customer;
    let id = customer.id;
    request.get({
        url: config.remoteServer + '/security/customer/orderAddress/id/' + id
    }, function (err, response, body) {
        if (err) {
            console.error("find customer error:", err, " (status: " + err.status + ")");
            res.status(404).end();
        } else {
            res.status(200).send(body);
        }
    });
}

exports.createCustomer = function (req, res) {
    let customer = req.body.customer;
    console.log(customer);

    request({
        url: config.remoteServer + '/security/customer',
        method: 'POST',
        json: customer
    }, function (err, response, body) {
        if (err || response.statusCode != 200) {
            res.status(404).end();
        } else {
            res.status(200).send(body);
        }
    });
}

exports.modifyCustomer = function (req, res) {
    let customer = req.body.customer;
    console.log(customer);

    request({
        url: config.remoteServer + '/security/customer',
        method: 'PUT',
        json: customer
    }, function (err, response, body) {
        if (err || response.statusCode != 200) {
            res.status(404).end();
        } else {
            res.status(200).send(body);
        }
    });
}

exports.modifyCustomerBySubscribe = function (customer) {
    request({
        url: config.remoteServer + '/security/customer',
        method: 'PUT',
        json: customer
    }, function (err, response, body) {
    });
}

exports.modifyCustomerPhone = function (req, res) {
    let customer = req.session.customer;
    let id = customer.id;

    let phone = req.body.phone;
    console.log('modify phone,customer id is:' + id + ',phone is:' + phone);
    request({
        url: config.remoteServer + '/security/customer/modifyPhone',
        method: 'PUT',
        form: {
            id: id,
            phone: phone
        }
    }, function (err, response, body) {
        if (err) {
            console.error("modify phone error:", err, " (status: " + err.status + ")");
            res.status(404).end();
        } else {
            console.log("modify phone return....."+ body);
            if (body === "true") {
                req.session.customer.phone = phone;
                console.log('---- session ------' + JSON.stringify(req.session.customer));
                res.status(200).send({ operate: true });
            } else {
                res.status(200).send({ operate: false });
            }
        }
    });
}

exports.modifyPassword = function (req, res) {
    let customer = req.session.customer;
    let id = customer.id;

    let password = req.body.password;

    request({
        url: config.remoteServer + '/security/customer/password',
        method: 'PUT',
        form: {
            id: id,
            password: password
        }
    }, function (err, response, body) {
        if (err) {
            console.error("modify password error:", err, " (status: " + err.status + ")");
            res.status(404).end();
        } else {
            res.status(200).end();
        }
    });
}

exports.findOpenRangeByMerchantId = function (req, res) {
    let id = req.params.id;
    request.get({
        url: config.remoteServer + '/security/merchant/openRange/' + id
    }, function (err, response, body) {
        if (err) {
            console.error("find open ranges error:", err, " (status: " + err.status + ")");
            res.status(404).end();
        } else {
            res.status(200).send(body);
        }
    });
}

exports.saveMerchantsOfCustomer = function (req, res) {
    let customer = req.session.customer;
    let customerId = customer.id;

    let merchantIds = req.body.merchantIds;

    request({
        url: config.remoteServer + '/security/customer/merchant/' + customerId,
        method: 'POST',
        json: merchantIds
    }, function (err, response, body) {
        if (err || response.statusCode != 200) {
            res.status(404).end();
        } else {
            res.status(200).send(body);
        }
    });
}

exports.findMechantsOfCustomer = function (req, res) {
    let customer = req.session.customer;
    let customerId = customer.id;
    request.get({
        url: config.remoteServer + '/security/customer/merchant/' + customerId
    }, function (err, response, body) {
        if (err) {
            console.error("find merchants error:", err, " (status: " + err.status + ")");
            res.status(404).end();
        } else {
            res.status(200).send(body);
        }
    });
}

exports.countMechantsOfCustomer = function (req, res) {
    let customer = req.session.customer;
    let customerId = customer.id;
    request.get({
        url: config.remoteServer + '/security/customer/merchant/size/' + customerId
    }, function (err, response, body) {
        if (err) {
            console.error("find merchants size error:", err, " (status: " + err.status + ")");
            res.status(404).end();
        } else {
            res.status(200).send(body);
        }
    });
}

exports.findMerchantById = function (req, res) {
    let id = req.params.id;
    request.get({
        url: config.remoteServer + '/security/merchant/' + id
    }, function (err, response, body) {
        if (err) {
            console.error("find merchant error:", err, " (status: " + err.status + ")");
            res.status(404).end();
        } else {
            res.status(200).send(body);
        }
    });
}

exports.findMerchantWithIntroduce = function (req, res) {
    let id = req.params.id;
    request.get({
        url: config.remoteServer + '/security/merchant/introduce/' + id
    }, function (err, response, body) {
        if (err) {
            console.error("find merchant error:", err, " (status: " + err.status + ")");
            res.status(404).end();
        } else {
            res.status(200).send(body);
        }
    });
}

exports.findMechantByName = function (req, res) {
    let name = req.params.name;
    request.get({
        url: config.remoteServer + '/security/merchant/name/' + encodeURI(name)
    }, function (err, response, body) {
        if (err) {
            console.error("find merchants error:", err, " (status: " + err.status + ")");
            res.status(404).end();
        } else {
            res.status(200).send(body);
        }
    });
}

exports.findCustomerByOpenId = function (openId, callback) {
    request.get({
        url: config.remoteServer + '/security/customer/openId/' + openId + '?' + new Date().getTime()
    }, function (err, response, body) {
        if (err || response.statusCode != 200) {
            callback(err);
        } else {
            if (body === '') {
                callback(null, null);
            } else {
                callback(null, JSON.parse(body));
            }
        }
    });
}

exports.createCustomerByWeixin = function (customer, callback) {
    console.log(customer);

    request({
        url: config.remoteServer + '/security/customer' + '?' + new Date().getTime(),
        method: 'POST',
        json: customer
    }, function (err, response, body) {
        if (err || response.statusCode != 200) {
            callback(err);
        } else {
            callback(null, body);
        }
    });
}