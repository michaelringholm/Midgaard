var _logger = require('../common/Logger.js');
var AppContext = require('../context/AppContext.js');
var _appContext = new AppContext();

module.exports = function LoginDao() {
	var _this = this;
		
	this.exists = function(loginName) {
		_logger.logInfo("LoginDao.exists");
		var fs = require("fs");
		var fileName = _appContext.getAppRoot() + "data/logins/" + loginName + '.login';
			
		var fileFound = true;
		try {
			fs.statSync(fileName);
			_logger.logInfo("File [" + fileName + "] exists!");
		}
		catch(e) {
			fileFound = false;
			_logger.logError(JSON.stringify(e));
			_logger.logError("File [" + fileName + "] does not exist!");
		}
		return fileFound;
	};
	
	this.load = function(loginName) {
		_logger.logInfo("LoginDao.load");
		var fs = require("fs");
		var fileName = _appContext.getAppRoot() + "data/logins/" + loginName + ".login";
		var login = null;
		
		var heroJson = fs.readFileSync(fileName).toString();

		_logger.logInfo("Login JSON [" + heroJson + "] loaded!");		
		login = JSON.parse(heroJson);
		_logger.logInfo("Login [" + JSON.stringify(login) + "] loaded!");		
		
		return login;
	};	
	
	this.save = function(login) {
		_logger.logInfo("LoginDao.save");
		var fs = require("fs");
		var fileName = _appContext.getAppRoot() + "data/logins/" + login.name + ".login";
		
		var updateTime = new Date();

		fs.writeFile(fileName, JSON.stringify(login),  function(err) {
			if (err) {
				return console.error(err);
			}
			console.log("Data written successfully!");
		});
	};	
	
	this.construct = function() {
		_logger.logInfo("LoginDao.construct");
  };
  
  _this.construct();
}