var Logger = require('../common/Logger.js');
var MidgaardMainMap = require('../map/MidgaardMainMap.js');

var _logger = new Logger();

module.exports = function MapFactory(mapDao) {
	var _this = this;
	this.maps = {};
	var mapDao = mapDao;
	
	this.create = function(mapKey) {
		_logger.logInfo("MapFactory.create");
		var map = _this.maps[mapKey];
		return map;
	};
	
	this.addMap = function(map) {
		_logger.logInfo("MapFactory.addMap");
		_this.maps[map.key] = map;
	};
	
	this.construct = function() {
		_logger.logInfo("MobFactory.construct");
		_this.addMap(new MidgaardMainMap(mapDao));
	};
	
	_this.construct();
}