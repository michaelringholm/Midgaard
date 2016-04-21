var Logger = require('../common/Logger.js');
var _logger = new Logger();

module.exports = function MobFactory() {
	var _this = this;
	this.mobs = {};
	//this.mobKeys = new Array();
	this.mobCount = 6;
	
	this.create = function() {
		_logger.logInfo("MobFactory.create");

		var randomIndex = Math.round(Math.random()*(_this.mobCount-1));

		var randomMob = null;
		
		if(randomIndex == 0) randomMob = {key: "rat", name: "Rat", hp:12, atk:3, luck:2, atkTypes:["melee", "ranged"], xp:5, copper:2, items:["rat pelt"]};
		if(randomIndex == 1) randomMob = {key: "deer", name: "Deer", hp:22, atk:1, luck:2, atkTypes:["melee"], xp:7, copper:4, items:["deer skin"]};
		if(randomIndex == 2) randomMob = {key: "rabbit", name: "Rabbit", hp:14, atk:1, luck:2, atkTypes:["melee"], xp:5, copper:3, items:["rabbits foot"]};
		if(randomIndex == 3) randomMob = {key: "snake", name: "Snake", hp:19, atk:1, luck:2, atkTypes:["melee"], xp:8, copper:5, items:["snake fang"]};
		if(randomIndex == 4) randomMob = {key: "beetle", name: "Beetle", hp:15, atk:1, luck:2, atkTypes:["melee"], xp:15, copper:6, items:["beetle shell"]};
		if(randomIndex == 5) randomMob = {key: "boar", name: "Boar", hp:20, atk:1, luck:2, atkTypes:["melee"], xp:15, copper:6, items:["boar tusk"]};
		
		if(randomMob)
			_logger.logInfo(JSON.stringify(randomMob));
		else
			_logger.logError("No mob found at index [" + randomIndex + "]!");
		
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
		//_this.addMob({key: "orc", name: "Orc", hp:30, atk:4, luck:2, atkTypes:["melee"], xp:40, gold:0, silver:1, copper:6, items:[]});
	};
	
	_this.construct();
}