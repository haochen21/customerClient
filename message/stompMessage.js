var stompit = require('stompit');

var socket = require('./socket');
var config = require('../config');
var weixinSendMessage = require('../weixin/wx-sendMessage');

var io = null;

exports.initialize = function (io) {
    var connectOptions = {
        'host': config.stompBrokerUrl,
        'port': 61613
    };
    stompit.connect(connectOptions, function (error, client) {
        var subscribeHeaders = {
            destination: '/topic/cart-json',
            ack: 'client'
        };
        client.subscribe(subscribeHeaders, function (error, message) {
            if (error) {
                console.log('subscribe error ' + error.message);
                return;
            }
            message.readString('utf-8', function (error, body) {
                if (error) {
                    console.log('read message error ' + error.message);
                    return;
                }
                console.log('received message: ' + body);
                var cartJson = JSON.parse(body);
                console.log('parse message: ' + JSON.stringify(cartJson));
                if(cartJson === null){
                    return;
                }
                var cartSubscribers = socket.getCartSubscribers();
                if (cartSubscribers.length > 0) {
                    for (var subscriber in cartSubscribers) {
                        console.log('cartSubscriber id is: ' + cartSubscribers[subscriber].id+',type is: '+cartSubscribers[subscriber].type);
                        var customerId = cartJson.customer.id;
                        console.log('user customer is: '+customerId);
                        if (customerId === cartSubscribers[subscriber].id) {
                            console.log('cart no is:'+cartJson.no+',stauts is: '+cartJson.status);
                            if (cartJson.status === 3 || cartJson.status === 4 || cartJson.status === 5) {
                                var roomName = 'ticket-message-' + cartSubscribers[subscriber].id;
                                console.log("roomName= " + roomName);
                                if (io.sockets.adapter.rooms[roomName]) {
                                    io.sockets.to(roomName).emit('cart-message', cartJson);
                                }
                            }
                        }
                    }
                }
                weixinSendMessage.sendMessage(cartJson);
            });
        });
    });
};