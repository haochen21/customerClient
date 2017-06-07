var Kafka = require('node-rdkafka');

var socket = require('./socket');
var config = require('../config');
var weixinSendMessage = require('../weixin/wx-sendMessage');

var io = null;

exports.initialize = function (io) {
    var consumer = new Kafka.KafkaConsumer({
        'group.id': config.kafkaGroupId,
        'metadata.broker.list': config.kafkaBroker,
        'offset_commit_cb': function (err, topicPartitions) {
            if (err) {
                console.error(err);
            } else {
                console.log('kafka commit,topicPartitions: ' + topicPartitions);
            }

        }
    });
    var topicName = 'order';

    consumer.on('ready', function (arg) {
        console.log('consumer ready.' + JSON.stringify(arg));
        consumer.subscribe([topicName]);
        consumer.consume();
    });

    consumer.on('disconnected', function (arg) {
        console.log('consumer disconnected. ' + JSON.stringify(arg));
    });

    consumer.on('data', function (m) {
        var cartJson = JSON.parse(m.value.toString());
        var cartSubscribers = socket.getCartSubscribers();
        if (cartSubscribers.length > 0) {
            for (var subscriber in cartSubscribers) {
                console.log('cartSubscriber id is: ' + cartSubscribers[subscriber].id + ',type is: ' + cartSubscribers[subscriber].type);
                var customerId = cartJson.customer.id;
                console.log('user customer is: ' + customerId);
                if (customerId === cartSubscribers[subscriber].id) {
                    console.log('cart no is:' + cartJson.no + ',stauts is: ' + cartJson.status);
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
    //starting the consumer
    consumer.connect();
};