var http = require('http');
var fs = require('fs');

var _hero = {name: "Bjorn", hp:18, atk:3, luck:3, atkTypes:["melee", "magic"]};
var _mob = new MobFactory().create();
var battle = new Battle(_hero, _mob);

function logInfo(msg) {
	console.log('[INFO]:' + msg);
}

function logError(msg) {
	console.log('[ERROR]:' + msg);
}

function saveFile(customData) {
	var fs = require("fs");

	console.log("Going to write into existing file");
	var updateTime = new Date();
	fs.writeFile('save.dat', '{ "map" : "general", "position": "10,25", "updateTime" : "' + updateTime + '", "customData" : "' + customData + '" }',  function(err) {
		if (err) {
			return console.error(err);
		}
		console.log("Data written successfully!");
	});
}

/**********************/


/****** battle ************/
function Battle(hero, mob) {
	var _this = this;
	if(!hero || !mob) {
		logError("Hero or mob was null!");
		return;
	}
	
	this.hero = hero;
  this.mob =  mob;
	this.status = {over:false, winner:"", loser:""};
  
	this.getVersion = function() {
	return "0.0.0.2";  
  };
  
  this.drawB = function() {
  	_this.drawP(_this.hero);
    _this.drawP(_this.mob);
  };
  
  this.drawP = function(p) {
  	//$(p.div).html("a:" + p.a + " # h:" + p.h);
  };
  
  this.attack = function(attacker, defender) {
		logInfo("Battle.attack");
  	defender.hp = defender.hp - attacker.atk;
  };
  
  this.getFirstUp = function(playerX, playerY) {
  	if(playerX.luck > playerY.luck)
    	return playerX;
    
    return playerY;
  };
  
  this.getSecondUp = function(playerX, playerY) {
  	if(playerX.luck > playerY.luck)
    	return playerY;
    
    return pX;
  };
  
  this.updateStatus = function(msg) {
  	//$("#status").html(msg);
  };
  
  this.battleEnded = function(winner, loser) {
		_this.status.winner = winner.name;
		_this.status.loser = loser.name;
		_this.updateStatus(winner.name + " W! and " + loser.name + " L!");
  };
  
  this.nextRound = function(heroAtkType, mobAtkType) {
  	logInfo("Battle.nextRound");
    
    if(_this.status.over) {
			logInfo("battle is over!");
    	return;
		}
      
  	var firstUp = _this.getFirstUp(_this.hero, _this.mob);
    var secondUp = _this.getSecondUp(_this.hero, _this.mob);
    
  	_this.attack(firstUp, secondUp);
    
    if(secondUp.hp <= 0) {
			_this.battleEnded(firstUp, secondUp);
			_this.status.over = true;
    }
    else {
    	_this.attack(secondUp, firstUp);
    	
      if(firstUp.hp <= 0) {
				_this.battleEnded(secondUp, firstUp);
      	_this.status.over = true;
      }
    }
    
    logInfo(JSON.stringify(_this.hero));
		logInfo(JSON.stringify(_this.mob));
    //_this.drawP(_this.he);
    //_this.drawP(_this.mo);
  };
  
  this.construct = function() {
		logInfo("Battle.construct");
  	/*_this.drawB();
  	$("#nextR").click(function() { 
    	_this.nextR( {aT:"mel"}, {aT:"mel"} ); 
    });*/
  };
  
  _this.construct();
}



/****** MobFactory ************/
function MobFactory() {
	var _this = this;
	this.mobs = {};
	this.mobKeys = new Array();
	
	this.create = function() {
		logInfo("MobFactory.create");

		var randomIndex = Math.round(Math.random()*_this.mobKeys.length);
		var randomMobKey = _this.mobKeys[randomIndex];
		var randomMob = _this.mobs[randomMobKey];
		
		if(randomMob)
			logInfo(JSON.stringify(randomMob));
		else
			logError("No mob found!");
		
		return randomMob;
	};
	
	this.addMob = function(mob) {
		logInfo("MobFactory.addMob");
		logInfo("name=" + mob.key);
		_this.mobKeys.push(mob.key);		
		_this.mobs[mob.key] = mob;
	};
	
	this.construct = function() {
		logInfo("MobFactory.construct");
		_this.addMob({key: "rat", name: "Rat", hp:18, atk:3, luck:2, atkTypes:["melee", "ranged"]});
		_this.addMob({key: "deer", name: "Deer", hp:22, atk:1, luck:2, atkTypes:["melee"]});
		_this.addMob({key: "rabbit", name: "Rabbit", hp:22, atk:1, luck:2, atkTypes:["melee"]});
		_this.addMob({key: "snake", name: "Snake", hp:22, atk:1, luck:2, atkTypes:["melee"]});
		_this.addMob({key: "beetle", name: "Beetle", hp:22, atk:1, luck:2, atkTypes:["melee"]});
	};
	
	_this.construct();
}



/*********** WEB SERVER ****************/
http.createServer(function (request, response) {
  response.writeHead(200, {'Content-Type': 'text/plain'});
  console.log(request.url);
  
  if(request.url == "/about") {
	response.write('{"author": "Michael Sundgaard", "company" : "Opus Magus"}');
	response.end();
  }
  if(request.url == "/save") {
		if (request.method == 'POST') {
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
		else {
			saveFile();
			response.write('{ "status": "success"}');
			response.end();
		}
  }
  else if(request.url == "/nextRound") {
		battle.nextRound();
		response.write('{ "hero":' + JSON.stringify(battle.hero) + ', mob":' + JSON.stringify(battle.mob) + ', "status": ' + JSON.stringify(battle.status) +  ', "version":"' + battle.getVersion() + '" }');	
		response.end();
  }
  else {
	fs.readFile('save.dat', (err, data) => {		
		if (err) throw err;
		response.write(data);
		response.end();
	});
  }
}).listen(1337, "127.0.0.1");

logInfo('Server running at http://127.0.0.1:1337/');














/*
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
  */