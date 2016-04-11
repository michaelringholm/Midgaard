var Logger = require('../common/Logger.js');
var Location = require('../map/Location.js');

var _logger = new Logger();

module.exports = function MidgaardMainMap(mapDao, mobFactory) {
	var _this = this;
	this.key = "midgaard-main";
	this.name = "Midgaard main map";
	this.locations = new Array();
	this.rawMap = null;
	
	this.getLocation = function(targetCoordinates) {
		if( (targetCoordinates.x >= 0 && targetCoordinates.x <= 20) && (targetCoordinates.y >= 0 && targetCoordinates.y <= 20)  ) {
			var possibleMobKeys = ["rat", "beetle", "spider"];
			var mobProbability = 0.20;
			var mob = null;
			
			if(Math.random() < mobProbability) {
				//var mobIndex = Math.Round(Math.random()*possibleMobKeys.length));
				//var mob = 
				var mob = mobFactory.create();
			}
			
			_logger.logInfo("The raw map looks like this = [" + _this.rawMap + "]");
			var location = new Location({terrainType:"woodland", mob:mob});
			return location;
		}
		else 
			return null;
	};
	
	this.construct = function() {
		_logger.logInfo("MidgaardMainMap.construct");
		_this.rawMap = mapDao.load(_this.key);
	};
	
	_this.construct();
}