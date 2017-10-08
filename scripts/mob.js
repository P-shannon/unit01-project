console.log("mob.js loaded successfully");
function Mob(name,hp,str,agi,int){
	this.name = name;
	this.hp = hp;
	this.str = str;
	this.agi = agi;
	this.int = int;
}

Mob.prototype.takeDamage = function(damage){
	this.hp -= damage;
}

Mob.prototype.attack = function(target){
	target.takeDamage(this.str);
	return [this.name,this.str,target.name, target.hp];
}