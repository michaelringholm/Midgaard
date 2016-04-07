$(function() {
	callMethod("http://127.0.0.1:1337", "nextRound");
  
	$("#gSessionId").html("gSessionId: N/A");
});


function callMethod(host, methodName) {
	var data = {};
	$.ajax({
			type: "post",
			contentType: "application/json",
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