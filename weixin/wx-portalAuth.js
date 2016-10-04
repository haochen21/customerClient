var express = require('express');
var router = express.Router();

router.get('/', function(req, res){
	var msg_signature = req.query.msg_signature;
	var timestamp = req.query.timestamp;
	var nonce = req.query.nonce;
	var echostr = req.query.echostr;
    console.log('msg_signature: '+msg_signature);
    console.log('timestamp: '+timestamp);
    console.log('nonce: '+nonce);
    console.log('echostr: '+echostr);	
	res.status(200).send(echostr);
});

module.exports = router;