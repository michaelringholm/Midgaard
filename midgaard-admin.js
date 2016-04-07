$(function() {
	$("#createLo").click(function() { callMethod("http://localhost:1337", "createLogin"); });
	$("#createHe").click(function() { callMethod("http://localhost:1337", "createHero"); });
	$("#Lo").click(function() { callMethod("http://localhost:1337", "login"); });
	$("#ChooseHe").click(function() { callMethod("http://localhost:1337", "chooseHero"); });
	$("#Move").click(function() { callMethod("http://localhost:1337", "move"); });
	
	//callMethodJsonp("http://localhost:1337", "createLogin");
  
	$("#gSessionId").html("gSessionId: N/A");
});


function callMethodJsonp(host, methodName) {
	var data = {login:"MyLogin"};
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

function callMethod(host, methodName) {
	var data = {login:"MyLogin"};
	$.ajax({
			type: "POST",
			dataType: "json",
			origin: "http://127.0.0.1",
			contentType: "application/json; charset=utf-8",
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