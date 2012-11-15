// Dependencies

var
	express = require('express'),
	cons = require('consolidate'),
    swig = require('swig'),
    crypto = require('crypto')
;


// App config

var app = module.exports = express();

app.configure(function(){

	app.set('views', __dirname + '/views');
	app.engine('html', cons.swig);

	app.use(express.static(__dirname + '/static'));

    app.use(express.logger());
    app.use(express.cookieParser());

    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(app.router);
    app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
    
});

app.configure('development', function(){
	swig.init({ root: __dirname + '/views', allowErrors: true, cache: false });
});

app.configure('production', function(){
	swig.init({ root: __dirname + '/views', allowErrors: true, cache: true });
	app.use(express.errorHandler());
});

//

function generateSuggestion(length){

	var 
		firstnames	= ['Jean', 'Jacques', 'Pierre', 'Matthieu','Philippe', 'Barthelemy', 'Andre', 'Mr.', 'M.'],
		lastnames	= ['Roro', 'Hinhin', 'Coucou', 'Nonmais', 'Bahouais', 'Zyva', 'Pasdrole', 'Paetrus', 'Tetris'],
		headlines	= ['Glandeur agree', 'Je sais plus', 'Mr Oizo'],
		colors		= ['beige', 'whitesmoke', 'lavender', 'lavenderblush', 'honeydew', 'ghostwhite', 'bisque', 'lavender', 'beige']
	;
	
	var suggestions = {};
	
	while(length--){
		(function(){
			var
				fullName	= firstnames[Math.floor(Math.random()*firstnames.length)] + " " + lastnames[Math.floor(Math.random()*lastnames.length)],
				userId		= crypto.createHash('sha1').update(fullName + Math.random()).digest('hex')
			;
			suggestions[userId] = {
				userId		: userId,
				fullName	: fullName,
				headline 	: headlines[Math.floor(Math.random()*headlines.length)],
				userId		: userId,
				color		: colors[Math.floor(Math.random()*colors.length)]
			};
		}())
	};
	
	return suggestions;
	
}


var servicesDelay = 1500;
var keys = {
	fullName 	: '{%=fullName %}',
	userId 		: '{%=userId %}',
	color 		: '{%=color %}',
	headline 	: '{%=headline %}'
};

// Routes

app.get('/', function(req, res) { res.redirect('/async'); });

app.get('/sync', function(req, res) {
	res.render('playground.html', {suggestions : generateSuggestion(3), async : false, delay : servicesDelay, keys : keys});
});

app.get('/async', function(req, res) {
	res.render('playground.html', {suggestions : generateSuggestion(3), async : true, delay : servicesDelay, keys : keys});
});

// rest services

app.get('/r/suggestions', function(req, res) {
	setTimeout(function(){
		res.json({
			status : "SUCCESS",
			data : generateSuggestion(10)
		});
	}, servicesDelay);
});

app.del('/r/suggestions', function(req, res) {
	setTimeout(function(){
		res.json({
			status : "SUCCESS"
		});
	}, servicesDelay);
});

app.post('/r/contacts', function(req, res){
	setTimeout(function(){
		res.json({
			status : "SUCCESS"
		});
	}, servicesDelay);
});


// App server start

app.listen(3000, function(){
	console.log("Express server listening on port %d in %s mode", 3000, app.settings.env);
});
