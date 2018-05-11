var _logger = require('../common/Logger.js');
var _baseController = require('./BaseController.js');
var _heroDao = require('../hero/HeroDao.js');
var _mapDao = require('../map/MapDao.js');
var _mapFactory = require('../map/MapFactory.js');
var _loginDao = require('../login/LoginDao.js');

module.exports = 
function HeroController() {
	var _this = this;

    this.ChooseHero = function(postData) {
        // request ended -> do something with the data
        var gameSession = JSON.parse(postData);
        var serverLogin = _loginDao.Cache[gameSession.publicKey];
		_logger.logInfo("Login Cache=" +  JSON.stringify(_loginDao.Cache));
        if (serverLogin) {
            if (_heroDao.exists(gameSession.heroName)) {
                var loadedHero = _heroDao.load(gameSession.heroName);

                if (loadedHero) {
                    serverLogin.activeHero = loadedHero;
                    var currentBattle = _baseController.battleCache[serverLogin.activeHero.name];
                    var currentMap = _mapFactory.create(serverLogin.activeHero.currentMapKey);
                    var location = currentMap.getLocation(serverLogin.activeHero.currentCoordinates);
                    var data = { hero: loadedHero, battle: currentBattle, map: currentMap, status: 'Your active hero is now [' + loadedHero.name + ']!' };

                    return _baseController.JsonResult(200, JSON.stringify(data));
                }
            }
            else {
                return _baseController.JsonResult(500,'{ "reason": "Requested hero not found!"}');
            }
        }
        else {
            return _baseController.JsonResult(500,'{ "reason": "Public key not found, please login again!"}');
        }

    };

    this.CreateHero = function(postData) {
        _logger.logInfo(postData);
			var success = false;
			var newHero = {};
			var serverLogin = null;
			var gameSession = null;
			var serverLogin = null;

			try {
				gameSession = JSON.parse(postData);
				serverLogin = _loginDao.Cache[gameSession.publicKey]
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
					return _baseController.JsonResult(200, JSON.stringify(newHero));
				}
				else {
					_logger.logError("Unable to create new hero, as a hero with this name already exists!");
					return _baseController.JsonResult(500, '{ "error": "Unable to create new hero, as a hero with this name already exists!"}');
				}
			}
			else {
				_logger.logError("Unable to find public key, please try to login again!");
				return _baseController.JsonResult(500,'{ "error": "Unable to find public key, please try to login again!"}');
			}

			/*
			if(!_heroDao.exists(heroName)) {
				var newHero = new Hero(heroName, 20, 3, 3, ["melee", "magic"], "midgaard-main", {x:0,y:0,z:0});
				_heroDao.save(newHero);
				success = true;
			}*/
    };

    
}