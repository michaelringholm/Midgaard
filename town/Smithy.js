var Logger = require('../common/Logger.js');
var ItemFactory = require('../item/ItemFactory.js');

var _logger = new Logger();
var _itemFactory = new ItemFactory();

module.exports = function Smithy() {

	var _this = this;
	
	this.copper = 500;
	this.items = [{name:"wooden sword",cost:1,atkMin:1,atkMax:3},{name:"long sword",cost:20,atkMin:2,atkMax:4},{name:"silver long sword",cost:1000,atkMin:3,atkMax:6}];
	
	this.buyItem = function(itemKey, hero) {
		var item = _itemFactory.create(itemKey);
		if (hero.copper > item.cost) {
				hero.copper -= item.cost;
				hero.items.push(itemKey);
				return { status:true, reason:"Item bought!" };
		}
		else {
			return { status:false, reason:"Can't afford item!" };
		}		
	};
	
	this.sellItem = function(itemKey, hero) {
		var item = _itemFactory.create(itemKey);
		
				// Find and remove equipped item from inventory
		var itemIndexToSell = -1;
		for(var itemIndex in hero.items) {
			if (hero.items[itemIndex] == itemKey) {
				itemIndexToSell = itemIndex;
				break;
			}
		}
		
		if (itemIndexToSell > -1) {
				hero.copper += item.cost;
				items.splice(itemIndexToSell, 1);
				return { status:true, reason:"Item sold!" };
		}
		else {
			return { status:false, reason:"Can't find item in inventory!" };
		}	
	};	
}