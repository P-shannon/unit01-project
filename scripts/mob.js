console.log("mob.js loaded successfully");
function Mob(name,hp,str,agi,int){
	this.name = name; //Identity
	this.hp = hp;	  //Health Points
	this.str = str;	  //Strength
	this.agi = agi;   //Agility
	this.int = int;   //Intelligence
	this.dead = false;
}

Mob.prototype.takeDamage = function(damage){
	this.hp -= damage;
	if(this.hp <= 0){
		this.dead = true;
	}
	return [this.name,this.damage,this.hp,"Mob.takeDamage"];
}

Mob.prototype.attack = function(target){
	target.takeDamage(this.str);
	let killingBlow = false;
	if (target.hp <= 0){
		killingBlow = true;
	}
	return [this.name,this.str,target.name, target.hp,killingBlow,"Mob.attack"];
}