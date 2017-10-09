const main = {
	buttClick: 1,
	dumDead: false,
	mainWindow: document.querySelector('#main'),
	mobs: [],
	souls: [],
	giveTurn: function(){
		let lowest = main.mobs[0].turnTimer;
		let lowestAddress = 0;
		console.log("finding next mob...");
		for(let i in main.mobs){
			console.log(`Checking ${main.mobs[i].name}, Timer: ${main.mobs[i].turnTimer}`);
			if (main.mobs[i].turnTimer < lowest){
				lowest = main.mobs[i].turnTimer;
				lowestAddress = i;
			}
		}
		console.log(`Next up: ${main.mobs[lowestAddress].name}. Advancing turnTimers...`);
		for(let i in main.mobs){
			main.mobs[i].turnTimer -= lowest;
		}
		main.controlAI(main.mobs[lowestAddress]);
	},
	createMob: function(name,hp,str,agi,int,controller){
		main.mobs[(main.mobs.length)] = new Mob(name,hp,str,agi,int,controller);
	},
	mainGameLog: function(string){
		main.mainWindow.innerHTML += string + "<br><br>";
		main.mainWindow.scrollTop = main.mainWindow.scrollHeight;
	},
	reapSouls: function(){
		for(let i in main.mobs){
			if(main.mobs[i].dead){
				if(!(main.mobs[i].cpu)){
					main.mainGameLog("Aw jeez man, <span style='color:red'>Game Over!</span>");
				}
				main.souls[main.souls.length] = main.mobs.splice(i,1)[0];
			}
		}
	},
	makeAttack: function(aggressorName,defenderName){
		let aggressor = null;
		let defender = null;
		//find the aggressor
		for(let i in main.mobs){
			console.log(main.mobs[i]);
			if (main.mobs[i].name.toLowerCase() === aggressorName.toLowerCase()){
				console.log('Found, aggressor assigned.');
				aggressor = main.mobs[i];
				break;
			}
		}
		//find the defender
		for(let i in main.mobs){
			console.log(main.mobs[i]);
			if (main.mobs[i].name.toLowerCase() === defenderName.toLowerCase()){
				console.log("Found, defender found.");
				defender = main.mobs[i];
				break;
			}
		}

		if(aggressor == null){
			main.mainGameLog(`${aggressorName} was not found, please try again.`);
			return false;
		}
		if(defender == null){
			main.mainGameLog(`${defenderName} was not found, please try again.`);
			return false;
		}

		let attackReport = aggressor.attack(defender);
		if(attackReport == false){
			console.log("Attack failed.")
			return false;
		}
		if (!(attackReport[4])){
			main.mainGameLog(`${attackReport[0]} attacked ${attackReport[2]} dealing ${attackReport[1]} damage, leaving ${attackReport[3]}HP remaining...`);
			main.giveTurn();
		}
		else {
			main.mainGameLog(`${attackReport[0]} attacked ${attackReport[2]} dealing a killing blow, for ${attackReport[1]} damage!<br>${attackReport[2]} falls over.`);
			main.reapSouls();
			main.dumDead = true;
		}
		defender.turnTimer--;
		return attackReport;
	},
	controlAI: function(mob){
		if(mob.cpu){
			console.log("Computer Player's turn...")
			setTimeout(main.makeAttack,750,mob.name,"dummy");
			return true;
		}
		console.log("Player's turn...")
		return false;
	},

	/**********************************************
	*
	*  Main runtime is here. Nothing else should go 
	*                 under here.
	**********************************************/
	
	runtime: function (){
		console.log("main.js loaded successfully.");
		main.createMob("Wummy",1000,100,0,0,true);
		main.createMob("Dummy",1000,100,0,0,false);
		main.mobs[1].turnTimer = 0;
		//this.makeAttack("Dummy","Wummy");
	}
}
