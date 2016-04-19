var Logger = require('../common/Logger.js');
var Hero = require('../hero/Hero.js');

var _logger = new Logger();

module.exports = function HeroDao() {
	var _this = this;
		
	this.exists = function(heroName) {
		_logger.logInfo("HeroDao.exists");
		var fs = require("fs");
		var fileName = "./data/heroes/" + heroName + '.hero';
			
		var fileFound = true;
		try {
			fs.statSync(fileName);
			_logger.logInfo("File [" + fileName + "] exists!");
		}
		catch(e) {
			fileFound = false;
			_logger.logWarn("File [" + fileName + "] does not exist!");
		}
		return fileFound;
	};
	
	this.load = function(heroName) {
		_logger.logInfo("HeroDao.load");
		var fs = require("fs");
		var fileName = "./data/heroes/" + heroName + '.hero';
		var hero = null;
		
		var heroJson = fs.readFileSync(fileName).toString();
		_logger.logInfo("Hero [" + heroName + "] loaded!");
		_logger.logInfo("Hero JSON [" + heroJson + "] loaded!");
		
		hero = new Hero(JSON.parse(heroJson));		
		return hero;
	};	
	
	this.save = function(hero) {
		_logger.logInfo("HeroDao.save");
		var fs = require("fs");
		var fileName = "./data/heroes/" + hero.name + '.hero';
		
		var updateTime = new Date();
		fs.writeFile(fileName, JSON.stringify(hero),  function(err) {
			if (err) {
				return console.error(err);
			}
			console.log("Data written successfully!");
		});
	};	
	
	this.construct = function() {
		_logger.logInfo("HeroDao.construct");
  };
  
  _this.construct();
}