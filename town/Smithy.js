var Logger = require('../common/Logger.js');
var ItemFactory = require('../item/ItemFactory.js');

var _logger = new Logger();
var _itemFactory = new ItemFactory();

module.exports = function Smithy() {

	var _this = this;
	
	this.buyItem = function(itemKey, hero) {
		var item = _itemFactory.create(itemKey);
		if (hero.copper > item.cost) {
				hero.copper -= item.cost;
				hero.items.push(itemKey);
		}
		else {
			return { status:true, reason:"Can't afford item!" };
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
		}
		else {
			return { status:true, reason:"Can't find item in inventory!" };
		}	
	};	
}