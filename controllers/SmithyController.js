var Logger = require('../common/Logger.js');

var _logger = new Logger();

module.exports = function SmithyController() {
    _this = this;

    this.BuyItem = function(data) {
        _logger.logInfo("SmithyController.BuyItem called!");
        _logger.logInfo(JSON.stringify(data));
    };
}