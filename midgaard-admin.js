var gameSession = {};
var canvasLayer1 = document.getElementById("canvasLayer1");
var canvasLayer2 = document.getElementById("canvasLayer2");
var canvasHeight = 0;
var canvasWidth = 0;
var hostIp = "";
var hostPort = 0;

$(function() {	
	hostIp = "www.opusmagus.com";
	hostPort = 83;
	
	canvasLayer1 = document.getElementById("canvasLayer1");
	canvasLayer2 = document.getElementById("canvasLayer2");
	canvasWidth = 800;
	canvasHeight = 300;
	canvasLayer1.width = canvasWidth;
	canvasLayer1.height = canvasHeight;
	canvasLayer2.width = canvasWidth;
	canvasLayer2.height = canvasHeight;
		
	$("#btnCreateLogin").click(function() {createLogin();});
	$("#btnCreateHero").click(function() { createHero(); });
	$("#btnLogin").click(function() {login();});
	$("#btnChooseHero").click(function() {chooseHero();});
	
	$("#btnMove").click(function() {move();});
	$("#btnNextRound").click(function() {nextRound();});
	$("#btnEnterTown").click(function() {enterTown();});
	$("#btnLeaveTown").click(function() {leaveTown();});
	
	$("#btnVisitMeadhall").click(function() {visitMeadhall();});
	$("#btnTrain").click(function() {train();});
	$("#btnVisitSmithy").click(function() {visitSmithy();});
	$("#btnViewCharacter").click(function() {viewCharacter();});
  
	$("#gSessionId").html("gSessionId: N/A");
	
	$("#container").keypress(function(e) { 
			if(e.which == 100 || e.which == 97 || e.which == 115 || e.which == 119) {
				e.preventDefault();
				moveHero(e.which);
			}
	});
});

function viewCharacter() {
	callMethod("http://" + hostIp + ":" + hostPort, "viewCharacter", gameSession, viewCharacterSuccess, viewCharacterFailed);
}

function viewCharacterSuccess(data) {
	logInfo("enter town OK!");
	logInfo(JSON.stringify(data));
	
	if(data.town) {
		var town = data.town;
		logInfo("Entering the town of [" + town.name + "]!");
		drawTown(town);
	}
	else
		logInfo("There is no town at this location, continuing on map!");
}

function viewCharacterFailed(errorMsg) {
	logInfo(errorMsg);
}

function visitSmithy() {
	callMethod("http://" + hostIp + ":" + hostPort, "visitSmithy", gameSession, visitSmithySuccess, visitSmithyFailed);
}

function visitSmithySuccess(data) {
	logInfo("enter town OK!");
	logInfo(JSON.stringify(data));
	
	if(data.town) {
		var town = data.town;
		logInfo("Entering the town of [" + town.name + "]!");
		drawTown(town);
	}
	else
		logInfo("There is no town at this location, continuing on map!");
}

function visitSmithyFailed(errorMsg) {
	logInfo(errorMsg);
}

function train() {
	callMethod("http://" + hostIp + ":" + hostPort, "train", gameSession, trainSuccess, trainFailed);
}

function trainSuccess(data) {
	logInfo("enter town OK!");
	logInfo(JSON.stringify(data));
	
	if(data.town) {
		var town = data.town;
		logInfo("Training in the town of [" + town.name + "]!");
		drawTraining(data.hero, data.trainingOutcome, data.town);
	}
	else
		logInfo("There is no town at this location, continuing on map!");
}

function trainFailed(errorMsg) {
	logInfo(errorMsg);
}

function visitMeadhall() {
	callMethod("http://" + hostIp + ":" + hostPort, "visitMeadhall", gameSession, enterTownSuccess, enterTownFailed);
}

function visitMeadhallSuccess(data) {
	logInfo("enter town OK!");
	logInfo(JSON.stringify(data));
	
	if(data.town) {
		var town = data.town;
		logInfo("Entering the town of [" + town.name + "]!");
		drawTown(town);
	}
	else
		logInfo("There is no town at this location, continuing on map!");
}

function visitMeadhallFailed(errorMsg) {
	logInfo(errorMsg);
}

function enterTown() {
	callMethod("http://" + hostIp + ":" + hostPort, "enterTown", gameSession, enterTownSuccess, enterTownFailed);
}

function enterTownSuccess(data) {
	logInfo("enter town OK!");
	logInfo(JSON.stringify(data));
	
	if(data.town) {
		var town = data.town;
		logInfo("Entering the town of [" + town.name + "]!");
		drawTown(town);
	}
	else
		logInfo("There is no town at this location, continuing on map!");
}

function enterTownFailed(errorMsg) {
	logInfo(errorMsg);
}

function leaveTown() {
	callMethod("http://" + hostIp + ":" + hostPort, "leaveTown", gameSession, leaveTownSuccess, leaveTownFailed);
}

function leaveTownSuccess(data) {
	logInfo("leave town OK!");
	logInfo(JSON.stringify(data));
	
	drawMap(data);
}

function leaveTownFailed(errorMsg) {
	logInfo(errorMsg);
}

function nextRound() {
	gameSession.attackType = $("#attackType").val();	
	callMethod("http://" + hostIp + ":" + hostPort, "nextRound", gameSession, nextRoundSuccess, nextRoundFailed);
}

function nextRoundSuccess(data) {
	logInfo("next round OK!");
	
	if(data) {
		if(data.battle) {
			var battle = data.battle;
			var hero = data.hero;
			if(battle.status.over) {
				logInfo("Battle is over!");
				if(battle.status.winner == hero.name)
					drawTreasureScreen(battle);
				else
					drawDeathScreen(hero);
			}
			else
				drawBattleScreen(battle);			
		}
		else {
			logInfo("Battle was already over!");
			drawMap(data);
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
	
	callMethod("http://" + hostIp + ":" + hostPort, "move", gameSession, moveSuccess, moveFailed);
}

function moveSuccess(data) {
	logInfo("move hero OK!");
	logInfo(JSON.stringify(data));
	
	if(data) {
		if(data.terrainType) { // The move resulted in an actual move
			var location = data;
			var targetCoordinates = location.targetCoordinates;			
			drawHeroMapIcon(canvasLayer2, targetCoordinates.x, targetCoordinates.y);
			logInfo("you moved to a new location");
		}
		else if(data.hero && data.mob) { // The move resulted in a fight
			var battle = data;
			drawBattleScreen(battle);
			logInfo("you were surprised by monsters!");
		}
	}
}

function moveFailed(errorMsg) {
	logInfo(errorMsg);
}

function chooseHero() {
	var heroName = $("#heroList").val();
	
	if (heroName) {
		gameSession.heroName = heroName;
		callMethod("http://" + hostIp + ":" + hostPort, "chooseHero", gameSession, chooseHeroSuccess, chooseHeroFailed);
	}	
}

function chooseHeroSuccess(data) {
	logInfo("choose hero OK!");
	if(data) {
		if(data.battle && data.battle.mob && data.battle.hero) { // The hero is already in a fight
			drawBattleScreen(data.battle);
			logInfo("you resume the battle!");
		}		
		else if(data.town)
			drawTown(data.town);
		else
			drawMap(data);
	}
	logInfo(JSON.stringify(data));
}

function chooseHeroFailed(errorMsg) {
	logInfo(errorMsg);
}

function createHero() {
	var hero = { name: $("#newHeroName").val()};
	gameSession.data = hero;
	callMethod("http://" + hostIp + ":" + hostPort, "createHero", gameSession, createHeroSuccess, createHeroFailed);
}

function createHeroSuccess(data) {
	logInfo("create hero OK!");
	logInfo(JSON.stringify(data));
	var hero = data;
	$("#heroList").append('<option value="' + hero.name + '">' + hero.name + '</option>');
}

function createHeroFailed(errorMsg) {
	logInfo(errorMsg);
}

function createLogin() {
	var newClientLogin = {name:$("#newLogin").val(), password:$("#newPassword").val(), repeatedPassword:$("#newRepeatedPassword").val()};
	callMethod("http://" + hostIp + ":" + hostPort, "createLogin", newClientLogin, createLoginSuccess, createLoginFailed);
}

function createLoginSuccess(data) {
	logInfo("create login OK!");
	logInfo(JSON.stringify(data));
}

function createLoginFailed(errorMsg) {
	logInfo(errorMsg);
}

function login() {
	var clientLogin = {name:$("#login").val(), password:$("#password").val()};
	callMethod("http://" + hostIp + ":" + hostPort, "login", clientLogin, loginSuccess, loginFailed);
}

function loginSuccess(serverGameSession) {
	logInfo("login OK!");
	logInfo(JSON.stringify(serverGameSession));
	
	gameSession.publicKey = serverGameSession.publicKey;
	var heroes = serverGameSession.data.heroes;

	for(var key in heroes) {	
		$("#heroList").append('<option value="' + key + '">' + key + '</option>');		
	}
}

function loginFailed(errorMsg) {
	logInfo(errorMsg);
}

function logInfo(msg) {
	$("#status").prepend("[INFO]: " + msg + "<br/>");
}

function drawMap(data) {
	if(data) {
		var name = data.map.name;
		var mapMatrix = data.map.mapMatrix;
		var hero = data.hero;
		$("#container").css("background-image", "url('./resources/images/parchment.jpg')");
		
		for(var yIndex in mapMatrix) {
			for(var xIndex in mapMatrix[yIndex]) {
				drawMapTile(canvasLayer1, xIndex*32,yIndex*32,mapMatrix[yIndex][xIndex]);
			}
		}		

		drawHeroMapIcon(canvasLayer2,hero.currentCoordinates.x,hero.currentCoordinates.y);
	}
}

function drawMapTile(canvas, xPos, yPos, terrainType) {
	var ctx = canvas.getContext("2d");
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
	ctx.clearRect(0,0,canvasWidth,canvasHeight);
	var img = document.getElementById("heroMapIcon");
	ctx.drawImage(img,xPos*pixelMultiplier,yPos*pixelMultiplier,32,32);
}

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

function drawBattleScreen(battle) {
	var ctx1 = canvasLayer1.getContext("2d");
	var ctx2 = canvasLayer2.getContext("2d");
	ctx1.clearRect(0,0,canvasWidth,canvasHeight);
	ctx2.clearRect(0,0,canvasWidth,canvasHeight);
	//var img = new Image();
	//img.src = "./resources/forest.png";
	var mobImg = document.getElementById("wildBoar");
	
	if(battle.mob.key == "orc")
		mobImg = document.getElementById("orc");
		
	var heroImg = document.getElementById("warriorHero");
	if(battle.hero.hp <= 0)
		heroImg = document.getElementById("dead");
	if(battle.mob.hp <= 0)
		mobImg = document.getElementById("dead");
	
	ctx1.drawImage(heroImg,50,50,120,190);
	ctx1.drawImage(mobImg,450,50,120,190);
	//ctx1.drawImage(mobImg,450,50,378,600,0,0,120,190);
	
	ctx1.font = "22px Arial";
  ctx1.fillText(battle.hero.hp + " HP",80,30);
	ctx1.fillText(battle.mob.hp + " HP",480,30);
}

function drawTown(town) {
	var ctx1 = canvasLayer1.getContext("2d");
	var ctx2 = canvasLayer2.getContext("2d");
	ctx1.clearRect(0,0,canvasWidth,canvasHeight);
	ctx2.clearRect(0,0,canvasWidth,canvasHeight);
	
	//var townImg = document.getElementById("town");		
	//ctx1.drawImage(townImg,50,50,120,190);
	
	$("#container").css("background-image", "url('./resources/images/town.jpg')"); 
	
	ctx1.font = "28px Calibri";
	ctx1.fillStyle = '#3D3A36';
  ctx1.fillText(town.name,50,30);
}

function drawTreasureScreen(battle) {
	logInfo("showing treasure screen!");
	var ctx1 = canvasLayer1.getContext("2d");
	var ctx2 = canvasLayer2.getContext("2d");
	ctx1.clearRect(0,0,canvasWidth,canvasHeight);
	ctx2.clearRect(0,0,canvasWidth,canvasHeight);
	
	//var townImg = document.getElementById("town");		
	//ctx1.drawImage(townImg,50,50,120,190);
	
	$("#container").css("background-image", "url('./resources/images/loot.jpg')");
	
	ctx1.font = "28px Calibri";
	ctx1.fillStyle = '#E4CA64';
  ctx1.fillText("You gained [" + battle.mob.xp + "] XP!",50,30);
	
	if(battle.mob.copper > 0)
		ctx1.fillText("You looted [" + battle.mob.copper + "] copper!",50,60);
	
	if(battle.mob.items && battle.mob.items.length > 0)
		ctx1.fillText("You found items while searching the corpse!",50,90);
}

function drawDeathScreen(hero) {
	logInfo("showing death screen!");
}

function drawTraining(hero, trainingOutcome, town) {
		logInfo("showing training screen!");
	var ctx1 = canvasLayer1.getContext("2d");
	var ctx2 = canvasLayer2.getContext("2d");
	ctx1.clearRect(0,0,canvasWidth,canvasHeight);
	ctx2.clearRect(0,0,canvasWidth,canvasHeight);
	
	ctx1.font = "28px Calibri";
	ctx1.fillStyle = '#3D3A36';
  ctx1.fillText(town.name,50,30);
	
	ctx1.font = "20px Calibri";
	ctx1.fillStyle = '#E4CA64';
	
	if(trainingOutcome.trained) {
		ctx1.fillText("You trained hard and gained a level!. You are now level [" + hero.level + "]",70,90);
	}
	else {
		ctx1.fillText(trainingOutcome.reason,70,90);
	}
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