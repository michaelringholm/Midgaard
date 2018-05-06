var Logger = require('../common/Logger.js');

var _logger = new Logger();

module.exports = 
function HeroController() {
    var _this = this;

    this.Train = function(postData, response) {
        _logger.logInfo("HeroController.Train called!");
        _logger.logInfo(JSON.stringify(postData));
    };

    this.ChooseHero = function(postData, response) {
        // request ended -> do something with the data
        var gameSession = JSON.parse(postData);
        var serverLogin = _loginCache[gameSession.publicKey];

        if (serverLogin) {
            if (_heroDao.exists(gameSession.heroName)) {
                var loadedHero = _heroDao.load(gameSession.heroName);

                if (loadedHero) {
                    serverLogin.activeHero = loadedHero;
                    response.writeHead(200, { 'Content-Type': 'application/json' });
                    var currentBattle = _battleCache[serverLogin.activeHero.name];

                    var currentMap = _mapFactory.create(serverLogin.activeHero.currentMapKey);
                    var location = currentMap.getLocation(serverLogin.activeHero.currentCoordinates);

                    var data = { hero: loadedHero, battle: currentBattle, map: currentMap, status: 'Your active hero is now [' + loadedHero.name + ']!' };

                    response.write(JSON.stringify(data));
                }
            }
            else {
                response.writeHead(500, { 'Content-Type': 'application/json' });
                response.write('{ "reason": "Requested hero not found!"}');
            }
        }
        else {
            response.writeHead(500, { 'Content-Type': 'application/json' });
            response.write('{ "reason": "Public key not found, please login again!"}');
        }

    };

    this.CreateHero = function(postData, response) {
        _logger.logInfo(postData);
			var success = false;
			var newHero = {};
			var serverLogin = null;
			var gameSession = null;
			var serverLogin = null;

			try {
				gameSession = JSON.parse(postData);
				serverLogin = _loginCache[gameSession.publicKey]
			}
			catch (ex) {
				_logger.logError(ex);
			}

			if (serverLogin) {
				_logger.logInfo("Public key found!, creating a new hero...");

				var newHeroRequest = gameSession.data;

				if (!_heroDao.exists(newHeroRequest.name)) {
					var newHero = new Hero({ name: newHeroRequest.name, heroClass: "warrior", xp: 0, baseHp: 20, hp: 20, baseMana: 0, mana: 0, sta: 14, str: 12, int: 6, atk: 3, luck: 3, atkTypes: ["melee", "magic"], currentMapKey: "midgaard-main", currentCoordinates: new Coordinate({ x: 0, y: 0, z: 0 }) });
					_heroDao.save(newHero);
					if (!serverLogin.heroes)
						serverLogin.heroes = {};

					serverLogin.heroes[newHero.name] = newHero.name;
					_loginDao.save(serverLogin);

					response.writeHead(200, { 'Content-Type': 'application/json' });
					response.write(JSON.stringify(newHero));
				}
				else {
					_logger.logError("Unable to create new hero, as a hero with this name already exists!");
					response.writeHead(500, { 'Content-Type': 'application/json' });
					response.write('{ "error": "Unable to create new hero, as a hero with this name already exists!"}');
				}
			}
			else {
				_logger.logError("Unable to find public key, please try to login again!");
				response.writeHead(500, { 'Content-Type': 'application/json' });
				response.write('{ "error": "Unable to find public key, please try to login again!"}');
			}

			/*
			if(!_heroDao.exists(heroName)) {
				var newHero = new Hero(heroName, 20, 3, 3, ["melee", "magic"], "midgaard-main", {x:0,y:0,z:0});
				_heroDao.save(newHero);
				success = true;
			}*/
    };

    
}