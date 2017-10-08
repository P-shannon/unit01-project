const main = {
	buttClick: 1,
	dumDead: false,
	mainWindow: document.querySelector('#main'),
	mobs: [],
	souls: [],
	createMob: function(name,hp,str,agi,int){
		this.mobs[(this.mobs.length)] = new Mob(name,hp,str,agi,int);
	},
	mainGameLog: function(string){
		this.mainWindow.innerHTML += string + "<br>";
		this.mainWindow.scrollTop = this.mainWindow.scrollHeight;
	},
	reapSouls: function(){
		for(let i in this.mobs){
			if(this.mobs[i].dead){
				this.souls[this.souls.length] = this.mobs.splice(i,1)[0];
			}
		}
	},
	makeAttack: function(aggressorName,defenderName){
		let aggressor = null;
		let defender = null;
		//find the aggressor
		for(let i in this.mobs){
			console.log(this.mobs[i]);
			if (this.mobs[i].name.toLowerCase() === aggressorName.toLowerCase()){
				console.log('Found, aggressor assigned.');
				aggressor = this.mobs[i];
				break;
			}
		}
		//find the defender
		for(let i in this.mobs){
			console.log(this.mobs[i]);
			if (this.mobs[i].name.toLowerCase() === defenderName.toLowerCase()){
				console.log("Found, defender found.");
				defender = this.mobs[i];
				break;
			}
		}

		if(aggressor == null){
			this.mainGameLog(`${aggressorName} was not found, please try again.`);
			return false;
		}
		if(defender == null){
			this.mainGameLog(`${defenderName} was not found, please try again.`);
			return false;
		}

		let attackReport = aggressor.attack(defender);
		if (!(attackReport[4])){
			this.mainGameLog(`${attackReport[0]} attacked ${attackReport[2]} dealing ${attackReport[1]} damage, leaving ${attackReport[3]}HP remaining...`);
		}
		else {
			this.mainGameLog(`${attackReport[0]} attacked ${attackReport[2]} dealing a killing blow, for ${attackReport[1]} damage!<br>${attackReport[0]} falls over.`);
			this.reapSouls();
			this.dumDead = true;
		}
		return attackReport;
	},

	/**********************************************
	*
	*  Main runtime is here. Nothing else should go 
	*                 under here.
	**********************************************/
	
	runtime: function (){
		console.log("main.js loaded successfully.");
		this.createMob("Wummy",1000,100,0,0);
		this.createMob("Dummy",1000,100,0,0);
		this.makeAttack("Dummy","Wummy");
	}
}
