var _logger = require('../common/Logger.js');
var _baseController = require('./BaseController.js');
var _battleDao = require('../battle/BattleDao.js');
var _heroDao = require('../hero/HeroDao.js');
var _mapFactory = require('../map/MapFactory.js');
var _loginDao = require('../login/LoginDao.js');

function BattleController() {
    var _this = this;
    this.battleCache = {};

    this.NextRound = function(postData) {
        var gameSession = JSON.parse(postData);
        var serverLogin = _loginDao.Cache[gameSession.publicKey];

        if (serverLogin) {
            var attackType = gameSession.attackType;

            if (attackType == "melee" || attackType == "healing I" || attackType == "weakness I" || attackType == "strength I") {
                if (serverLogin.activeHero) {
                    var battle = _this.battleCache[serverLogin.activeHero.heroId];

                    if (battle) {
                        battle.hero.currentBattleAction = attackType;
                        battle.mob.currentBattleAction = "melee";
                        battle.nextRound();
                        _heroDao.save(serverLogin.activeHero);
                        _battleDao.save(_this.battleCache);

                        if (battle.status.over) {
                            delete _this.battleCache[serverLogin.activeHero.name];
                            var data = { hero: serverLogin.activeHero, battle: battle };
                            return _baseController.JsonResult(200, data);
                        }
                        else {
                            var data = { hero: serverLogin.activeHero, battle: battle };
                            return _baseController.JsonResult(200, (data));
                        }
                    }
                    else {
                        var currentMap = _mapFactory.create(serverLogin.activeHero.currentMapKey);
                        var data = { map: currentMap, hero: serverLogin.activeHero, status: "Battle not found!" };
                        return _baseController.JsonResult(200, data);
                    }
                }
                else {
                    return _baseController.JsonResult(500,{ "reason": "No active hero found, please choose a hero!"});
                }
            }
            else {
                return _baseController.JsonResult(500,{ "reason": "Invalid attack type [' + attackType + ']!"});
            }
        }
        else {
            return _baseController.JsonResult(500,{ "reason": "Public key not found, please login again!"});
        }
    };

    this.Flee = function() {
        var gameSession = JSON.parse(postData);
        var serverLogin = _loginDao.Cache[gameSession.publicKey];

        if (serverLogin) {

            if (serverLogin.activeHero) {
                var battle = _this.battleCache[serverLogin.activeHero.heroId];

                if (battle) {
                    battle.flee();                    
                    _heroDao.save(serverLogin.activeHero);
                    _battleDao.save(_this.battleCache);
                    if (battle.status.over)
                        delete _this.battleCache[serverLogin.activeHero.heroId];

                    var data = { hero: serverLogin.activeHero, battle: battle };
                }
                else {
                    var currentMap = _mapFactory.create(serverLogin.activeHero.currentMapKey);
                    var data = { map: currentMap, hero: serverLogin.activeHero, status: "Battle not found!" };                    
                }
                return _baseController.JsonResult(200, data);
            }
            else {
                return _baseController.JsonResult(500, { "reason": "No active hero found, please choose a hero!"});
            }
        }
        else {
            return _baseController.JsonResult(500, { "reason": "Public key not found, please login again!"});
        }
    };

    this.construct = function() {
        _logger.logInfo("BattleDao.construct");
        _this.battleCache = _battleDao.load();
  	};
  
  _this.construct();
}

module.exports = new BattleController();