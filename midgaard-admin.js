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
	
	gameSession.direction = $("#direction").val();
	$("#btnMove").click(function() { callMethod("http://localhost:1337", "move", gameSession, moveSuccess, moveFailed); });
	
	//callMethodJsonp("http://localhost:1337", "createLogin");
  
	$("#gSessionId").html("gSessionId: N/A");
});

function moveSuccess(data) {
	logInfo("move hero OK!");
	logInfo(JSON.stringify(data));
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
	$("#status").append("[INFO]: " + msg + "<br/>");
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