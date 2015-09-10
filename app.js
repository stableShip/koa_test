
/// <reference path="typings/tsd.d.ts" />

var koa = require('koa');
var logger = require('koa-logger');
var koaBody = require('koa-body');
var compress = require('koa-compress');
// var session = require('koa-generic-session');
var views = require("koa-views");
var router = require('koa-router')();
var path = require('path');
var app = koa();
var request=require("request");
var fs = require("fs");
var co = require("co");
// logger
app.use(logger());
var Promise = require('bluebird');
Promise.promisifyAll(fs);
Promise.promisifyAll(request)
// Must be used before any router is used
app.use(views({
	root: __dirname + "/views",
	default: 'jade'
}));

/*
handle three type requests
multipart/form-data
application/x-www-urlencoded
application/json*/
app.use(koaBody({
	formidable: {
		uploadDir: __dirname
	}
}));



//Minimum response size 
app.use(compress({
	filter: function(content_type) {
		return /text/i.test(content_type)
	},
	threshold: 2048,
	flush: require('zlib').Z_SYNC_FLUSH
}))



router.get('/', function * (next) {
	// console.log(views)
	var text = "HELLO WORLD!!!";
	text = yield fs.readFileAsync("./app.js");
	text = yield request.getAsync("http://www.baidu.com").get(1)
	
	// yield this.render("basic", {
	// 	text: text
	// });
	this.body = text
})

router.post('/', function * (next) {
	console.log(this.request.body);
	// => POST body
	this.body = JSON.stringify(this.request.body);
});

app.use(router.routes());

app.listen(4000,function () {
	console.log("server listening in 4000");
});

