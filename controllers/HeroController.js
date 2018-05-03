var Logger = require('../common/Logger.js');

var _logger = new Logger();

module.exports = function HeroController() {
    var _this = this;

    this.Train = function(data) {
        _logger.logInfo("HeroController.Train called!");
        _logger.logInfo(JSON.stringify(data));
    };
}