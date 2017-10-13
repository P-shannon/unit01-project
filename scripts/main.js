const game = {
	wins: 0,
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
		game.mobs[(game.mobs.length)-1].loadCQC();
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
		game.mobs[game.mobs.length-1].loadAbility("kick");
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
			game.mobs[i].turnTimer -= (lowest + (game.mobs[i].agi) * 5);
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
	makeAttack: function(aggressorName, defenderName, attack) {
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
		let attackReport = aggressor.attack(defender,attack);
		if (attackReport == false) {
			console.log("Attack failed.")
			return false;
		}
		if (attackReport[6] === true){
			game.mainGameLog(`${attackReport[2]} dodges ${attackReport[0]}'s attack!`);
			game.giveTurn();
		}
		else{
			if (!(attackReport[4])) {
				if(attackReport[5]){
					game.mainGameLog(`${attackReport[0]} found a vulnerability in ${attackReport[2]}'s stance and critically ${attackReport[7]} for ${attackReport[1]} damage, leaving ${attackReport[3]}HP remaining...`);
					game.giveTurn();
				}
				else{
					game.mainGameLog(`${attackReport[0]} ${attackReport[7]} ${attackReport[2]} dealing ${attackReport[1]} damage, leaving ${attackReport[3]}HP remaining...`);
					game.giveTurn();
				}
			} else {
				if(attackReport[5]){
					game.mainGameLog(`${attackReport[0]} found a vulnerability in ${attackReport[2]}'s stance and critically ${attackReport[7]} for ${attackReport[1]} damage, a killing blow!<br>${attackReport[2]} is knocked to the ground!`);
					game.reapSouls();
					game.giveTurn();
				}
				else{
					game.mainGameLog(`${attackReport[0]} ${attackReport[7]} ${attackReport[2]} dealing a killing blow, for ${attackReport[1]} damage!<br>${attackReport[2]} falls over.`);
					game.reapSouls();
					game.giveTurn();
				}
			}
		}
		game.showCombatants();
		console.log(`Attack completed!`)
		defender.turnTimer--;
		return attackReport;
	},
	//TODO: Rename this function, it's current name is retarded
	controlAI: function(mob) {
		mob.turnTimer = 0;
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
				console.log(`All players deceased. Game over.`);
				game.wins = 0;
				game.showCombatants();
				//game.changeButtons('init','visible');
				setTimeout(game.changeButtons,2000,'init','visible');
				setTimeout(function(){game.mobs=[]},2000);
				setTimeout(game.showCombatants,2000);
				return false;
			}
			let target = hostiles[Math.floor(Math.random() * hostiles.length)].name;
			let attack = Object.keys(mob.abilities)[Math.floor(Math.random() * Object.keys(mob.abilities).length)]
			console.log(`Targeting ${target} with ${attack}...`);
			setTimeout(game.makeAttack, 750, mob.name, target, attack);
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
			game.mainGameLog("Battle won, health restored!");
			game.wins++;
			game.changeButtons("main","hidden");
			game.changeButtons("post","visible");
			for(let i in game.mobs){
				game.mobs[i].hp = game.mobs[i].maxhp;
			}
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
				game.mainGameLog(`${game.mobs[i].name}'s stats:<br>Max HP: ${game.mobs[i].maxhp}<br>STR: ${game.mobs[i].str}<br>AGI: ${game.mobs[i].agi}<br>INT: ${game.mobs[i].int}`);
				game.mainWindow.innerHTML += `${game.mobs[i].name} knows how to do the following things: <br>`;
				for(let j in game.mobs[i].abilities){
					game.mainWindow.innerHTML += `${j}<br>`;

				}
			}
		}
		game.mainWindow.scrollTop = game.mainWindow.scrollHeight;
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
	showSkills: function() {
		console.log('Showing our skills!');
		let you = null;
		let buttonHolder = document.querySelector('#buttons');
		game.changeButtons("main","hidden");
		game.changeButtons("init","hidden");
		for (let i in game.mobs){
			if(String(game.mobs[i].name).toLowerCase() === String(game.turnOwner).toLowerCase()){
				console.log("found");
				you = game.mobs[i];
				break;
			}
		}
		for (let i in you.abilities){
			console.log(`Creating skill button for: ${i}...`)
			let current = document.createElement('button');
			current.innerHTML = i;
			current.className = 'temp';
			let doThis = function() {
				game.clearTemps();
				game.showTargets(i);
			}
			current.addEventListener('click', doThis);
			buttonHolder.appendChild(current);
		}
		let cancel = document.createElement('button');
		cancel.innerText = "<Cancel Attack>";
		cancel.className = 'temp';
		cancel.addEventListener('click', function(){game.clearTemps();game.changeButtons("main","visible");});
		buttonHolder.appendChild(cancel);
	},
	showTargets: function(attack) {
		console.log(`Showing target list with attack context: ${attack}!`);
		let buttonHolder = document.querySelector('#buttons');
		game.changeButtons("main","hidden");
		game.changeButtons("init","hidden");
		let players = [];
		for (let i in game.mobs) {
			console.log(`Creating attack button for: ${game.mobs[i].name}...`)
			let current = document.createElement('button');
			if (game.mobs[i].cpu === false){
				players.push(game.mobs[i]);
				continue;
			}
			current.innerHTML = game.mobs[i].name;
			current.className = 'temp';
			let attackThis = function() {
				game.makeAttack(game.turnOwner, game.mobs[i].name, attack);
				game.clearTemps();
			}
			current.addEventListener('click', attackThis);
			buttonHolder.appendChild(current);
		}
		for (let i in players) {
			console.log(`Creating attack button for: ${players[i].name}...`)
			let current = document.createElement('button');
			if (players[i].name === game.turnOwner) {
				current.innerHTML = `${players[i].name} (You)`;
			} else if (players[i].name === game.protag) {
				current.innerHTML = `${players[i].name} (Main)`;
			} else if (players[i].cpu === false) {
				current.innerHTML = `${players[i].name} (Ally)`;
			}
			current.className = 'temp';
			let attackThis = function() {
				game.makeAttack(game.turnOwner, players[i].name, attack);
				game.clearTemps();
			}
			current.addEventListener('click', attackThis);
			buttonHolder.appendChild(current);
		}
		let cancel = document.createElement('button');
		cancel.innerText = "<Cancel Attack>";
		cancel.className = 'temp';
		cancel.addEventListener('click', function(){game.clearTemps();game.changeButtons("main","visible");});
		buttonHolder.appendChild(cancel);
	},

	/**********************************************
	*
	*        This handles monster generation
	*
	**********************************************/

	monsters: [
		[`Imp`,5,4,10,10,true],
		[`Ork`,10,8,5,3,true],
		[`BugBear`,15,11,2,2,true], //needs balancing
		[`Viperoid`,7,6,12,6,true], //needs balancing
		[`Sloth Demon`,4,12,3,8,true],
		[`Wisp Manifest`,6,7,5,12,true],
	],
	spawnMonster: function(number){
		for(let i=0;i < number;i++){
			let rand = Math.floor(Math.random() * game.monsters.length);
			game.createMob(`${game.monsters[rand][0]} <${Math.floor(Math.random()*1000)}>`,((game.monsters[rand][1])+(Math.floor((Math.random() * 5) + -3)))*10,((game.monsters[rand][2])+(Math.floor((Math.random() * 6) + -3))),((game.monsters[rand][3])+(Math.floor((Math.random() * 6) + -3))),((game.monsters[rand][4])+(Math.floor((Math.random() * 6) + -3))),game.monsters[rand][5]);
			console.log(game.mobs[game.mobs.length-1]);
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
		//game.createMob("Wummy", 100, 5, 5, 5, true);
		//game.createMob("Dummy", 100, 5, 5, 5, true);
	}
}