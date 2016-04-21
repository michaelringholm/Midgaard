var Logger = require('../common/Logger.js');
var _logger = new Logger();

module.exports = function Battle(hero, mob) {
	var _this = this;
	if(!hero || !mob) {
		_logger.logError("Hero or mob was null!");
		return;
	}
	
	this.hero = hero;
  this.mob =  mob;
	this.status = {over:false, winner:"", loser:""};
  
	this.getVersion = function() {
		return "0.0.0.2";  
  };
  
  this.drawB = function() {
  	_this.drawP(_this.hero);
    _this.drawP(_this.mob);
  };
  
  this.drawP = function(p) {
  	//$(p.div).html("a:" + p.a + " # h:" + p.h);
  };
	
	var meleeAttack = function(attacker, defender) {
		var rawDamage = Math.round(attacker.minAtk + (Math.random()*(attacker.maxAtk-attacker.minAtk)) );
		var damageImpact = damage-defender.ac;
		if (damageImpact < 0)
				damageImpact = 0;
				
		defender.hp = defender.hp - damageImpact;
	};
  
  this.attack = function(attacker, defender) {
		_logger.logInfo("Battle.attack");
		
		if (attacker.currentBattleAction == "melee")
			meleeAttack(attacker, defender);
		else {
			_logger.logError("Battle action [" + attacker.currentBattleAction + "] not implemented, reverting to melee attack!");
			meleeAttack(attacker, defender);
		}
  };
  
  this.getFirstUp = function(playerX, playerY) {
  	if(playerX.luck > playerY.luck)
    	return playerX;
    
    return playerY;
  };
  
  this.getSecondUp = function(playerX, playerY) {
  	if(playerX.luck > playerY.luck)
    	return playerY;
    
    return pX;
  };
  
  this.battleEnded = function(winner, loser) {
		_this.status.winner = winner.name;
		_this.status.loser = loser.name;
		_this.status.over = true;
		_logger.logInfo(winner.name + " won! and " + loser.name + " lost!");
		
		if(winner == hero)
			_this.heroWon();
		else
			_this.heroLost();
  };
	
	this.heroWon = function() {
		_logger.logInfo("hero won the battle!");
		_this.hero.xp += mob.xp;
		_this.hero.gold += mob.gold;
		_this.hero.silver += mob.silver;
		_this.hero.copper += mob.copper;
		
		for(var itemIndex in mob.items)
			_this.hero.items.push(mob.items[itemIndex]);
	};
	
	this.heroLost = function() {
		_logger.logInfo("hero lost the battle!");
		_this.hero.died(_this.mob);
	};
	
	this.regen = function() {
		_this.hero.hp += _this.hero.regen;
		_this.mob.hp += _this.mob.regen;
		
		if (_this.hero.hp > _this.hero.baseHp)
				_this.hero.hp = _this.hero.baseHp;
		if (_this.mob.hp > _this.mob.baseHp)
				_this.mob.hp = _this.mob.baseHp;
	};
  
  this.nextRound = function() {
  	_logger.logInfo("Battle.nextRound");
    
    if(_this.status.over) {
			_logger.logInfo("battle is over!");
    	return;
		}
      
  	var firstUp = _this.getFirstUp(_this.hero, _this.mob);
    var secondUp = _this.getSecondUp(_this.hero, _this.mob);
    
  	_this.attack(firstUp, secondUp);
    
    if(secondUp.hp <= 0) {
			_this.battleEnded(firstUp, secondUp);
    }
    else {
    	_this.attack(secondUp, firstUp);
    	
      if(firstUp.hp <= 0) {
				_this.battleEnded(secondUp, firstUp);
      }
			else
				_this.regen();
    }
    
    _logger.logInfo(JSON.stringify(_this.hero));
		_logger.logInfo(JSON.stringify(_this.mob));
  };
  
  this.construct = function() {
		_logger.logInfo("Battle.construct");
  	/*_this.drawB();
  	$("#nextR").click(function() { 
    	_this.nextR( {aT:"mel"}, {aT:"mel"} ); 
    });*/
  };
  
  _this.construct();
}