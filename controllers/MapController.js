var Logger = require('../common/Logger.js');

var _logger = new Logger();

module.exports = 
function MapController() {
    var _this = this;

    this.move = function() {
        var gameSession = JSON.parse(postData);
        var serverLogin = _loginCache[gameSession.publicKey];

        if (serverLogin) {
            var direction = gameSession.direction;

            if (direction == "west" || direction == "east" || direction == "north" || direction == "south") {
                if (serverLogin.activeHero) {

                    if (_battleCache[serverLogin.activeHero.name]) {
                        response.writeHead(200, { 'Content-Type': 'application/json' });
                        var battle = _battleCache[serverLogin.activeHero.name];
                        response.write(JSON.stringify(battle));
                    }
                    else {
                        serverLogin.activeHero.currentCoordinates;
                        var location = serverLogin.activeHero.move(direction, _battleCache);

                        if (location) {
                            _heroDao.save(serverLogin.activeHero);
                            response.writeHead(200, { 'Content-Type': 'application/json' });

                            var battle = _battleCache[serverLogin.activeHero.name];
                            if (battle)
                                response.write(JSON.stringify(battle));
                            else
                                response.write(JSON.stringify(location));
                        }
                        else {
                            response.writeHead(500, { 'Content-Type': 'application/json' });
                            response.write('{ "reason": "Invalid location!"}');
                        }
                    }
                }
                else {
                    response.writeHead(500, { 'Content-Type': 'application/json' });
                    response.write('{ "reason": "No active hero found, please choose a hero!"}');
                }
            }
            else {
                response.writeHead(500, { 'Content-Type': 'application/json' });
                response.write('{ "reason": "Invalid direction [' + direction + ']!"}');
            }
        }
        else {
            response.writeHead(500, { 'Content-Type': 'application/json' });
            response.write('{ "reason": "Public key not found, please login again!"}');
        }
    };  
}