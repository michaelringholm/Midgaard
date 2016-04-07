$(function() {
	
	$("#createLo").click(function() { callMethod("http://localhost:1337", "createLogin", {name:"MyLogin", password:"myPassword", repeatedPassword:"myPassword2"}); });
	$("#createHe").click(function() { callMethod("http://localhost:1337", "createHero"); });
	
	//loginName, password, heroes
	$("#Lo").click(function() { callMethod("http://localhost:1337", "login", {name:"MyLogin", password:"myPassword"}); });
	
	$("#ChooseHe").click(function() { callMethod("http://localhost:1337", "chooseHero"); });
	$("#Move").click(function() { callMethod("http://localhost:1337", "move"); });
	
	//callMethodJsonp("http://localhost:1337", "createLogin");
  
	$("#gSessionId").html("gSessionId: N/A");
});


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
				$("#status").html("call succeeded!");				
				if(fnSuccess)	fnSuccess(data);
			},
			error: function(error, error2) {
				$("#status").html("call failed!");		
				if(fnError) fnError();
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