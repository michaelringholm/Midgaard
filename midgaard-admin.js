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
		
		for(var yIndex in mapMatrix) {
			for(var xIndex in mapMatrix[yIndex]) {
				drawMapTile(xIndex*32,yIndex*32,mapMatrix[yIndex][xIndex]);
			}
		}
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

function move() {
	gameSession.direction = $("#direction").val();	
	callMethod("http://localhost:1337", "move", gameSession, moveSuccess, moveFailed);
}

function moveSuccess(data) {
	logInfo("move hero OK!");
	logInfo(JSON.stringify(data));
	
	if(data) {
		if(data.terrainType) {
			var location = data;
			logInfo("you moved to a new location");
		}
		else if(data.hero && data.mob) {
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

function drawMapTile(xPos, yPos, terrainType) {
	logInfo("drawMapTile called!");
	var ctx = document.getElementById("mapCanvasLayer1").getContext("2d");
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
	else if(terrainType == "c")
		img = document.getElementById("town");
	else if(terrainType == "r")
		img = document.getElementById("road");				
		
	ctx.drawImage(img,xPos,yPos,32,32);
}


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