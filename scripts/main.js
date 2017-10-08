const main = {
	buttClick: 0,
	dummy: new Mob("Dum Dum",1000,1,0,0),
	wummy: new Mob("Wum Wum",1000,1,0,0),
	mainWindow: document.querySelector('#main'),
	mainGameLog: function(string){
		this.mainWindow.innerHTML += string + "<br>";
		this.mainWindow.scrollTop = this.mainWindow.scrollHeight;
	},
	makeAttack: function(aggressor,defender){
		let attackReport = aggressor.attack(defender);
		this.mainGameLog(`${attackReport[0]} attacked ${attackReport[2]} dealing ${attackReport[1]} damage, leaving ${attackReport[3]}HP remaining...`);
		return attackReport;
	},
	runtime: function (){
		console.log("main.js loaded successfully.");
		this.mainGameLog("mainWindow captured successfully.");
		this.makeAttack(this.dummy,this.wummy);
		//let attackReport = this.dummy.attack(this.wummy);
		//this.mainGameLog(`${attackReport[0]} attacked ${attackReport[2]} dealing ${attackReport[1]} damage, leaving ${attackReport[3]}HP remaining...`);
	}
}
