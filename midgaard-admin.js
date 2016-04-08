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
	
	$("#btnChooseHero").click(function() { callMethod("http://localhost:1337", "chooseHero"); });
	$("#btnMove").click(function() { callMethod("http://localhost:1337", "move"); });
	
	//callMethodJsonp("http://localhost:1337", "createLogin");
  
	$("#gSessionId").html("gSessionId: N/A");
});


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
	gameSession.publicKey = serverGameSession.publicKey;
	logInfo("login OK!");
	logInfo(JSON.stringify(serverGameSession));
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