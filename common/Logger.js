module.exports = function Logger() {

	var _this = this;
	
	this.logInfo = function(msg) {
		console.log('[INFO]:' + msg);
	};

	this.logError = function(msg) {
		console.log('[ERROR]:' + msg);
	};
		
	this.logWarn = function(msg) {
		console.log('[WARN]:' + msg);
	};

}