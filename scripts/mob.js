console.log("mob.js loaded successfully");
function Mob(name,hp,str,agi,int,controller){
	this.name = name; 	  //Identity
	this.hp = hp;	      //Health Points
	this.str = str;	  	  //Strength
	this.agi = agi;   	  //Agility
	this.int = int;   	  //Intelligence
	this.cpu = controller;//Is this a computer controlled mob?
	this.dead = false;	  //Am I dead?
	this.turnTimer = 100; //How long t'ill my next turn?
}

Mob.prototype.takeDamage = function(damage){
	this.hp -= damage;
	if(this.hp <= 0){
		this.dead = true;
	}
	return [this.name,this.damage,this.hp,"Mob.takeDamage"];
}

Mob.prototype.attack = function(target){
	console.log(`${this.turnTimer}`);
	let damage = 0;
	let crit = false;
	if(this.turnTimer > 0){
		console.log("Not your turn, stop that shit.");
		return false;
	}
	//following line copy pasted from https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
	damage = (Math.floor(Math.random() * ((this.str * 1.75) - (this.str * 0.50) + 1) + (this.str * 0.50)));
	damage -= Math.ceil(target.str * 0.25);
	let rand = Math.floor(Math.random() * 100) + 1;
	if (rand < (this.int*4)){
		damage = (damage+2)*3; 
		crit = true;
	}
	if (damage < 0){
		damage = 0;
	}
	target.takeDamage(damage);
	this.turnTimer = 100;
	let killingBlow = false;
	if (target.hp <= 0){
		killingBlow = true;
	}
	return [this.name,damage,target.name,target.hp,killingBlow,crit,"Mob.attack"];
}
