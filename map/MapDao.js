var Logger = require('../common/Logger.js');
var _logger = new Logger();

module.exports = function MapDao() {
	var _this = this;
		
	this.exists = function(mapName) {
		_logger.logInfo("MapDao.exists");
		var fs = require("fs");
		var fileName = "./map/" + mapName + '.map';
			
		var fileFound = true;
		try {
			fs.accessSync(fileName, fs.F_OK);
			_logger.logInfo("File [" + fileName + "] exists!");
		}
		catch(e) {
			fileFound = false;
			_logger.logWarn("File [" + fileName + "] does not exist!");
		}
		return fileFound;
	};
	
	this.load = function(mapName) {
		_logger.logInfo("MapDao.load");
		var fs = require("fs");
		var fileName = "./map/" + mapName + '.map';
		
		var raw = fs.readFileSync(fileName).toString();
		_logger.logInfo("Map [" + mapName + "] loaded!");
		_logger.logInfo("Map JSON [" + raw + "] loaded!");
		
		return raw;
	};		
	
	this.construct = function() {
		_logger.logInfo("MapDao.construct");
  };
  
  _this.construct();
}