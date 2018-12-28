var heroView = {};
$(function() {
    heroView = new HeroView();	
    $("#btnCreateHero").click(function() {heroView.createHero(); });    
});

function HeroView() {
    var _this = this;
    this.chooseHero = function(heroCard) {
        var heroId = $(heroCard).attr("data-hero-id");
        
        if (heroId) {
            gameSession.heroId = heroId;
            post("Hero", "ChooseHero", gameSession, chooseHeroSuccess, chooseHeroFailed);
        }	
    };

    this.getHeroCardImage = function(heroClass) {
        var imgSrc = "";
        switch(heroClass) {
            case "priest" : imgSrc = $("#priestHeroImg").attr("src"); break;
            case "warrior" : imgSrc = $("#warriorHeroImg").attr("src"); break;
            case "rogue" : imgSrc = $("#rogueHeroImg").attr("src"); break;
            default : imgSrc = $("#warriorHeroImg").attr("src");
        }
        return imgSrc;
    };    
    
    var chooseHeroSuccess = function(data) {
        logInfo("choose hero OK!");
        if(data) {
            printDebug(data.hero);
            if(data.battle && data.battle.mob && data.battle.hero) { // The hero is already in a fight
                battleView.drawBattleScreen(data.battle);
                logInfo("you resume the battle!");
            }		
            else if(data.town)
                townView.drawTown(data.town);
            else
                mapView.drawMap(data);
        }
        logInfo(JSON.stringify(data));
    };
    
    var chooseHeroFailed = function(errorMsg) {
        logInfo(errorMsg);
    };
    
    this.createHero = function() {
        var hero = { name: $("#newHeroName").val()};
        gameSession.data = hero;
        post("Hero", "Create", gameSession, createHeroSuccess, createHeroFailed);
    };
    
    var createHeroSuccess = function(data) {
        logInfo("create hero OK!");
        logInfo(JSON.stringify(data));
        var hero = data;
        $("#heroList").append('<option value="' + hero.name + '">' + hero.name + '</option>');
    };
    
    var createHeroFailed = function(errorMsg) {
        logInfo(errorMsg);
    };

    this.drawCreateHeroScreen = function() {
        $(".function").hide();
        $(canvasLayer2).hide();
        $(canvasLayer1).hide();
        $("#createHeroContainer").show();
        
        $("#container").css("background-image", "url('./resources/images/login-background.jpg')"); 
    };    
}