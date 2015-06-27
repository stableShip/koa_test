var koa = require('koa');
var logger = require('koa-logger');
var koaBody = require('koa-body');
var compress = require('koa-compress');
// var session = require('koa-generic-session');
var views = require("koa-views");
var router = require('koa-router')();
var path = require('path');
var app = koa();



// logger
app.use(logger());

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
	yield this.render("basic", {
		text: text
	});
})

router.post('/', function * (next) {
	console.log(this.request.body);
	// => POST body
	this.body = JSON.stringify(this.request.body);
});

app.use(router.routes());

app.listen(3000);