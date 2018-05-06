var Logger = require('../common/Logger.js');
var _logger = new Logger();

var LoginDao = require('../login/LoginDao.js');
var _loginDao = new LoginDao();


module.exports = 
function LoginController() {
    var _this = this;

    this.CreateLogin = function(postData, response) {
        _logger.logInfo("LoginController.Login called!");
        _logger.logInfo("creating login for [" + postData + "].....");
        var loginRequest = JSON.parse(postData);

        if (loginRequest && loginRequest.name && loginRequest.name.length > 5) {
            if (loginRequest.password == loginRequest.repeatedPassword) {
                _loginDao.save(loginRequest);
                response.writeHead(200, { 'Content-Type': 'application/json' });
                response.write('{ "status": "success"}');
            }
            else {
                response.writeHead(500, { 'Content-Type': 'application/json' });
                response.write('{ "reason": "Password and repeated password do not match!"}');
            }
        }
        else {
            response.writeHead(500, { 'Content-Type': 'application/json' });
            response.write('{ "reason": "Login is too short, please use at least 5 characters!"}');
        }
    };

    this.Login = function(postData, response) {
        _logger.logInfo("Logging in [" + postData + "].....");
        var clientLogin = JSON.parse(postData);

        if (_loginDao.exists(clientLogin.name)) {
            var serverLogin = _loginDao.load(clientLogin.name);

            if (serverLogin) {
                if (serverLogin.name == clientLogin.name && serverLogin.password == clientLogin.password) {
                    response.writeHead(200, { 'Content-Type': 'application/json' });
                    var gameSession = new GameSession(serverLogin.name);
                    gameSession.data = serverLogin;
                    serverLogin.activeHero = null;
                    _logger.logInfo("publicKey=[" + gameSession.publicKey + "]");
                    _loginCache[gameSession.publicKey] = serverLogin;
                    response.write(JSON.stringify(gameSession));
                }
                else {
                    response.writeHead(500, { 'Content-Type': 'application/json' });
                    response.write('{ "reason": "Wrong login or password!"}');
                }
            }
        }
        else {
            response.writeHead(500, { 'Content-Type': 'application/json' });
            response.write('{ "reason": "login does not exist!"}');
        }
    };
}