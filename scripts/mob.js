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
	if(this.turnTimer > 0){
		console.log("Not your turn, stop that shit.");
		return false;
	}
	target.takeDamage(this.str);
	this.turnTimer = 100;
	let killingBlow = false;
	if (target.hp <= 0){
		killingBlow = true;
	}
	return [this.name,this.str,target.name, target.hp,killingBlow,"Mob.attack"];
}
