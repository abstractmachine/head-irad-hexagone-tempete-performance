let typewriterDelay = 25;
let data = {};

let titlecard, auteurLabel, auteurParole, sorciereLabel, sorciereParole;
let auteurTexte = "", auteurTexteIndex = -1, sorciereTexte = "", sorciereTexteIndex = -1;
let lastTypewriter = 0;

function preload() {
	data = loadJSON('data/paroles.json');
}

function setup() {

	titlecard = document.getElementById("titlecard");
	auteurLabel = document.getElementById("auteur");
	auteurParole = document.getElementById("parole-auteur");
	sorciereLabel = document.getElementById("sorciere");
	sorciereParole = document.getElementById("parole-sorciere");

}

function draw() {

	typewriter();

}

function typewriter() {

	// if the last typewriter event was less than 100ms ago, return
	if (abs(millis() - lastTypewriter) < typewriterDelay) {
		return;
	}

	// if there is no text to display, return
	if (auteurTexteIndex == -1 && sorciereTexteIndex == -1) {
		return;
	}

	// if all the text is displayed, return
	if (auteurTexteIndex == auteurTexte.length && sorciereTexteIndex == sorciereTexte.length) {
		return;
	}

	// reset the speed timer
	lastTypewriter = millis();

	// increment text index
	if (auteurTexteIndex < auteurTexte.length) {
		auteurParole.innerHTML += auteurTexte.charAt(auteurTexteIndex);
		auteurTexteIndex++;
		return;
	}

	// increment text index
	if (sorciereTexteIndex < sorciereTexte.length) {
		sorciereParole.innerHTML += sorciereTexte.charAt(sorciereTexteIndex);
		sorciereTexteIndex++;
		return;
	}

}

function reset() {

	effacerParoles();
	showTitlecard();

	data.paroles["Douglas"].index = 0;
	data.paroles["Isis"].index = 0;
	data.paroles["Sycorax"].index = 0;

}

function showTitlecard() {
	titlecard.style.display = '';
}

function hideTitlecard() {
	titlecard.style.display = 'none';
}

function prochaineParole(nom) {

	let index = data.paroles[nom].index;
	let parole = data.paroles[nom].paroles[index];

	// if no more paroles, return
	if (index < data.paroles[nom].paroles.length) {
		// increment the paroles index
		data.paroles[nom].index = (index + 1);
		// speak
		parler(nom, parole);
	}

}

function parler(nom, parole) {

	switch(nom) {

		case 'Douglas':
		case 'Isis':
			// write the name in the label
			auteurLabel.innerHTML = nom;
			// write the parole to the element
			auteurTexte = parole;
			auteurTexteIndex = 0;
			// auteurParole.innerHTML = parole;
			break;

		case 'Sycorax':
			// write the name in the label
			sorciereLabel.innerHTML = nom;
			// write the parole to the element
			sorciereTexte = parole;
			sorciereTexteIndex = 0;
			// sorciereParole.innerHTML = parole;
			break;

	}
}

function effacerParoles() {

	hideTitlecard();

	auteurLabel.innerHTML = '';
	auteurParole.innerHTML = '';
	auteurTexte = '';
	auteurTexteIndex = -1;

	sorciereLabel.innerHTML = '';
	sorciereParole.innerHTML = '';
	sorciereTexte = '';
	sorciereTexteIndex = -1;

}

function keyPressed() {

	switch(key) {
		
		case 'd':
			effacerParoles();
			prochaineParole("Douglas");
			break;
		case 'i':
			effacerParoles();
			prochaineParole("Isis");
			break;
		case 's':
			prochaineParole("Sycorax");
			break;
	}

	switch (keyCode) {

		case BACKSPACE:
			reset();
			break;

	}

}