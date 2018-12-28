var _logger = require('../common/Logger.js');
var _guid = require('../common/GUID.js');

module.exports = 
function GameSession(loginName) {
	var _this = this;
	this.publicKey = "";
	this.data = {};

	this.construct = function (loginName) {
		_logger.logInfo("GameSession.construct called!");
		_this.publicKey = _guid.generateGUID() + "_" + loginName;
	};

	_this.construct(loginName);
}