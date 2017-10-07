const main = {
	buttClick: 0,
	mainWindow: document.querySelector('#main'),
	mainGameLog: function(string){
		this.mainWindow.innerHTML += string + "<br>";
		this.mainWindow.scrollTop = this.mainWindow.scrollHeight;
	},
	runtime: function (){
		console.log("main.js loaded successfully.");
		this.mainGameLog("mainWindow captured successfully.");
	}
}