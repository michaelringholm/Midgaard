var _logger = require('../common/Logger.js');

module.exports =
function SmithyController() {
    var _this = this;

    this.BuyItem = function (data) {
        _logger.logInfo("SmithyController.BuyItem called!");
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
            if (serverLogin.activeHero) {
                response.writeHead(200, { 'Content-Type': 'application/json' });
                _logger.logInfo("wants to buy an item!");
                var data = null;
                var currentMap = _mapFactory.create(serverLogin.activeHero.currentMapKey);
                var location = currentMap.getLocation(serverLogin.activeHero.currentCoordinates);
                eval["SmithyController"]["BuyItem"](gameSession);

                if (location.town) {
                    if (gameSession.itemKey) {
                        var buyResponse = _smithy.buyItem(gameSession.itemKey, serverLogin.activeHero);
                        data = { map: currentMap, hero: serverLogin.activeHero, town: location.town };
                        data.smithy = _smithy;
                        data.buyResponse = buyResponse;
                        _heroDao.save(serverLogin.activeHero);
                    }
                    else {
                        _logger.logError("No item selected!");
                        response.writeHead(500, { 'Content-Type': 'application/json' });
                        response.write('{ "error": "No item selected!, please select an item to buy!"}');
                    }
                }
                else {
                    data = { map: currentMap, hero: serverLogin.activeHero, reason: "You have to be in a town to visit the smithy!" };
                }
                response.write(JSON.stringify(data));
            }
            else {
                _logger.logError("No hero selected!");
                response.writeHead(500, { 'Content-Type': 'application/json' });
                response.write('{ "error": "No hero selected!, please select one of your heroes, or create a new one!"}');
            }
        }
        else {
            _logger.logError("Unable to find public key, please try to login again!");
            response.writeHead(500, { 'Content-Type': 'application/json' });
            response.write('{ "error": "Unable to find public key, please try to login again!"}');
        }
    };
}