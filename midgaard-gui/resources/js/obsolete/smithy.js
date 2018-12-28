function buySmithyItem(itemKey) {
    gameSession.itemKey = itemKey;
	callMethod("http://" + hostIp + ":" + hostPort, "buySmithyItem", gameSession, buySmithyItemSuccess, buySmithyItemFailed);
};

function buySmithyItemSuccess(data) {
	logInfo("call to buy smithy item succeeded!");
	logInfo(JSON.stringify(data));
	
	if(data.town && data.smithy) {
        if (data.buy.status == 1) {
            // play buy success sound
            // show buy overlay
        }
        else {
            // play buy failed sound or none
            // show buy failed overlay (data.buy.failure)
        }
		drawSmithy(data.smithy);
	}
	else
		logInfo("You have to be in a town with a smithy to enter a smithy!");
};

function buySmithyItemFailed(errorMsg) {
	logInfo(errorMsg);
};

function sellSmithyItem(itemKey) {
    gameSession.itemKey = itemKey;
	callMethod("http://" + hostIp + ":" + hostPort, "sellSmithyItem", gameSession, sellSmithyItemSuccess, sellSmithyItemFailed);
};

function sellSmithyItemSuccess(data) {
	logInfo("call to sell smithy item succeeded!");
	logInfo(JSON.stringify(data));
	
	if(data.town && data.smithy) {
        if (data.sell.status == 1) {
            // play sell success sound
            // show sell overlay
        }
        else {
            // play sell failed sound or none
            // show sell failed overlay (data.sell.failure)
        }
		drawSmithy(data.smithy);
	}
	else
		logInfo("You have to be in a town with a smithy to enter a smithy!");
};

function sellSmithyItemFailed(errorMsg) {
	logInfo(errorMsg);
};
