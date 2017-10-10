const main = {
	dumDead: false,
	buttons: document.querySelectorAll('#buttons button'),
	creationDialog: document.querySelector("#creation"),
	mainWindow: document.querySelector('#main'),
	auxWindow: document.querySelector('#aux'),
	protag: "null",
	turnOwner: "wummy",
	mobs: [],
	souls: [],
	createMob: function(name,hp,str,agi,int,controller){
		main.mobs[(main.mobs.length)] = new Mob(name,hp,str,agi,int,controller);
	},
	changeCreationDialog: function(state){
		main.creationDialog.style.visibility = state;
	},
	characterCreationStatMod(stat, amount){
		if(amount < 0){
			if(parseInt(document.querySelector(`#${stat}`).innerHTML)<=2){
				console.log(`${stat} too low for lowering, please don't try again`);
				return false;
			}
		}

		if(amount > 0){
			if(parseInt(document.querySelector(`#cREM`).innerHTML)==0){
				console.log(`No more points left for distributing.`);
				return false;
			}
		}

		console.log(`Modifying ${stat} by ${amount}...`);
		document.querySelector(`#${stat}`).innerHTML = Number(document.querySelector(`#${stat}`).innerHTML) + amount;
		console.log(`Updating remaining points...`);
		document.querySelector('#cREM').innerHTML = Number(document.querySelector('#cREM').innerHTML) - amount;
	},
	characterCreationConfirm: function(){
		console.log(`Creating character...`)
		let name = document.querySelector('#iName').value;
		let hp = Number(document.querySelector('#cHP').innerHTML)*10;
		let str = Number(document.querySelector('#cSTR').innerHTML);
		let agi = Number(document.querySelector('#cAGI').innerHTML);
		let int = Number(document.querySelector('#cINT').innerHTML);
		main.createMob(name,hp,str,agi,int,false);
		main.mainGameLog(`With a bright flash of light, your surroundings appear before you. "You know what to do, ${name}." echoes through the air briefly. <br> You have no idea what to do.`);
		for (let i in main.mobs){
			console.log("Assigning protagonist...");
			//This is definitely going to need a sanity check.
			if(main.mobs[i].name === name){
				console.log(`Protagonist found, best of luck ${name}`);
				main.protag = name;
				main.mobs[i].turnTimer = 0;
			}
		}
		main.turnOwner = main.protag;
		main.changeCreationDialog("hidden");
		main.showCombatants();
	},
	changeButtons: function(state){
		console.log(`Begin changing button states!`);
		if (state === "visible"){
			for(let i = 0; i < main.buttons.length; i++){
				main.buttons[i].style.position = "static";
			}
		}
		else if (state === "hidden"){
			for(let i = 0; i < main.buttons.length; i++){
				main.buttons[i].style.position = "absolute";
			}
		}
		else{
			console.log(`${state} is not a valid value, please check your code...`);
			return false;
		}
		for(let i = 0; i < main.buttons.length; i++){
			//console.log(`Changing button: ${main.buttons[i].innerHTML}'s state to: ${state}...`);
			main.buttons[i].style.visibility = state;
		}
		console.log(`Button change complete!`);
	},
	clearTemps: function(){
		let temp = document.querySelectorAll('.temp');
		console.log(`Removing Temporary buttons.`);
		for(let i = 0; i < temp.length; i++){
			temp[i].parentElement.removeChild(temp[i]);
		}
		// main.changeButtons("visible");
	},
	giveTurn: function(){
		let lowest = main.mobs[0].turnTimer;
		let lowestAddress = 0;
		console.log("Finding next mob...");
		for(let i in main.mobs){
			console.log(`Checking ${main.mobs[i].name}, Timer: ${main.mobs[i].turnTimer}`);
			if (main.mobs[i].turnTimer < lowest){
				lowest = main.mobs[i].turnTimer;
				lowestAddress = i;
			}
		}
		main.turnOwner = main.mobs[lowestAddress].name;
		console.log(`Next up: ${main.mobs[lowestAddress].name}. Advancing turnTimers...`);
		for(let i in main.mobs){
			main.mobs[i].turnTimer -= lowest;
		}
		console.log(`Turn time advancement complete. Handing control to Mob.`)
		main.controlAI(main.mobs[lowestAddress]);
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
	//TODO: make this action agnostic.
	makeAttack: function(aggressorName,defenderName){
		main.changeButtons("hidden");
		let aggressor = null;
		let defender = null;
		//find the aggressor
		console.log(`Searching for ${aggressorName}...`);
		for(let i in main.mobs){
			console.log(main.mobs[i]);
			if (main.mobs[i].name.toLowerCase() === aggressorName.toLowerCase()){
				console.log('Found, aggressor assigned.');
				aggressor = main.mobs[i];
				break;
			}
		}
		//find the defender
		console.log(`Searching for ${defenderName}...`)
		for(let i in main.mobs){
			console.log(main.mobs[i]);
			if (main.mobs[i].name.toLowerCase() === defenderName.toLowerCase()){
				console.log("Found, defender assigned.");
				defender = main.mobs[i];
				break;
			}
		}
		//TODO: make this sensitive to players.
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
			main.giveTurn();
			main.dumDead = true;
		}
		main.showCombatants();
		console.log(`Attack completed!`)
		defender.turnTimer--;
		return attackReport;
	},
	controlAI: function(mob){
		if(mob.cpu){
			console.log("Computer Player's turn...");
			//TODO: make this more intelligent
			let hostiles = [];
			for (let i in main.mobs){
				if (main.mobs[i].cpu === false){
					hostiles.push(main.mobs[i]);
				}
			}
			if (hostiles.length === 0){
				console.log(`All players deceased. Surrendering turn.`)
				main.showCombatants();
				main.changeButtons('visible');
				return false;
			}
			let target = hostiles[Math.floor(Math.random()*hostiles.length)].name;
			console.log(`Targeting ${target}...`);
			setTimeout(main.makeAttack,750,mob.name,target);
			return true;
		}
		console.log("Player's turn...");
		main.changeButtons("visible");
		return false;
	},
	mainGameLog: function(string){
		main.mainWindow.innerHTML += string + "<br><br>";
		main.mainWindow.scrollTop = main.mainWindow.scrollHeight;
	},
	showCombatants: function(){
		console.log(`Displaying combantants...`)
		main.auxWindow.innerHTML = "";
		for(let i in main.mobs){
			//TODO: make more sensitive to 'teams'
			if(main.mobs[i].name === main.protag){
				if(main.mobs[i].name === main.turnOwner){
					main.auxWindow.innerHTML += `>>${main.mobs[i].name} (You): ${main.mobs[i].hp} HP <br>`;
				}
				else{
					main.auxWindow.innerHTML += `${main.mobs[i].name} (You): ${main.mobs[i].hp} HP <br>`;
				}	
			}
			else if(main.mobs[i].cpu === false){
				if(main.mobs[i].name === main.turnOwner){
					main.auxWindow.innerHTML += `>>${main.mobs[i].name} (Ally): ${main.mobs[i].hp} HP <br>`;
				}
				else{
					main.auxWindow.innerHTML += `${main.mobs[i].name} (Ally): ${main.mobs[i].hp} HP <br>`;
				}	
			}
			else{
				if(main.mobs[i].name === main.turnOwner){
					main.auxWindow.innerHTML += `>>${main.mobs[i].name}: ${main.mobs[i].hp} HP <br>`;
				}
				else{
					main.auxWindow.innerHTML += `${main.mobs[i].name}: ${main.mobs[i].hp} HP <br>`;
				}
			}
		}
	},
	showTargets: function(){
		console.log('Showing target list!')
		let buttonHolder = document.querySelector('#buttons');
		main.changeButtons("hidden");
		for (let i in main.mobs){
			console.log(`Creating attack button for: ${main.mobs[i].name}...`)
			let current = document.createElement('button');
			if (main.mobs[i].name === main.turnOwner){
				current.innerHTML = `${main.mobs[i].name} (You)`;
			}
			else if(main.mobs[i].name === main.protag){
				current.innerHTML = `${main.mobs[i].name} (Main)`;
			}
			else if(main.mobs[i].cpu === false){
				current.innerHTML = `${main.mobs[i].name} (Ally)`;
			}
			else{
				current.innerHTML = main.mobs[i].name;
			}
			current.className = 'temp';
			let attackThis = function(){
				main.makeAttack(main.turnOwner,main.mobs[i].name);
				main.clearTemps();
			}
			current.addEventListener('click',attackThis);
			buttonHolder.appendChild(current);
		}
	},

	/**********************************************
	*
	*  Main runtime is here. Nothing else should go 
	*                 under here.
	**********************************************/
	
	runtime: function (){
		console.log("main.js loaded successfully.");
		main.createMob("Wummy",100,5,0,0,true);
		main.createMob("Dummy",100,5,0,0,true);
		//main.mobs[1].turnTimer = 0;
		//this.makeAttack("Dummy","Wummy");
	}
}
