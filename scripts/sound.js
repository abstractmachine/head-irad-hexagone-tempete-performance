let currentSound = "";
let sound;

function soundPlay(name) {

	let path = "assets/sounds/"  + name + ".wav";
	sound = loadSound(path, soundLoaded, soundError);
	currentSound = name;

}

function soundLoaded() {
	sound.setLoop(true);
	sound.play();
}


function soundError() {
	console.log('Error loading sound');
}


function soundReset() {

	// stop audio
	if (currentSound != "") {
		sound.stop();
		currentSound = "";
	}

}