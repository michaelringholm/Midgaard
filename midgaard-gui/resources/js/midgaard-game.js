var gameSession = {};
var canvasLayer1 = document.getElementById("canvasLayer1");
var canvasLayer2 = document.getElementById("canvasLayer2");
var canvasHeight = 0;
var canvasWidth = 0;
var hostIp = "";
var hostPort = 0;

$(function() {	
	//hostIp = "www.opusmagus.com";
	//hostPort = 83;
	//hostIp = "sundgaard.ddns.net";
	hostIp = "localhost";
	hostPort = 1337;
	
	canvasLayer1 = document.getElementById("canvasLayer1");
	canvasLayer2 = document.getElementById("canvasLayer2");
	canvasWidth = 1200;
	canvasHeight = 800;
	canvasLayer1.width = canvasWidth;
	canvasLayer1.height = canvasHeight;
	canvasLayer2.width = canvasWidth;
	canvasLayer2.height = canvasHeight;		
  
	$("#gSessionId").html("gSessionId: N/A");
});

function printDebug(hero) {
	$("#debugInfo").html("DEBUG:");
	
	if (hero) {
		$("#debugInfo").append("<br>Name:" + hero.name);
		$("#debugInfo").append("<br>Class:" + hero.heroClass);
		$("#debugInfo").append("<br>Base HP:" + hero.baseHp);
		$("#debugInfo").append("<br>HP:" + hero.hp);
		$("#debugInfo").append("<br>Base Mana:" + hero.baseMana);
		$("#debugInfo").append("<br>Mana:" + hero.mana);
		$("#debugInfo").append("<br>XP:" + hero.xp);
		$("#debugInfo").append("<br>Level:" + hero.level);
		$("#debugInfo").append("<br>Int:" + hero.int);
		$("#debugInfo").append("<br>Sta:" + hero.sta);
		$("#debugInfo").append("<br>Str:" + hero.str);
		$("#debugInfo").append("<br>Regen:" + hero.regen);
		$("#debugInfo").append("<br>Min Atk:" + hero.minAtk);
		$("#debugInfo").append("<br>Max Atk:" + hero.maxAtk);
		$("#debugInfo").append("<br>Copper:" + hero.copper);
	}
}

function printJson(json) {
	$("#jsonInfo").html(json);
}

function logInfo(msg) {
	$("#status").prepend("[INFO]: " + msg + "<br/>");
} 

function getMobImgSrc(mob) {
	var imgSrc = null;
	imgSrc = "./resources/images/mobs/" + mob.key + ".png";
	
	if (!imgSrc) {
		logInfo("No image found for mob [" + mob.key + "]!");
		return "./resources/images/mobs/wild-boar.png";
	}
		
	return imgSrc;		
}

function post(controller, methodName, data, fnSuccess, fnError) {
	callMethod("http://" + hostIp + ":" + hostPort, controller + "/" + methodName, data, fnSuccess, fnError);
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
				if(data) printJson(JSON.stringify(data));
				if(fnSuccess) fnSuccess(data);
			},
			error: function(error, status) {
				logInfo("call failed!");
				if(error && error.responseJSON) printJson(error.responseJSON);
				if(fnError) fnError(error.responseJSON);
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