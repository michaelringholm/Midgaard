var fs = require( 'fs' );
var path = require( 'path' );
// In newer Node.js versions where process is already global this isn't necessary.
var process = require( "process" );
var Logger = require('../common/Logger.js');
var _logger = new Logger();




//eval("var SmithyController = require('../controllers/SmithyController.js')");

module.exports = function Router() {
    var _this = this;
    this.importDone = false;

    this.route = function(fullRoute, data, response) {
        _logger.logInfo("Full Route=" + fullRoute);        
        var routeParts = fullRoute.split("/");
        _logger.logInfo("routeParts[1]=" + routeParts[1]);
        _logger.logInfo("routeParts[2]=" + routeParts[2]);
        if(!_this.importDone)
            _this.importControllers(_this.fnDone, routeParts, data, response);
        return eval("new _this." + routeParts[1] + "Controller()")[routeParts[2]](data, response);  
    };

    this.importControllers = function(fnCallback, routeParts, data, response) {
        console.log("*************  importControllers ...");
        var files = fs.readdirSync( "./controllers/");
        
        for(var fileIndex=0;fileIndex<files.length;fileIndex++) {
            var file = files[fileIndex];
            var filePath = path.join( "./controllers/", file );            
            var fileStats = fs.statSync(filePath);
            
            if(fileStats.isFile()) {
                console.log("'%s' is a file.", file );
                var controllerName = file.substring(0, file.length-3);
                console.log("Controller Name=" + controllerName);
                eval("_this." + controllerName + " = require('../controllers/" + file + "')");
                console.log( "imported module %s.", file );                            
            }
            else if(fileStats.isDirectory()) {
                console.log( "'%s' is a directory.", fromPath );
            }                    
        }            
        _this.importDone = true;
        console.log("*************  importControllers done!");       
    };
};