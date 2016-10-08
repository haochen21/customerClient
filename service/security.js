var request = require("request");
var config = require("../config");

exports.login = function (req, res) {
    let loginName = req.body.loginName;
    let password = req.body.password;
    var session = req.session;
    //res.status(200).send(loginResult);
    request.post({
        url: config.remoteServer + '/security/login',
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
                session.user = loginObj.user;
            }
            res.status(200).send(body);
        }
    });
}

exports.loginNameExists = function (req, res) {
    let loginName = req.params.loginName;

    request.get({
        url: config.remoteServer + '/security/loginNameExists/' + loginName
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

exports.deviceExists = function (req, res) {
    let deviceNo = req.params.deviceNo;

    request.get({
        url: config.remoteServer + '/security/device/' + deviceNo
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

exports.findUser = function (req, res) {
    var user = req.session.user;
    let id = user.id;
    request.get({
        url: config.remoteServer + '/security/user/' + id
    }, function (err, response, body) {
        if (err) {
            console.error("find user error:", err, " (status: " + err.status + ")");
            res.status(404).end();
        } else {
            res.status(200).send(body);
        }
    });
}

exports.findUserById = function (req, res) {
    let id = req.params.id;
    request.get({
        url: config.remoteServer + '/security/user/' + id
    }, function (err, response, body) {
        if (err) {
            console.error("find user error:", err, " (status: " + err.status + ")");
            res.status(404).end();
        } else {
            res.status(200).send(body);
        }
    });
}

exports.createMerchant = function (req, res) {
    let merchant = req.body.merchant;
    console.log(merchant);

    request({
        url: config.remoteServer + '/security/merchant',
        method: 'POST',
        json: merchant
    }, function (err, response, body) {
        if (err || response.statusCode != 200) {
            res.status(404).end();
        } else {
            res.status(200).send(body);
        }
    });
}

exports.modifyMerchant = function (req, res) {
    let merchant = req.body.merchant;
    console.log(merchant);

    request({
        url: config.remoteServer + '/security/merchant',
        method: 'PUT',
        json: merchant
    }, function (err, response, body) {
        if (err || response.statusCode != 200) {
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

exports.modifyCustomerPhone = function (req, res) {
    let user = req.session.user;
    let id = user.id;

    let phone = req.body.phone;

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
            req.session.user.phone = phone;
            res.status(200).end();
        }
    });
}

exports.modifyPassword = function (req, res) {
    let user = req.session.user;
    let id = user.id;

    let password = req.body.password;

    request({
        url: config.remoteServer + '/security/password',
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

exports.modifyOpen = function (req, res) {
    let open = req.body.open;

    let user = req.session.user;
    let id = user.id;

    request({
        url: config.remoteServer + '/security/merchant/open',
        method: 'POST',
        form: {
            id: id,
            open: open
        }
    }, function (err, response, body) {
        if (err) {
            console.error("modify open error:", err, " (status: " + err.status + ")");
            res.status(404).end();
        } else {
            res.status(200).end();
        }
    });
}

exports.updateMerchantQrCode = function (req, res) {
    let user = req.session.user;
    let id = user.id;

    request({
        url: config.remoteServer + '/security/merchant/qrCode',
        method: 'POST',
        form: {
            id: id
        }
    }, function (err, response, body) {
        if (err) {
            console.error("modify qrCode error:", err, " (status: " + err.status + ")");
            res.status(404).end();
        } else {
            res.status(200).send({ qrCode: body });
        }
    });

}

exports.findOpenRange = function (req, res) {
    let user = req.session.user;
    let id = user.id;

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

exports.createOpenRange = function (req, res) {
    let user = req.session.user;
    let id = user.id;

    let openRanges = req.body.openRanges;

    request({
        url: config.remoteServer + '/security/merchant/openRange/' + id,
        method: 'POST',
        json: openRanges
    }, function (err, response, body) {
        if (err || response.statusCode != 200) {
            res.status(404).end();
        } else {
            res.status(200).send(body);
        }
    });
}

exports.saveMerchantsOfCustomer = function (req, res) {
    let user = req.session.user;
    let customerId = user.id;

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
    let user = req.session.user;
    let customerId = user.id;
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
    let user = req.session.user;
    let customerId = user.id;
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

exports.merchantLock = function (req, res) {
    let user = req.session.user;
    if (!user) {
        res.status(200).send({
            unLock: true
        });
    }
    let loginName = user.loginName;
    let password = req.body.password;

    request.post({
        url: config.remoteServer + '/security/login',
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
                res.status(200).send({
                    unLock: true
                });
            } else {
                res.status(200).send({
                    unLock: false
                });
            }
        }
    });
}

exports.findUserByOpenId = function (openId, callback) {
    request.get({
        url: config.remoteServer + '/security/user/openId//' + openId
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
        url: config.remoteServer + '/security/customer',
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

exports.createMerchantByWeixin = function (merchant, callback) {
    console.log(merchant);

    request({
        url: config.remoteServer + '/security/merchant',
        method: 'POST',
        json: merchant
    }, function (err, response, body) {
        if (err || response.statusCode != 200) {
            callback(err);
        } else {
            callback(null, body);
        }
    });
}

const loginResult = {
    user: {
        id: 1,
        loginName: 'xiaomian',
        name: '张江重庆小面',
        password: '',
        phone: '13817475681',
        mail: 'hao.chen21@gmail.com',
        createdOn: 1467078860000,
        type: 'M',
        deviceNo: '11234i9ws11skiw11',
        shortName: '重庆小面',
        contacts: null,
        description: '张江重庆小面，好吃不贵',
        products: null,
        carts: null
    },
    result: 'AUTHORIZED'
};

const loginNameExist = {
    exist: true
}

const loginNameNoExist = {
    exist: false
}

const deviceExist = {
    exist: true
}

const deviceNoExist = {
    exist: false
}