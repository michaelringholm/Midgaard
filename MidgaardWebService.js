var http = require('http');
var fs = require('fs');

// IMPORTS
var Logger = require('./common/Logger.js');
var MapDao = require('./map/MapDao.js');
var HeroDao = require('./hero/HeroDao.js');
var Hero = require('./hero/Hero.js');
var Battle = require('./battle/Battle.js');
var MobFactory = require('./mob/MobFactory.js');
var MapFactory = require('./map/MapFactory.js');
var MidgaardMainMap = require('./map/MidgaardMainMap.js');
var Coordinate = require('./map/Coordinate.js');
var Location = require('./map/Location.js');

var _logger = new Logger();
var _mapDao = new MapDao();
var _loginDao = new LoginDao();
var _hero = null;
var _heroCache = {};
var _loginCache = {};
var _battleCache = {};

var _heroDao = new HeroDao();
var _mapFactory = new MapFactory(_mapDao);
var _mobFactory = new MobFactory();

//var _mob = new MobFactory().create();
//var battle = new Battle(_hero, _mob);


/************************** LoginDao *************************/
function LoginDao() {
	var _this = this;
		
	this.exists = function(loginName) {
		_logger.logInfo("LoginDao.exists");
		var fs = require("fs");
		var fileName = "./logins/" + loginName + '.login';
			
		var fileFound = true;
		try {
			fs.accessSync(fileName, fs.F_OK);
			_logger.logInfo("File [" + fileName + "] exists!");
		}
		catch(e) {
			fileFound = false;
			_logger.logError("File [" + fileName + "] does not exist!");
		}
		return fileFound;
	};
	
	this.load = function(loginName) {
		_logger.logInfo("LoginDao.load");
		var fs = require("fs");
		var fileName = "./logins/" + loginName + ".login";
		var login = null;
		
		var heroJson = fs.readFileSync(fileName).toString();

		_logger.logInfo("Login JSON [" + heroJson + "] loaded!");		
		login = JSON.parse(heroJson);
		_logger.logInfo("Login [" + JSON.stringify(login) + "] loaded!");		
		
		return login;
	};	
	
	this.save = function(login) {
		_logger.logInfo("LoginDao.save");
		var fs = require("fs");
		
		var updateTime = new Date();
		//fs.writeFile(login.name + '.login', '{ "updateTime" : "' + updateTime + '", "login" : "' + JSON.stringify(login) + '" }',  function(err) {
			fs.writeFile("./logins/" + login.name + '.login', JSON.stringify(login),  function(err) {
			if (err) {
				return console.error(err);
			}
			console.log("Data written successfully!");
		});
	};	
	
	this.construct = function() {
		_logger.logInfo("LoginDao.construct");
  };
  
  _this.construct();
}

/********* Login *************/
function Login(name, password, heroes) {
	var _this = this;
	this.name = name;
	this.password = password;
	this.heroes = heroes;
	
	this.construct = function() {
		_logger.logInfo("Login.construct");
  };
  
  _this.construct();
}


/********** GameSession ***********/
function GameSession(loginName) {
	var _this = this;
	this.publicKey = "";
	this.data = {};
	
	var generateUUID = function() {
    var d = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-xxxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = (d + Math.random()*16)%16 | 0;
        d = Math.floor(d/16);
        return (c=='x' ? r : (r&0x3|0x8)).toString(16);
    });
    return uuid;
	};
	
	this.construct = function(loginName) {
		_logger.logInfo("GameSession.construct");
		_this.publicKey = generateUUID() + "_" + loginName;
  };
  
  _this.construct(loginName);
}

/*********** WEB SERVER ****************/
http.createServer(function (request, response) {
  //response.writeHead(200, {'Content-Type': 'text/plain'});
	
	response.setHeader("Access-Control-Allow-Origin", "*");
	response.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	response.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
	response.setHeader('Access-Control-Allow-Credentials', true);	
	
  _logger.logInfo("Request.url=" + request.url);
	_logger.logInfo("Request.method=" + request.method);
  
  if(request.url == "/about") {
		response.writeHead(200, {'Content-Type': 'application/json'});	
		response.write('{"author": "Michael Sundgaard", "company" : "Opus Magus"}');
		response.end();
  }
	
	else if(request.url == "/createLogin" && request.method == 'OPTIONS') {
		response.writeHead(200, {'Content-Type': 'application/json'});	
		response.end();
  }	
	else if(request.url == "/createLogin" && request.method == 'POST') {		
		var postData = "";
	
		request.on('data', function(chunk) {
			// append the current chunk of data to the postData variable
			postData += chunk.toString();
		});
		
		request.on('end', function() {			
			// request ended -> do something with the data
			_logger.logInfo("creating login for [" + postData + "].....");
			var loginRequest = JSON.parse(postData);
			
			if(loginRequest && loginRequest.name && loginRequest.name.length > 5) {
				if(loginRequest.password == loginRequest.repeatedPassword) {
					_loginDao.save(loginRequest);
					response.writeHead(200, {'Content-Type': 'application/json'});
					response.write('{ "status": "success"}');
				}
				else {
					response.writeHead(500, {'Content-Type': 'application/json'});	
					response.write('{ "reason": "Password and repeated password do not match!"}');
				}
			}
			else {
				response.writeHead(500, {'Content-Type': 'application/json'});	
				response.write('{ "reason": "Login is too short, please use at least 5 characters!"}');
			}
			
			response.end();
		});		
  }
	
	else if(request.url == "/login" && request.method == 'OPTIONS') {
		response.writeHead(200, {'Content-Type': 'application/json'});
		response.end();
  }	
	else if(request.url == "/login" && request.method == 'POST') {		
		var postData = "";
	
		request.on('data', function(chunk) {
			// append the current chunk of data to the postData variable
			postData += chunk.toString();
		});
		
		request.on('end', function() {			
			// request ended -> do something with the data
			_logger.logInfo("Logging in [" + postData + "].....");
			var clientLogin = JSON.parse(postData);
			
			if(_loginDao.exists(clientLogin.name)) {
				var serverLogin = _loginDao.load(clientLogin.name);
				
				if(serverLogin) {
					if(serverLogin.name == clientLogin.name && serverLogin.password == clientLogin.password) {
						response.writeHead(200, {'Content-Type': 'application/json'});
						var gameSession = new GameSession(serverLogin.name);
						gameSession.data = serverLogin;
						serverLogin.activeHero = null;
						_logger.logInfo("publicKey=[" + gameSession.publicKey + "]");
						_loginCache[gameSession.publicKey] = serverLogin;
						response.write(JSON.stringify(gameSession));
					}
					else {
						response.writeHead(500, {'Content-Type': 'application/json'});	
						response.write('{ "reason": "Wrong login or password!"}');
					}
				}
			}
			else {
				response.writeHead(500, {'Content-Type': 'application/json'});	
				response.write('{ "reason": "login does not exist!"}');
			}
		
			response.end();
		});		
  }	
	
	else if(request.url == "/chooseHero" && request.method == 'OPTIONS') {
		response.end();
  }	
	else if(request.url == "/chooseHero" && request.method == 'POST') {		
		var postData = "";
	
		request.on('data', function(chunk) {
			// append the current chunk of data to the postData variable
			postData += chunk.toString();
		});
		
		request.on('end', function() {			
			// request ended -> do something with the data
			var gameSession = JSON.parse(postData);
			var serverLogin = _loginCache[gameSession.publicKey];
			
			if(serverLogin) {
				if(_heroDao.exists(gameSession.heroName)) {
					var loadedHero = _heroDao.load(gameSession.heroName);
					
					if(loadedHero) {
						serverLogin.activeHero = loadedHero;
						response.writeHead(200, {'Content-Type': 'application/json'});
						var currentBattle = _battleCache[serverLogin.activeHero.name];
						var data = { hero: loadedHero, battle:currentBattle, status:'Your active hero is now [' + loadedHero.name + ']!' };
						response.write(JSON.stringify(data));
					}
				}
				else {
					response.writeHead(500, {'Content-Type': 'application/json'});	
					response.write('{ "reason": "Requested hero not found!"}');
				}
			}
			else {
				response.writeHead(500, {'Content-Type': 'application/json'});	
				response.write('{ "reason": "Public key not found, please login again!"}');
			}
			
			response.end();
		});
	}
	
	else if(request.url == "/move" && request.method == 'OPTIONS') {
		response.end();
  }	
	else if(request.url == "/move" && request.method == 'POST') {		
		var postData = "";
	
		request.on('data', function(chunk) {
			// append the current chunk of data to the postData variable
			postData += chunk.toString();
		});
		
		request.on('end', function() {			
			var gameSession = JSON.parse(postData);			
			var serverLogin = _loginCache[gameSession.publicKey];
			
			if(serverLogin) {
				var direction = gameSession.direction;
				
				if(direction == "west" || direction == "east" || direction == "north" || direction == "south") {										
					if(serverLogin.activeHero) {
					
						if(_battleCache[serverLogin.activeHero.name]) {
							response.writeHead(200, {'Content-Type': 'application/json'});
							var battle = _battleCache[serverLogin.activeHero.name];
							response.write(JSON.stringify(battle));
						}
						else {
							serverLogin.activeHero.currentCoordinates;
							var location = serverLogin.activeHero.move(direction, _mapFactory, _battleCache);
							
							if(location) {
								_heroDao.save(serverLogin.activeHero);
								response.writeHead(200, {'Content-Type': 'application/json'});

								var battle = _battleCache[serverLogin.activeHero.name];
								if(battle)
									response.write(JSON.stringify(battle));
								else
									response.write(JSON.stringify(location));
							}
							else {
								response.writeHead(500, {'Content-Type': 'application/json'});	
								response.write('{ "reason": "Invalid location!"}');
							}
						}
					}
					else {
						response.writeHead(500, {'Content-Type': 'application/json'});	
						response.write('{ "reason": "No active hero found, please choose a hero!"}');
					}
				}
				else {
					response.writeHead(500, {'Content-Type': 'application/json'});	
					response.write('{ "reason": "Invalid direction [' + direction + ']!"}');
				}
			}
			else {
				response.writeHead(500, {'Content-Type': 'application/json'});	
				response.write('{ "reason": "Public key not found, please login again!"}');
			}
			
			response.end();
		});		
  }		
  
	else if(request.url == "/save" && request.method == 'OPTIONS') {
		response.end();
	}
	else if(request.url == "/save" && request.method == 'POST') {
		var fullBody = '';
	
		request.on('data', function(chunk) {
			// append the current chunk of data to the fullBody variable
			fullBody += chunk.toString();
		});
		
		request.on('end', function() {			
			// request ended -> do something with the data
			saveFile(fullBody);
			response.write('{ "status": "success"}');
			response.end();
		});
  }
  
	else if(request.url == "/nextRound" && request.method == 'OPTIONS') {
		response.end();
	}	
	else if(request.url == "/nextRound" && request.method == 'POST') {		
		var postData = "";
	
		request.on('data', function(chunk) {
			// append the current chunk of data to the postData variable
			postData += chunk.toString();
		});
		
		request.on('end', function() {			
			var gameSession = JSON.parse(postData);			
			var serverLogin = _loginCache[gameSession.publicKey];
			
			if(serverLogin) {
				var attackType = gameSession.attackType;
				
				if(attackType == "Melee" || attackType == "Healing I" || attackType == "Weakness I" || attackType == "Strength I") {										
					if(serverLogin.activeHero) {						
						var battle = _battleCache[serverLogin.activeHero.name];

						if(battle) {
							battle.nextRound();
							response.write(JSON.stringify(battle));
						}
						else {
							response.writeHead(500, {'Content-Type': 'application/json'});	
							response.write('{ "reason": "Battle not found!"}');
						}
					}
					else {
						response.writeHead(500, {'Content-Type': 'application/json'});	
						response.write('{ "reason": "No active hero found, please choose a hero!"}');
					}
				}
				else {
					response.writeHead(500, {'Content-Type': 'application/json'});	
					response.write('{ "reason": "Invalid attack type [' + attackType + ']!"}');
				}
			}
			else {
				response.writeHead(500, {'Content-Type': 'application/json'});	
				response.write('{ "reason": "Public key not found, please login again!"}');
			}
			
			response.end();
		});		
  }		
	
	else if(request.url == "/createHero" && request.method == 'OPTIONS') {
		response.end();
	}	
	else if(request.url == "/createHero" && request.method == 'POST') {
	
		var success = false;
		var newHero = {};
		
		var postData = '';
	
		request.on('data', function(chunk) {
			// append the current chunk of data to the fullBody variable
			postData += chunk.toString();
		});
		
		request.on('end', function() {
			// request ended -> do something with the data				
			
			_logger.logInfo(postData);
			var serverLogin = null;
			var gameSession = null;
			var serverLogin  = null;
			
			try {
				gameSession = JSON.parse(postData);			
				serverLogin = _loginCache[gameSession.publicKey]
			}
			catch(ex) {
				_logger.logError(ex);
			}
			
			if(serverLogin) {
				_logger.logInfo("Public key found!, creating a new hero...");
				
				var newHeroRequest = gameSession.data;
				
				if(!_heroDao.exists(newHeroRequest.name)) {
					var newHero = new Hero( { name:newHeroRequest.name, hp:20, atk:3, luck:3, atkTypes:["melee", "magic"], currentMapKey:"midgaard-main", currentCoordinates:new Coordinate({x:0,y:0,z:0}) } );
					_heroDao.save(newHero);
					if(!serverLogin.heroes)
						serverLogin.heroes = {};
					
					serverLogin.heroes[newHero.name] = newHero.name;
					_loginDao.save(serverLogin);
				
					response.writeHead(200, {'Content-Type': 'application/json'});
					response.write(JSON.stringify(newHero));
				}
				else {
					_logger.logError("Unable to create new hero, as a hero with this name already exists!");
					response.writeHead(500, {'Content-Type': 'application/json'});
					response.write('{ "error": "Unable to create new hero, as a hero with this name already exists!"}');
				}
			}
			else {
				_logger.logError("Unable to find public key, please try to login again!");
				response.writeHead(500, {'Content-Type': 'application/json'});
				response.write('{ "error": "Unable to find public key, please try to login again!"}');
			}
			
			/*
			if(!_heroDao.exists(heroName)) {
				var newHero = new Hero(heroName, 20, 3, 3, ["melee", "magic"], "midgaard-main", {x:0,y:0,z:0});
				_heroDao.save(newHero);
				success = true;
			}*/
	
			response.end();
		});
  }
	
	else if(request.url == "/leaveTown" && request.method == 'OPTIONS') {
		response.end();
	}	
	else if(request.url == "/leaveTown" && request.method == 'POST') {			
		var postData = '';
	
		request.on('data', function(chunk) {
			postData += chunk.toString();
		});
		
		request.on('end', function() {
			_logger.logInfo(postData);
			var gameSession = null;
			var serverLogin  = null;
			
			try {
				gameSession = JSON.parse(postData);			
				serverLogin = _loginCache[gameSession.publicKey]
			}
			catch(ex) {
				_logger.logError(ex);
			}
			
			if(serverLogin) {				
				if(serverLogin.activeHero) {
					var currentMap = _mapFactory.create(serverLogin.activeHero.currentMapKey);				
				
					response.writeHead(200, {'Content-Type': 'application/json'});
					var data = { map:currentMap, hero:serverLogin.activeHero };
					response.write(JSON.stringify(data));
				}
				else {
					_logger.logError("No hero selected!");
					response.writeHead(500, {'Content-Type': 'application/json'});
					response.write('{ "error": "No hero selected!, please select one of your heroes, or create a new one!"}');
				}
			}
			else {
				_logger.logError("Unable to find public key, please try to login again!");
				response.writeHead(500, {'Content-Type': 'application/json'});
				response.write('{ "error": "Unable to find public key, please try to login again!"}');
			}
				
			response.end();
		});
  }	
  
	else {
		response.writeHead(500, {'Content-Type': 'application/json'});	
		response.write("Unhandled url requested or wrong data method defined!");
		response.end();
  }
}).listen(1337, "127.0.0.1");

_logger.logInfo('Server running at http://127.0.0.1:1337/');




/***** OBSOLETE ******
if (req.method == 'POST') {
    console.log("[200] " + req.method + " to " + req.url);
    var fullBody = '';
    
    req.on('data', function(chunk) {
      // append the current chunk of data to the fullBody variable
      fullBody += chunk.toString();
    });
    
    req.on('end', function() {
    
      // request ended -> do something with the data
      res.writeHead(200, "OK", {'Content-Type': 'text/html'});
      
      // parse the received body data
      var decodedBody = querystring.parse(fullBody);

      // output the decoded data to the HTTP response          
      res.write('<html><head><title>Post data</title></head><body><pre>');
      res.write(utils.inspect(decodedBody));
      res.write('</pre></body></html>');
      
      res.end();
    });
    
  }
/*
user.js

module.exports = function User()
{
    //...
}
server.js

var User = require('./user.js');
var user = new User();
*/