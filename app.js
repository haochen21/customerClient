var express = require('express');
var http = require('http');
var socketio = require('socket.io');
var app = express();
var bodyParser = require('body-parser');
var expressSession = require('express-session');
var compression = require('compression');
var RedisStore = require('connect-redis')(expressSession);

var config = require('./config');
var weixin = require('./weixin');
var service = require('./service');

var ticketSocket = require('./message/socket');
var stompMessage = require('./message/stompMessage');

var server = http.createServer(app);

var io = socketio(server);
io.set("origins", "*:*");
ticketSocket.initialize(io);

stompMessage.initialize(io);

app.use(compression());

app.use(express.static(__dirname + '/client/dist'));

app.use(expressSession({
    store: new RedisStore({
        host: config.redisIp,
        port: config.redisPort,
        pass: config.redisPwd,
        db: 1,
        logErrors: true
    }),
    secret: '1234567890QWERTY',    
    resave: false,
    saveUninitialized: false
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));

app.use('/weixin', weixin);

function logErrors(err, req, res, next) {
    console.error('logErrors', err.toString());
    next(err);
}

function errorHandler(err, req, res, next) {
    var message = JSON.stringify(err, ['stack', 'message'], 2);
    console.error(message);
    res.status(500).send({
        error: err.toString()
    });
}

var router = express.Router();

function checkLogin(req, res, next) {
    if (req.session && req.session.customer) {
        return next();
    } else {
        res.status(401).end();
    }
}

router.route('/login')
    .post(service.security.login);
router.route('/loginNameExists/:loginName')
    .get(service.security.loginNameExists);
router.route('/cardExists/:cardNo')
    .get(service.security.cardExists);
router.route('/phoneExists/:phone')
    .get(service.security.phoneExists);    
router.route('/customer')
    .get(service.security.findCustomer)
    .post(service.security.createCustomer)
    .put(service.security.modifyCustomer);
router.route('/modifyPhone', checkLogin)
    .put(service.security.modifyCustomerPhone);
router.route('/merchant/id/:id')
    .get(service.security.findMerchantById);
router.route('/merchant')
    .all(checkLogin)
    .get(service.security.findMechantsOfCustomer)
    .post(service.security.saveMerchantsOfCustomer);
router.route('/merchant/name/:name')
    .get(service.security.findMechantByName);
router.route('/merchant/size')
    .get(service.security.countMechantsOfCustomer);
router.route('/merchant/introduce/id/:id')
    .get(service.security.findMerchantWithIntroduce);    
router.route('/password', checkLogin)
    .put(service.security.modifyPassword);
router.route('/merchant/openRange/:id')
    .get(service.security.findOpenRangeByMerchantId);

router.route('/category/find/merchant/:merchantId')
    .get(service.store.findCategoryByMerchantId);
router.route('/product/:id')
    .get(service.store.findProduct);
router.route('/product/find/merchant/:merchantId')
    .get(service.store.findProductByMerchantId);

router.route('/cart/page')
    .post(service.order.pageCartByFilter);
router.route('/cart/list')
    .post(service.order.listCartByFilter);
router.route('/cart/stat/status')
    .post(service.order.statCartByStatus);
router.route('/cart/stat/product')
    .post(service.order.statCartByProduct);
router.route('/cart/stat/number')
    .post(service.order.statCartNumberByStatus);
router.route('/cart/stat/earning')
    .post(service.order.statCartEarningByStatus);
router.route('/cart/stat/earning/createdOn')
    .post(service.order.statEarningByCreatedOn);
router.route('/cart/purchase')
    .post(service.order.purchase);
router.route('/cart/paying/:id')
    .get(service.order.paying);
router.route('/cart/paid/:id')
    .get(service.order.paid);
router.route('/cart/deliver/:id')
    .get(service.order.deliver);

app.use('/api', router);

app.get('/logout', function (req, res) {
    req.session.destroy(function (err) {
        if (err) {
            console.log(err);
        } else {
            res.status(200).end();
        }
    });
});

app.use(logErrors);
app.use(errorHandler);


server.listen(3080, function () {
    console.info('server listening on port 80');
});    