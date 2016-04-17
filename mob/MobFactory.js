var Logger = require('../common/Logger.js');
var _logger = new Logger();

module.exports = function MobFactory() {
	var _this = this;
	this.mobs = {};
	this.mobKeys = new Array();
	
	this.create = function() {
		_logger.logInfo("MobFactory.create");

		var randomIndex = Math.round(Math.random()*(_this.mobKeys.length-1));
		var randomMobKey = _this.mobKeys[randomIndex];
		var randomMob = _this.mobs[randomMobKey];
		
		if(randomMob)
			_logger.logInfo(JSON.stringify(randomMob));
		else
			_logger.logError("No mob found!");
		
		return randomMob;
	};
	
	this.addMob = function(mob) {
		_logger.logInfo("MobFactory.addMob");
		_logger.logInfo("name=" + mob.key);
		_this.mobKeys.push(mob.key);		
		_this.mobs[mob.key] = mob;
	};
	
	this.construct = function() {
		_logger.logInfo("MobFactory.construct");
		/*_this.addMob({key: "rat", name: "Rat", hp:12, atk:3, luck:2, atkTypes:["melee", "ranged"], xp:5, gold:0, silver:0, copper:2, items:[]});
		_this.addMob({key: "deer", name: "Deer", hp:22, atk:1, luck:2, atkTypes:["melee"], xp:7, gold:0, silver:0, copper:3, items:[]});
		_this.addMob({key: "rabbit", name: "Rabbit", hp:14, atk:1, luck:2, atkTypes:["melee"], xp:5, gold:0, silver:0, copper:1, items:[]});
		_this.addMob({key: "snake", name: "Snake", hp:19, atk:1, luck:2, atkTypes:["melee"], xp:8, gold:0, silver:0, copper:5, items:[]});
		_this.addMob({key: "beetle", name: "Beetle", hp:15, atk:1, luck:2, atkTypes:["melee"], xp:15, gold:0, silver:0, copper:6, items:[]});*/
		_this.addMob({key: "orc", name: "Orc", hp:30, atk:4, luck:2, atkTypes:["melee"], xp:40, gold:0, silver:1, copper:6, items:[]});
	};
	
	_this.construct();
}