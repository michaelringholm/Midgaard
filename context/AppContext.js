var Logger = require('../common/Logger.js');
var _logger = new Logger();

module.exports = function AppContext() {
	var _this = this;
	
	this.getAppRoot = function() {
		return "./";
	};
	
	this.getHostIp = function() {
		return "127.0.0.1";
	};
	
	this.getHostPort = function() {
		return 1337;
	};	
	
	this.construct = function() {
		_logger.logInfo("AppContext.construct");
  };
  
  _this.construct();
}