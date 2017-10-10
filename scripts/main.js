const game = {
	dumDead: false,
	buttons: document.querySelectorAll('#buttons button'),
	creationDialog: document.querySelector("#creation"),
	mainWindow: document.querySelector('#main'),
	auxWindow: document.querySelector('#aux'),
	protag: "null",
	turnOwner: "wummy",
	mobs: [],
	souls: [],
	//game.mobs[]
	createMob: function(name, hp, str, agi, int, controller) {
		game.mobs[(game.mobs.length)] = new Mob(name, hp, str, agi, int, controller);
	},
	changeCreationDialog: function(state) {
		game.creationDialog.style.visibility = state;
	},
	characterCreationStatMod(stat, amount) {
		if (amount < 0) {
			if (parseInt(document.querySelector(`#${stat}`).innerHTML) <= 2) {
				console.log(`${stat} too low for lowering, please don't try again`);
				return false;
			}
		}
		if (amount > 0) {
			if (parseInt(document.querySelector(`#cREM`).innerHTML) == 0) {
				console.log(`No more points left for distributing.`);
				return false;
			}
		}
		console.log(`Modifying ${stat} by ${amount}...`);
		document.querySelector(`#${stat}`).innerHTML = Number(document.querySelector(`#${stat}`).innerHTML) + amount;
		console.log(`Updating remaining points...`);
		document.querySelector('#cREM').innerHTML = Number(document.querySelector('#cREM').innerHTML) - amount;
	},
	characterCreationConfirm: function() {
		console.log(`Creating character...`)
		let name = document.querySelector('#iName').value;
		let hp = Number(document.querySelector('#cHP').innerHTML) * 10;
		let str = Number(document.querySelector('#cSTR').innerHTML);
		let agi = Number(document.querySelector('#cAGI').innerHTML);
		let int = Number(document.querySelector('#cINT').innerHTML);
		game.createMob(name, hp, str, agi, int, false);
		game.mainGameLog(`With a bright flash of light, your surroundings appear before you. "You know what to do, ${name}." echoes through the air briefly. <br> You have no idea what to do.`);
		for (let i in game.mobs) {
			console.log("Assigning protagonist...");
			//This is definitely going to need a sanity check.
			if (game.mobs[i].name === name) {
				console.log(`Protagonist found, best of luck ${name}`);
				game.protag = name;
				game.mobs[i].turnTimer = 0;
			}
		}
		game.turnOwner = game.protag;
		game.changeCreationDialog("hidden");
		game.showCombatants();
	},
	changeButtons: function(type,state) {
		console.log(`Begin changing ${type} button states!`);
		let buttons = document.querySelectorAll(`#buttons .${type}`);
		if (state === "visible") {
			for (let i = 0; i < buttons.length; i++) {
				buttons[i].style.position = "static";
			}
		} else if (state === "hidden") {
			for (let i = 0; i < buttons.length; i++) {
				buttons[i].style.position = "absolute";
			}
		} else {
			console.log(`${state} is not a valid value, please check your code...`);
			return false;
		}
		for (let i = 0; i < buttons.length; i++) {
			//console.log(`Changing button: ${game.buttons[i].innerHTML}'s state to: ${state}...`);
			buttons[i].style.visibility = state;
		}
		console.log(`Button change complete!`);
	},
	clearTemps: function() {
		let temp = document.querySelectorAll('.temp');
		console.log(`Removing Temporary buttons.`);
		for (let i = 0; i < temp.length; i++) {
			temp[i].parentElement.removeChild(temp[i]);
		}
	},
	giveTurn: function() {
		let lowest = game.mobs[0].turnTimer;
		let lowestAddress = 0;
		console.log("Finding next mob...");
		for (let i in game.mobs) {
			console.log(`Checking ${game.mobs[i].name}, Timer: ${game.mobs[i].turnTimer}`);
			if (game.mobs[i].turnTimer < lowest) {
				lowest = game.mobs[i].turnTimer;
				lowestAddress = i;
			}
		}
		game.turnOwner = game.mobs[lowestAddress].name;
		console.log(`Next up: ${game.mobs[lowestAddress].name}. Advancing turnTimers...`);
		for (let i in game.mobs) {
			game.mobs[i].turnTimer -= (lowest + (game.mobs[i].agi) * 4);
		}
		console.log(`Turn time advancement complete. Handing control to Mob.`)
		game.controlAI(game.mobs[lowestAddress]);
	},
	reapSouls: function() {
		for (let i in game.mobs) {
			if (game.mobs[i].dead) {
				if (!(game.mobs[i].cpu)) {
					game.mainGameLog("Aw jeez man, <span style='color:red'>Game Over!</span>");
				}
				game.souls[game.souls.length] = game.mobs.splice(i, 1)[0];
			}
		}
	},
	//TODO: make this action agnostic.
	makeAttack: function(aggressorName, defenderName) {
		game.changeButtons("main","hidden");
		let aggressor = null;
		let defender = null;
		//find the aggressor
		console.log(`Searching for ${aggressorName}...`);
		for (let i in game.mobs) {
			console.log(game.mobs[i]);
			if (game.mobs[i].name.toLowerCase() === aggressorName.toLowerCase()) {
				console.log('Found, aggressor assigned.');
				aggressor = game.mobs[i];
				break;
			}
		}
		//find the defender
		console.log(`Searching for ${defenderName}...`)
		for (let i in game.mobs) {
			console.log(game.mobs[i]);
			if (game.mobs[i].name.toLowerCase() === defenderName.toLowerCase()) {
				console.log("Found, defender assigned.");
				defender = game.mobs[i];
				break;
			}
		}
		//TODO: make this sensitive to players.
		if (aggressor == null) {
			game.mainGameLog(`${aggressorName} was not found, please try again.`);
			return false;
		}
		if (defender == null) {
			game.mainGameLog(`${defenderName} was not found, please try again.`);
			return false;
		}
		let attackReport = aggressor.attack(defender);
		if (attackReport == false) {
			console.log("Attack failed.")
			return false;
		}
		if (!(attackReport[4])) {
			if(attackReport[5]){
				game.mainGameLog(`${attackReport[0]} found a vulnerability in ${attackReport[2]}'s stance dealing a critical ${attackReport[1]} damage, leaving ${attackReport[3]}HP remaining...`);
				game.giveTurn();
			}
			else{
				game.mainGameLog(`${attackReport[0]} attacked ${attackReport[2]} dealing ${attackReport[1]} damage, leaving ${attackReport[3]}HP remaining...`);
				game.giveTurn();
			}
		} else {
			if(attackReport[5]){
				game.mainGameLog(`${attackReport[0]} found a vulnerability in ${attackReport[2]}'s stance and dealt a critical, killing blow, for ${attackReport[1]} damage!<br>${attackReport[2]} falls over.`);
				game.reapSouls();
				game.giveTurn();
				game.dumDead = true;
			}
			else{
				game.mainGameLog(`${attackReport[0]} attacked ${attackReport[2]} dealing a killing blow, for ${attackReport[1]} damage!<br>${attackReport[2]} falls over.`);
				game.reapSouls();
				game.giveTurn();
				game.dumDead = true;
			}

		}
		game.showCombatants();
		console.log(`Attack completed!`)
		defender.turnTimer--;
		return attackReport;
	},
	//TODO: Rename this function, it's current name is retarded
	controlAI: function(mob) {
		if (mob.cpu) {
			console.log("Computer Player's turn!");
			//TODO: make this more intelligent
			let hostiles = [];
			console.log("Checking for hostiles...")
			for (let i in game.mobs) {
				if (game.mobs[i].cpu === false) {
					console.log("Hostile found.")
					hostiles.push(game.mobs[i]);
				}
			}
			if (hostiles.length === 0) {
				console.log(`All players deceased. Game over.`)
				game.showCombatants();
				game.changeButtons('init','visible');
				return false;
			}
			let target = hostiles[Math.floor(Math.random() * hostiles.length)].name;
			console.log(`Targeting ${target}...`);
			setTimeout(game.makeAttack, 750, mob.name, target);
			return true;
		}
		console.log("Player's turn!");
		let hostiles = [];
		console.log(`Checking for hostiles...`)
		for (let i in game.mobs) {
			if (game.mobs[i].cpu === true) {
				console.log('Hostile found.')
				hostiles.push(game.mobs[i]);
			}
		}
		if (hostiles.length === 0) {
			console.log(`No hostiles, battle won!`);
			game.mainGameLog("Battle won!");
			game.changeButtons("main","hidden");
			game.changeButtons("post","visible");
			return false;
		}
		game.changeButtons("main","visible");
		return false;
	},
	mainGameLog: function(string) {
		game.mainWindow.innerHTML += string + "<br><br>";
		game.mainWindow.scrollTop = game.mainWindow.scrollHeight;
	},
	showStats: function(){
		for(let i in game.mobs){
			if (game.mobs[i].name === game.turnOwner){
				game.mainGameLog(`${game.mobs[i].name}'s stats:<br>HP: ${game.mobs[i].hp}<br>STR: ${game.mobs[i].str}<br>AGI: ${game.mobs[i].agi}<br>INT: ${game.mobs[i].int}`);
			}
		}
	},
	showCombatants: function() {
		console.log(`Displaying combantants...`)
		game.auxWindow.innerHTML = "";
		for (let i in game.mobs) {
			//TODO: make more sensitive to 'teams'
			if (game.mobs[i].name === game.protag) {
				if (game.mobs[i].name === game.turnOwner) {
					game.auxWindow.innerHTML += `>>${game.mobs[i].name} (You): ${game.mobs[i].hp} HP <br>`;
				} else {
					game.auxWindow.innerHTML += `${game.mobs[i].name} (You): ${game.mobs[i].hp} HP <br>`;
				}
			} else if (game.mobs[i].cpu === false) {
				if (game.mobs[i].name === game.turnOwner) {
					game.auxWindow.innerHTML += `>>${game.mobs[i].name} (Ally): ${game.mobs[i].hp} HP <br>`;
				} else {
					game.auxWindow.innerHTML += `${game.mobs[i].name} (Ally): ${game.mobs[i].hp} HP <br>`;
				}
			} else {
				if (game.mobs[i].name === game.turnOwner) {
					game.auxWindow.innerHTML += `>>${game.mobs[i].name}: ${game.mobs[i].hp} HP <br>`;
				} else {
					game.auxWindow.innerHTML += `${game.mobs[i].name}: ${game.mobs[i].hp} HP <br>`;
				}
			}
		}
	},
	showTargets: function() {
		console.log('Showing target list!')
		let buttonHolder = document.querySelector('#buttons');
		game.changeButtons("main","hidden");
		game.changeButtons("init","hidden");
		for (let i in game.mobs) {
			console.log(`Creating attack button for: ${game.mobs[i].name}...`)
			let current = document.createElement('button');
			if (game.mobs[i].name === game.turnOwner) {
				current.innerHTML = `${game.mobs[i].name} (You)`;
			} else if (game.mobs[i].name === game.protag) {
				current.innerHTML = `${game.mobs[i].name} (Main)`;
			} else if (game.mobs[i].cpu === false) {
				current.innerHTML = `${game.mobs[i].name} (Ally)`;
			} else {
				current.innerHTML = game.mobs[i].name;
			}
			current.className = 'temp';
			let attackThis = function() {
				game.makeAttack(game.turnOwner, game.mobs[i].name);
				game.clearTemps();
			}
			current.addEventListener('click', attackThis);
			buttonHolder.appendChild(current);
		}
	},
	/**********************************************
	 *
	 *  Main runtime is here. Nothing else should go 
	 *                 under here.
	 **********************************************/
	runtime: function() {
		game.changeButtons("main","hidden");
		game.changeButtons("post","hidden")
		console.log("game.js loaded successfully.");
		game.mainGameLog("Please create a character before continuing.");
		game.createMob("Wummy", 100, 5, 2, 0, true);
		game.createMob("Dummy", 100, 5, 2, 0, true);
	}
}