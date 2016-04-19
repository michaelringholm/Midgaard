var Logger = require('../common/Logger.js');
var _logger = new Logger();

module.exports = function Login(name, password, heroes) {
	var _this = this;
	this.name = name;
	this.password = password;
	this.heroes = heroes;
	
	this.construct = function() {
		_logger.logInfo("Login.construct");
  };
  
  _this.construct();
}