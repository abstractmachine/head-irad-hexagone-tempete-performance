let typewriterDelay = 25;
let data = {};

let titlecard, auteurLabel, auteurParole, sorciereLabel, sorciereParole;
let auteurTexte = "", auteurTexteIndex = -1, sorciereTexte = "", sorciereTexteIndex = -1;
let lastTypewriter = 0;
let alphabet = "abcdefghijklmnopqrstuvwxyz";

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
		let nextChar = auteurTexte.charAt(auteurTexteIndex);
		let index = auteurTexteIndex % alphabet.length;
		let letter = alphabet.charAt(index);
		if (nextChar != ' ') {
			auteurParole.innerHTML += "<span class='wave-" + letter + "'>" + nextChar + "</span>";
		} else {
			auteurParole.innerHTML += nextChar;
		}
		auteurTexteIndex++;
		return;
	}

	// increment text index
	if (sorciereTexteIndex < sorciereTexte.length) {
		let nextChar = sorciereTexte.charAt(sorciereTexteIndex);
		let index = sorciereTexteIndex % alphabet.length;
		let letter = alphabet.charAt(index);
		if (nextChar != ' ') {
			sorciereParole.innerHTML += "<span class='wave-" + letter + "'>" + nextChar + "</span>";
		} else {
			sorciereParole.innerHTML += nextChar;
		}
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

	effacerParoles(nom);

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

	// let span = '';
	// for (let i = 0; i < nom.length; i++) {
	// 	const letter = alphabet.charAt(i%26);
	// 	span += '<span class="wave-' + letter + '">' + nom.charAt(i) + '</span>';
	// }

	span = nom;

	switch(nom) {

		case 'Douglas':
		case 'Isis':
			// write the name in the label
			auteurLabel.innerHTML = span;
			// write the parole to the element
			auteurTexte = parole;
			auteurTexteIndex = 0;
			// auteurParole.innerHTML = parole;
			break;

		case 'Sycorax':
		case 'Caliban':
		case 'Ferdinand':
		case 'Miranda':
		case 'Prospero':
			// write the name in the label
			sorciereLabel.innerHTML = span;
			// write the parole to the element
			sorciereTexte = parole;
			sorciereTexteIndex = 0;
			// text-to-speech
			speak(nom, parole);
			// sorciereParole.innerHTML = parole;
			break;

	}
}

function effacerParoles(nom) {

	hideTitlecard();

	switch(nom) {
		case 'Douglas':
		case 'Isis':

		auteurLabel.innerHTML = '';
		auteurParole.innerHTML = '';
		auteurTexte = '';
		auteurTexteIndex = -1;

	}

	sorciereLabel.innerHTML = '';
	sorciereParole.innerHTML = '';
	sorciereTexte = '';
	sorciereTexteIndex = -1;

}

function keyPressed() {

	switch(key) {
		
		case 'd':
			prochaineParole("Douglas");
			break;
		case 'i':
			prochaineParole("Isis");
			break;
		case 's':
			prochaineParole("Sycorax");
			break;
		case 'c':
			prochaineParole("Caliban");
			break;
		case 'f':
			prochaineParole("Ferdinand");
			break;
		case 'm':
			prochaineParole("Miranda");
			break;
		case 'p':
			prochaineParole("Prospero");
			break;

	}

	switch (keyCode) {

		case BACKSPACE:
			reset();
			break;

		case TAB:
			effacerParoles('Douglas');
			break;

	}

}