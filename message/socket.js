var messageSubscribers = {};

exports.initialize = function (io) {

    io.on('connection', function (socket) {

        socket.on('disconnect', function () {
            if (socket.customer && socket.customer.id) {
                messageSubscribers[socket.customer.id].logNum = messageSubscribers[socket.customer.id].logNum - 1;
                if (messageSubscribers[socket.customer.id].logNum === 0) {
                    delete messageSubscribers[socket.customer.id];
                    console.log('client disconnect,id is: ' + socket.customer.id + ',name is: ' + socket.customer.loginName + ',time is: 0 ');
                } else {
                    console.log('client disconnect,id is: ' + socket.customer.id + ',name is: ' + socket.customer.loginName + ',time is: ' + messageSubscribers[socket.customer.id].logNum);
                }
            }else {
                console.log('socket disconnect error,customer is:'+JSON.stringify(customer));
            }

        });

        socket.on("set_customer", function (data) {
            socket.customer = data;
            if (messageSubscribers[socket.customer.id]) {
                messageSubscribers[socket.customer.id].logNum = messageSubscribers[socket.customer.id].logNum + 1;
            } else {
                data.logNum = 1;
                messageSubscribers[socket.customer.id] = data;
            }
            // one room per user
            socket.join('ticket-message-' + socket.customer.id);
            console.log('client join,id is: ' + data.id + ',loginName is: ' + data.loginName + ',time is: ' + messageSubscribers[socket.customer.id].logNum);
        });
    });
};

exports.getCartSubscribers = function () {
    var subscribers = [];
    for (var customerId in messageSubscribers) {
        if (messageSubscribers.hasOwnProperty(customerId)) {
            var customer = messageSubscribers[customerId];
            subscribers.push(customer);
        }
    }
    return subscribers;
};