var messageSubscribers = {};

exports.initialize = function (io) {

    io.on('connection', function (socket) {

        socket.on('disconnect', function () {
            messageSubscribers[socket.user.id].logNum = messageSubscribers[socket.user.id].logNum - 1;
            if (messageSubscribers[socket.user.id].logNum === 0) {
                delete messageSubscribers[socket.user.id];
                console.log('client disconnect,id is: ' + socket.user.id + ',name is: ' + socket.user.loginName + ',time is: 0 ');
            } else {
                console.log('client disconnect,id is: ' + socket.user.id + ',name is: ' + socket.user.loginName + ',time is: ' + messageSubscribers[socket.user.id].logNum);
            }
        });

        socket.on("set_user", function (data) {
            socket.user = data;
            if (messageSubscribers[socket.user.id]) {
                messageSubscribers[socket.user.id].logNum = messageSubscribers[socket.user.id].logNum + 1;
            } else {
                data.logNum = 1;
                messageSubscribers[socket.user.id] = data;
            }
            // one room per user
            socket.join('ticket-message-' + socket.user.id);
            console.log('client join,id is: ' + data.id + ',loginName is: ' + data.loginName + ',time is: ' + messageSubscribers[socket.user.id].logNum);
        });
    });
};

exports.getCartSubscribers = function () {
    var subscribers = [];
    for (var userId in messageSubscribers) {
        if (messageSubscribers.hasOwnProperty(userId)) {
            var user = messageSubscribers[userId];
            subscribers.push(user);
        }
    }
    return subscribers;
};