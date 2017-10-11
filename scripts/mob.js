console.log("mob.js loaded successfully");

const abilities = {
	//abilityName: [0=verb,1=damage forumla,2=turnCount increment]
	rawAttack: ["attacked",'(Math.floor(Math.random() * ((this.str * 1.75) - (this.str * 0.50) + 1) + (this.str * 0.50)))',100],
	fastAttack: ["swiftly attacked",'(Math.floor(Math.random() * ((this.str * 1.25) - (this.str * 0.25) + 1) + (this.str * 0.25)))',60],
	kick: ["kicked",'(Math.floor(Math.random() * ((this.str * 1)+(this.agi * 1.75)) - ((this.str * 0.25)+(this.agi * 0.75)) + 1) + ((this.str * 0.25)+(this.agi * 0.75)))',120],
	heavyAttack: ["heavily attacked",'(Math.floor(Math.random() * ((this.str * 2.25) - (this.str * 1.75) + 1) + (this.str * 1.75)))',160],
}

function Mob(name,hp,str,agi,int,controller){
	this.name = name; 	  //Identity
	this.maxhp = hp;
	this.hp = hp;	      //Health Points
	this.str = str;	  	  //Strength
	this.agi = agi;   	  //Agility
	this.int = int;   	  //Intelligence
	this.cpu = controller;//Is this a computer controlled mob?
	this.dead = false;	  //Am I dead?
	this.turnTimer = 100; //How long t'ill my next turn?
	this.abilities = {};
}

Mob.prototype.loadCQC = function(){
	console.log(`Granting basics to ${this.name}...`)
	this.abilities["rawAttack"] = abilities["rawAttack"];
	this.abilities["fastAttack"] = abilities["fastAttack"];
	this.abilities["kick"] = abilities["kick"];
	this.abilities["heavyAttack"] = abilities["heavyAttack"];
	console.log(this.abilities);
}

Mob.prototype.loadAbility = function(skill){
	console.log(`Granting ${skill} to ${this.name}...`)
	this.abilities[skill] = abilities[skill];
	console.log(this.abilities);
}

Mob.prototype.takeDamage = function(damage){
	this.hp -= damage;
	if(this.hp <= 0){
		this.dead = true;
	}
	return [this.name,this.damage,this.hp,"Mob.takeDamage"];
}

Mob.prototype.attack = function(target,ability){
	console.log(`${this.turnTimer}`);
	let damage = 0;
	let crit = false;
	let dodged = false;
	let killingBlow = false;
	if(this.turnTimer > 0){
		console.log("Not your turn, stop that shit.");
		return false;
	}
	let rand = Math.floor(Math.random() * 100) + 1;
	if (rand < ((target.agi*2.25)+(target.int*1.75))-((this.agi*1.50)+(this.int*1.50))){
		console.log("Attack was dodged");
		dodged = true;
	}
	if(dodged === true){
		damage = 0;
		this.turnTimer = 100;
		target.turnTimer += 20;
	}
	else{
		//following line copy pasted from https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random	
		damage = Math.ceil(eval(this.abilities[ability][1]));
		damage -= Math.ceil(target.str * 0.25);
		if (damage < 0){
			damage = 0;
		}
		rand = Math.floor(Math.random() * 100) + 1;
		if (rand < (this.int*4)){
			damage = (damage+2)*2; 
			crit = true;
		}
		target.takeDamage(damage);
		this.turnTimer = this.abilities[ability][2];
		if (target.hp <= 0){
			killingBlow = true;
		}
	}
	return [this.name,damage,target.name,target.hp,killingBlow,crit,dodged,this.abilities[ability][0],"Mob.attack"];
}
