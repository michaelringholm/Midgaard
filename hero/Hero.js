var Logger = require('../common/Logger.js');
var Battle = require('../battle/Battle.js');
var Coordinate = require('../map/Coordinate.js');

var _logger = new Logger();

module.exports = function Hero(anonObj) {
	var _this = this;
	this.name = "";
	this.baseHp = 0;
	this.hp = 0;
	this.xp = 0;
	this.level = 1;
	this.str = 0;
	this.sta = 0;
	this.atk = 0;
	this.luck = 0;
	this.gold = 0;
	this.silver = 0;
	this.copper = 0;
	this.items = [];
	this.atkTypes = [];
	this.currentMapKey = "";
	this.currentCoordinates = {};
	
	// east, west, north, south, up, down
	this.move = function(direction, mapFactory, battleCache)  {
		_logger.logInfo("Hero.move");
		var targetCoordinates = new Coordinate(_this.currentCoordinates);
		if(direction == "west")
			targetCoordinates.x--;
		else if(direction == "east")
			targetCoordinates.x++;
		else if(direction == "north")
			targetCoordinates.y--;		
		else if(direction == "south")
			targetCoordinates.y++;
		
		_logger.logInfo("targetCoordinates=[" + JSON.stringify(targetCoordinates) + "]");
		
		var targetLocation = mapFactory.create(_this.currentMapKey).getLocation(targetCoordinates);
		
		if(targetLocation) {
			_this.currentCoordinates = targetCoordinates;
			if(targetLocation.mob) {
				battleCache[_this.name] = new Battle(this, targetLocation.mob);
			}
		}
		
		return targetLocation;
	};
	
	this.construct = function() {
		_logger.logInfo("Hero.construct");
    for (var prop in anonObj) this[prop] = anonObj[prop];
  };
  
  _this.construct();
}