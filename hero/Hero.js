var _logger = require('../common/Logger.js');
var Battle = require('../battle/Battle.js');
var Coordinate = require('../map/Coordinate.js');
var _mapDao = require('../map/MapDao.js');
var _mapFactory = require('../map/MapFactory.js');
var ItemFactory = require('../item/ItemFactory.js');
var _itemFactory = new ItemFactory();

module.exports = function Hero(anonObj) {
	var _this = this;
	this.name = "";
	this.heroClass = "warrior";
	this.baseHp = 0;
	this.hp = 0;
	this.baseMana = 0;
	this.mana = 0;
	this.xp = 0;
	this.level = 1;
	this.str = 0;
	this.sta = 0;
	this.int = 0;
	this.minAtk = 1;
	this.maxAtk = 6;
	this.regen = 0;
	this.baseAc = 0;
	this.ac = 0;
	this.luck = 0;
	this.gold = 0;
	this.silver = 0;
	this.copper = 0;
	this.items = [];
	this.equippedItems = {};
	this.atkTypes = [];
	this.currentMapKey = "";
	this.currentCoordinates = {};
	this.rested = false;
	
	this.equipItem = function(itemKey) {
		
		// Find and remove equipped item from inventory
		var itemIndexToRemove = -1;
		for(var itemIndex in items) {
			if (items[itemIndex] == itemKey) {
				itemIndexToRemove = itemIndex;
				break;
			}
		}
		
		if (itemIndexToRemove > -1)  {
			items.splice(itemIndexToRemove, 1);
		}
		else
			return { status: false, reason:"Hero does not have that item!" };
		
		var item = _itemFactory.create(itemKey); // Get full item as we need to know the slot
		var currentlyEquippedItem = _this.equippedItems[item.slot];
		
		if (currentlyEquippedItem) {
			items.push(currentlyEquippedItem); // Put the currently equipped item back into the inventory	if one exists
		}
		_this.equippedItems[item.slot] = itemKey;
		
		return { status: true, reason:"Item equipped!" };
	};
	
	this.removeItem = function(itemKey) {
		var item = _itemFactory.create(itemKey); // Get full item as we need to know the slot
		var currentlyEquippedItem = _this.equippedItems[item.slot];
		
		if (currentlyEquippedItem) {
			items.push(currentlyEquippedItem); // Put the currently equipped item back into the inventory	if one exists
			_this.equippedItems[item.slot] = null;
			return { status: true, reason:"Item removed and put in inventory!" };
		}
		else
			return { status: false, reason:"Item was not equipped, nothing to remove!" };
	};	
	
	// east, west, north, south, up, down
	this.move = function(direction, battleCache)  {
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
		
		var targetLocation = _mapFactory.create(_this.currentMapKey).getLocation(targetCoordinates);
		
		if(targetLocation) {
			_this.currentCoordinates = targetCoordinates;
			if(targetLocation.mob) {
				battleCache[_this.name] = new Battle(this, targetLocation.mob);
			}
		}
		
		return targetLocation;
	};
	
	this.visitMeadhall = function() {
		if(_this.copper > 0) {
			_this.copper -= 1;
			_this.hp = _this.baseHp;
			_this.mana = _this.baseMana;
			_this.rested = true;
			return {success:true};
		}
		else {
			var reason = "Not enough money to visit the mead hall, you need at least 1 copper!";
			_logger.logError(reason);
			return {success:false, reason:reason};
		}
	};
	
	this.getXpTarget = function() {
		return _this.level*_this.level*1000;
	}
	
	this.train = function() {
		var xpTarget = _this.getXpTarget();
		
		if(_this.xp >= xpTarget) {		
			var cost = _this.level*_this.level*100;
			if(_this.copper >= cost) {
				_this.copper -= cost;
				
				 var extraHp = Math.round(((Math.random()*2)*(_this.sta/3))+1);
				 var extraMana = Math.round(((Math.random()*2)*(_this.int/3))+1);
				 
				_this.baseHp += extraHp;
				_this.baseMana += extraMana;
				_this.level++;
				return {trained:true};
			}
			else {
				var errMsg = "Not enough money to train, you need at least [" + cost + "] copper!";
				_logger.logError(errMsg);
				return {trained:false, reason:errMsg};
			}
		}
		else {
			var errMsg = "Not enough xp to train, you need [" + (xpTarget-_this.xp*1) + "] more XP to become level [" + (_this.level+1) + "]!";
			_logger.logError(errMsg);
			return {trained:false, reason:errMsg};
		}
	};
	
	this.died = function(mob) {
		_this.xp -= (mob.xp*10);
		
		if (_this.sta > 1) {
			_this.sta -= 1;
		}
		
		_this.hp = 1;
		_this.mana = _this.baseMana;
		var baseTown = _mapFactory.create(_this.currentMapKey).getBaseTown();
		_this.currentCoordinates.x = baseTown.x;
		_this.currentCoordinates.y = baseTown.y;
	};
	
	this.construct = function() {
		_logger.logInfo("Hero.construct");
    for (var prop in anonObj) this[prop] = anonObj[prop];
  };
  
  _this.construct();
}