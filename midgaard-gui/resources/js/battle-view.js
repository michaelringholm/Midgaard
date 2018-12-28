var battleView = {};
$(function() {	
    battleView = new BattleView();
    $("#btnNextRound").click(function() {battleView.nextRound();});
	$("#btnExitDeathScreen").click(function() {townView.enterTown();});		
	$("#btnExitDeathScreen").click(function() {battleView.nextRound();});
	$("#btnExitTreasureScreen").click(function() {battleView.nextRound();});
});

function BattleView() {
    var _this = this;

    this.nextRound  = function() {
        $("#battleButtonBar").hide();
        gameSession.attackType = $("#attackType").val();	
        post("Battle", "NextRound", gameSession, nextRoundSuccess, nextRoundFailed);
    };
    
    var nextRoundSuccess = function(data) {
        logInfo("next round OK!");
        
        if(data) {
            if(data.battle) {
                var battle = data.battle;
                var hero = data.hero;
                if(battle.status.over) {
                    logInfo("Battle is over!");
                    if(battle.status.winner == hero.name) {
                        drawBattleScreen(battle);
                        setTimeout(function() { _this.drawTreasureScreen(battle); },5500);					
                    }
                    else {
                        _this.drawBattleScreen(battle);
                        setTimeout(function() { _this.drawDeathScreen(hero); },5500);										
                    }
                }
                else
                    _this.drawBattleScreen(battle);			
            }
            else {
                logInfo("Battle was already over!");
                mapView.drawMap(data);
            }
        }
    };
    
    var nextRoundFailed = function(errorMsg) {
        logInfo(errorMsg);
    };

    this.drawBattleScreen = function(battle) {
        $(".function").hide();
        $(canvasLayer1).hide();
        $(canvasLayer2).hide();
        $("#battleButtonBar").hide();
        
        $("#battleContainer").show()
        $("#battleBottomToolbar").show();
    
        $("#container").css("background-image", "url('./resources/images/battle-background.jpg')"); 	
        $("#battleHeroContainer").attr("src", $("#warriorHero").attr("src"));
            
        var imgSrc = getMobImgSrc(battle.mob);
        $("#battleMobContainer").attr("src", imgSrc);
        
        $("#heroName").html(battle.hero.name);
        $("#mobName").html(battle.mob.name);
        if (battle.mob.name.length > 8)
            $("#mobName").css("font-size", "10px");
        else
            $("#mobName").css("font-size", "16px");
            
                        
        if (battle.status.over) {
            if(battle.status.winner == battle.hero.name) {
                $("#battleMobContainer").attr("src", $("#dead").attr("src"));
                $("#heroHP").html(battle.hero.hp + " HP");
                $("#mobHP").html(0 + " HP");
            }
            else {
                $("#battleHeroContainer").attr("src", $("#dead").attr("src"));
                $("#heroHP").html(battle.hero.hp + " HP");
                $("#mobHP").html(0 + " HP");
            }
        }
        else {
            if(battle.round*1 > 0) {
                $("#heroHP").html((battle.hero.hp*1+battle.mob.damageImpact*1) + " HP");
                $("#mobHP").html((battle.mob.hp*1+battle.hero.damageImpact*1) + " HP");
                
                if(battle.hero.damageImpact > 0) {
                    battleAnimation1("#mobHP", "#battleMobContainer", battle.hero.damageImpact*1, battle.mob.hp*1, function() {
                        if(battle.mob.damageImpact > 0) {
                            battleAnimation1("#heroHP", "#battleHeroContainer", battle.mob.damageImpact*1, battle.hero.hp*1, function() {
                                $("#battleButtonBar").show();
                            });
                        }
                    });
                }
                else if(battle.mob.damageImpact > 0) {
                    battleAnimation1("#heroHP", "#battleHeroContainer", battle.mob.damageImpact*1, battle.hero.hp*1, function() {
                        $("#battleButtonBar").show();
                    });
                }
                else
                    $("#battleButtonBar").show();
            }
            else {
                $("#heroHP").html(battle.hero.hp + " HP");
                $("#mobHP").html(battle.mob.hp + " HP");
            }
        }	
    };

    this.drawTreasureScreen = function(battle) {
        logInfo("showing treasure screen!");
        $(".function").hide();	
        $(canvasLayer2).hide();
        $(canvasLayer1).show();
        $("#treasureScreenButtonBar").show();	
        
        var ctx1 = canvasLayer1.getContext("2d");
        ctx1.clearRect(0,0,canvasWidth,canvasHeight);
        
        $("#container").css("background-image", "url('./resources/images/loot.jpg')");
        
        ctx1.font = "28px Calibri";
        ctx1.fillStyle = '#E4CA64';
      ctx1.fillText("You gained [" + battle.mob.xp + "] XP!",50,30);
        
        if(battle.mob.copper > 0)
            ctx1.fillText("You looted [" + battle.mob.copper + "] copper!",50,60);
        
        if(battle.mob.items && battle.mob.items.length > 0)
            ctx1.fillText("You found items while searching the corpse!",50,90);
    };
    
    this.drawDeathScreen = function(hero) {
        logInfo("showing death screen!");	
        $(".function").hide();	
        $(canvasLayer2).hide();
        $(canvasLayer1).hide();
    
        $("#deathScreenTextOverlay").show();
        $("#deathScreenBottomToolbar").show();		
        
        $("#container").css("background-image", "url('./resources/images/valkyrie.jpg')");
        
        $("#deathScreenTextOverlay").html("You died and lost XP and stamina!<br/>");
        $("#deathScreenTextOverlay").append("You soul will be summoned by a Valkyrie to your home town if you accept your fate!");
    };

    this.battleAnimation1 = function(targetHPDiv, targetCardDiv, damageImpact, finalHP, fnCallback) { 
        var audio = new Audio('./resources/sounds/sword-attack.wav');
        //var orgLeftPos = $(targetHPDiv).css("left");
        //$(targetHPDiv).css("left", orgLeftPos-40);
        
        $(targetHPDiv)
            .switchClass("plainText", "strikedText", 1500)
            .effect("pulsate", 2500)
            .switchClass("strikedText", "plainText", 1000)
            .effect("pulsate", function() { $(targetHPDiv).html(damageImpact + ' damage!').fadeIn(100);  audio.play(); }, 2500)
            .effect("pulsate", function() { $(targetHPDiv).html(finalHP + ' HP').fadeIn(100);}, 1500)
            .fadeIn(100, function() { $(targetCardDiv).effect("shake", 800); fnCallback(); });
    };
}