var loginView = {};
$(function() {	
    loginView = new LoginView();

    $("#btnShowCreateLogin").click(function() {login.drawCreateLoginScreen();});	
	$("#btnCreateLogin").click(function() {login.createLogin();});	
    $("#btnLogin").click(function() {loginView.login();});
});

function LoginView() {
    var _this = this;
    var maxHeroes = 3;

    this.createLogin = function() {
        var newClientLogin = {name:$("#newLogin").val(), password:$("#newPassword").val(), repeatedPassword:$("#newRepeatedPassword").val()};
        post("Login", "Create", newClientLogin, createLoginSuccess, createLoginFailed);
    };
    
    this.createLoginSuccess = function(data) {
        logInfo("create login OK!");
        logInfo(JSON.stringify(data));
        $("#statusMessage").html("");
        drawLoginScreen();
    };
    
    this.createLoginFailed = function(errorMsg) {
        logInfo(errorMsg);
        $("#statusMessage").html(errorMsg.reason);
    };
    
    this.login = function() {
        var clientLogin = {name:$("#login").val(), password:$("#password").val()};
        //callMethod("http://" + hostIp + ":" + hostPort, "login", clientLogin, loginSuccess, loginFailed);
        post("Login", "Login", clientLogin, loginSuccess, loginFailed);
    };

    var setHeroCardImage = function(newHeroCard, heroClass) {
        var imgSrc = "";
        switch(heroClass) {
            case "priest" : imgSrc = $("#priestHeroImg").attr("src"); break;
            case "warrior" : imgSrc = $("#warriorHeroImg").attr("src"); break;
            case "rogue" : imgSrc = $("#rogueHeroImg").attr("src"); break;
            default : imgSrc = $("#warriorHeroImg").attr("src");
        }
        $(newHeroCard).find(".card-img-top").attr("src", imgSrc);
    };

    var drawHeroCard = function(hero) {
        var newHeroCard = $(".hero-card.template").clone();
        newHeroCard.removeClass("template");
        $(newHeroCard).find(".hero-name").html(hero.heroName);
        $(newHeroCard).find(".hero-text").html("");
        setHeroCardImage(newHeroCard, hero.heroClass);        
        $(newHeroCard).find(".card").attr("data-hero-id", hero.heroId);
        return newHeroCard;
    };

    var addEmptyCards = function(freeHeroesCount) {
        var newHeroCard = $(".hero-card-empty.template").clone();
        newHeroCard.removeClass("template");        
        $(".heroes").append(newHeroCard);
    };
    
    var loginSuccess = function(serverGameSession) {
        logInfo("login OK!");
        logInfo(JSON.stringify(serverGameSession));
        
        $(".function").hide();
        $("#chooseHeroContainer").show();
        
        gameSession.publicKey = serverGameSession.publicKey;
        var heroes = serverGameSession.data.heroes;
    
        for(var heroIndex in heroes) {
            if(heroIndex > maxHeroes-1)
                break;
            var heroCard = drawHeroCard(heroes[heroIndex], heroIndex);
            $(".heroes").append(heroCard);
        }
        if(heroes.length < maxHeroes)
            addEmptyCards(maxHeroes-heroes.length);
        $(".card").click(function() {heroView.chooseHero(this);});	
    };
    
    var loginFailed = function(errorMsg) {
        logInfo(errorMsg);
        $("#loginStatus").html(errorMsg.reason);
    };

    this.drawLoginScreen = function() {
        $(".function").hide();
        $(canvasLayer2).hide();
        $(canvasLayer1).hide();
        $("#loginContainer").show();
        
        $("#container").css("background-image", "url('./resources/images/login-background.jpg')"); 
    };
    
    this.drawCreateLoginScreen = function() {
        $(".function").hide();
        $(canvasLayer2).hide();
        $(canvasLayer1).hide();
        $("#createLoginContainer").show();
        
        $("#container").css("background-image", "url('./resources/images/login-background.jpg')"); 
    };
}