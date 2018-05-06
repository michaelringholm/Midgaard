
var Logger = require('../common/Logger.js');

var _logger = new Logger();

module.exports = 
function GameSession(loginName) {
	var _this = this;
	this.publicKey = "";
	this.data = {};

	var generateUUID = function () {
		var d = new Date().getTime();
		var uuid = 'xxxxxxxx-xxxx-xxxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
			var r = (d + Math.random() * 16) % 16 | 0;
			d = Math.floor(d / 16);
			return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
		});
		return uuid;
	};

	this.construct = function (loginName) {
		_logger.logInfo("GameSession.construct called!");
		_this.publicKey = generateUUID() + "_" + loginName;
	};

	_this.construct(loginName);
}