var gameSession = {};

$(function() {	
	var newClientLogin = {name:$("#newLogin").val(), password:$("#newPassword").val(), repeatedPassword:$("#newRepeatedPassword").val()};
	$("#btnCreateLogin").click(function() { callMethod("http://localhost:1337", "createLogin", newClientLogin, createLoginSuccess, createLoginFailed); });
			
	var hero = { name: $("#newHeroName").val()};
	gameSession.data = hero;
	$("#btnCreateHero").click(function() { callMethod("http://localhost:1337", "createHero", gameSession, createHeroSuccess, createHeroFailed); });
	
	//loginName, password, heroes
	var clientLogin = {name:$("#login").val(), password:$("#password").val()};
	$("#btnLogin").click(function() { callMethod("http://localhost:1337", "login", clientLogin, loginSuccess, loginFailed); });
	
	gameSession.heroName = "Krom";
	$("#btnChooseHero").click(function() { callMethod("http://localhost:1337", "chooseHero", gameSession, chooseHeroSuccess, chooseHeroFailed); });
	
	
	$("#btnMove").click(function() {move();});
	$("#btnNextRound").click(function() {nextRound();});
	$("#btnEnterTown").click(function() {enterTown();});
	$("#btnLeaveTown").click(function() {leaveTown();});
  
	$("#gSessionId").html("gSessionId: N/A");
	
	$("body").keypress(function(e) { 
			if(e.which == 100 || e.which == 97 || e.which == 115 || e.which == 119) {
				e.preventDefault();
				moveHero(e.which);
			}
	});
});

function enterTown() {
	callMethod("http://localhost:1337", "enterTown", gameSession, enterTownSuccess, enterTownFailed);
}

function enterTownSuccess(data) {
	logInfo("enter town OK!");
	logInfo(JSON.stringify(data));
	
	if(data) {
	}
}

function enterTownFailed(errorMsg) {
	logInfo(errorMsg);
}

function leaveTown() {
	callMethod("http://localhost:1337", "leaveTown", gameSession, leaveTownSuccess, leaveTownFailed);
}

function leaveTownSuccess(data) {
	logInfo("leave town OK!");
	logInfo(JSON.stringify(data));
	
	if(data) {
		var name = data.name;
		var mapMatrix = data.mapMatrix;
		
		var canvasLayer1 = document.getElementById("mapCanvasLayer1");
		canvasLayer1.width = 700;
		canvasLayer1.height = 300;
		
		for(var yIndex in mapMatrix) {
			for(var xIndex in mapMatrix[yIndex]) {
				drawMapTile(canvasLayer1, xIndex*32,yIndex*32,mapMatrix[yIndex][xIndex]);
			}
		}
		
		var canvasLayer2 = document.getElementById("mapCanvasLayer2");
		canvasLayer2.width = 700;
		canvasLayer2.height = 300;
		drawHeroMapIcon(canvasLayer2,0,0);
	}
}

function leaveTownFailed(errorMsg) {
	logInfo(errorMsg);
}

function nextRound() {
	gameSession.attackType = $("#attackType").val();	
	callMethod("http://localhost:1337", "nextRound", gameSession, nextRoundSuccess, nextRoundFailed);
}

function nextRoundSuccess(data) {
	logInfo("next round OK!");
	logInfo(JSON.stringify(data));
	
	if(data) {
		if(data.hero && data.mob) {
			var battle = data;
			logInfo("Next round completed!");
		}
	}
}

function nextRoundFailed(errorMsg) {
	logInfo(errorMsg);
}

function move(direction) {
	if(!direction)
		gameSession.direction = $("#direction").val();
	else
		gameSession.direction = direction;
	
	callMethod("http://localhost:1337", "move", gameSession, moveSuccess, moveFailed);
}

function moveSuccess(data) {
	logInfo("move hero OK!");
	logInfo(JSON.stringify(data));
	
	if(data) {
		if(data.terrainType) { // The move resulted in an actual move
			var location = data;
			var targetCoordinates = location.targetCoordinates;
			var canvasLayer2 = document.getElementById("mapCanvasLayer2");
			drawHeroMapIcon(canvasLayer2, targetCoordinates.x, targetCoordinates.y);
			logInfo("you moved to a new location");
		}
		else if(data.hero && data.mob) { // The move resulted in a fight
			var battle = data;
			logInfo("you were surprised by monsters!");
		}
	}
}

function moveFailed(errorMsg) {
	logInfo(errorMsg);
}

function chooseHeroSuccess(data) {
	logInfo("choose hero OK!");
	logInfo(JSON.stringify(data));
}

function chooseHeroFailed(errorMsg) {
	logInfo(errorMsg);
}

function createHeroSuccess(data) {
	logInfo("create hero OK!");
	logInfo(JSON.stringify(data));
}

function createHeroFailed(errorMsg) {
	logInfo(errorMsg);
}

function createLoginSuccess() {
	logInfo("create login OK!");
	logInfo(JSON.stringify(data));
}

function createLoginFailed(errorMsg) {
	logInfo(errorMsg);
}

function loginSuccess(serverGameSession) {
	logInfo("login OK!");
	logInfo(JSON.stringify(serverGameSession));
	
	gameSession.publicKey = serverGameSession.publicKey;
	var heroes = serverGameSession.data.heroes;

	for(var key in heroes) {	
		$("#heroList").append('<div class="heroButton">' + key + '</div>');
	}
}

function loginFailed(errorMsg) {
	logInfo(errorMsg);
}

function logInfo(msg) {
	$("#status").prepend("[INFO]: " + msg + "<br/>");
}

function drawMapTile(canvas, xPos, yPos, terrainType) {
	
	//canvas.style.width  = "800px";
	//canvas.style.height = "400px";

	var ctx = canvas.getContext("2d");
	//ctx.clearRect(0,0,200,200);	
	//var img = new Image();
	//img.src = "./resources/forest.png";
	var img = null;
	
	if(terrainType == "w")
		img = document.getElementById("forest");
	else if(terrainType == "m")
		img = document.getElementById("mountains");
	else if(terrainType == "h")
		img = document.getElementById("mountains");		
	else if(terrainType == "t")
		img = document.getElementById("town");
	else if(terrainType == "r")
		img = document.getElementById("road");	

	if(!img)
		logInfo("The image for terrainType [" + terrainType + "] was not found!");
	else
		ctx.drawImage(img,xPos,yPos,32,32);
}

var pixelMultiplier = 32;
function drawHeroMapIcon(canvas, xPos, yPos) {
	logInfo("drawHeroMapIcon called!");
	var ctx = canvas.getContext("2d");
	ctx.clearRect(0,0,700,300);
	var img = document.getElementById("heroMapIcon");
	ctx.drawImage(img,xPos*pixelMultiplier,yPos*pixelMultiplier,32,32);
}

//var currentHeroXPos = 0;
//var currentHeroYPos = 0;
function moveHero(keyCode) {	
	var stepSize = 32;
	var direction = null;
	
	if(keyCode == 100) { // D which is east
		//currentHeroXPos = currentHeroXPos+stepSize;    		
		direction = "east";
	}
	if(keyCode == 119) { // W which is north
		//currentHeroYPos = currentHeroYPos-stepSize;    		
		direction = "north";
	}		
	if(keyCode == 97) { // A which is west
		//currentHeroXPos = currentHeroXPos-stepSize;    		
		direction = "west";
	}		
	if(keyCode == 115) { // S which is south
		//currentHeroYPos = currentHeroYPos+stepSize;    		        
		direction = "south";
	}		
		
	if(direction) {
		move(direction);		
	}
	else
		logInfo("Invalid move direction!");
};


function callMethod(host, methodName, data, fnSuccess, fnError) {
	$.ajax({
			type: "POST",
			dataType: "json",
			origin: "http://127.0.0.1",
			contentType: "application/json; charset=utf-8",
			data: JSON.stringify(data),
			url: host + "/" + methodName,
			cache: false,
			beforeSend : function() {},
			success: function(data)	{
				logInfo("call succeeded!");				
				if(fnSuccess)	fnSuccess(data);
			},
			error: function(error, status) {
				logInfo("call failed!");		
				if(fnError) fnError(error.responseText);
			},			
			complete : function() {}
	});
}


function callMethodJsonp(host, methodName, data) {
	$.ajax({
			type: "POST",
			dataType: "jsonp",
			jsonpCallback: 'callback',
			contentType: "application/jsonp; charset=utf-8",
			data: JSON.stringify(data),
			url: host + "/" + methodName,
			cache: false,
			beforeSend : function() {},
			success: function(returnValue)
			{
				$("#status").html("call succeeded!");
			},
			complete : function() {}
	});
}