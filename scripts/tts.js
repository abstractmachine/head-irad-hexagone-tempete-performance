/*
var synth;
let talking = false;
let personnageTalking = '';
let talkingText = '';
let validVoices = {};


// start webcam in browser
document.addEventListener("DOMContentLoaded", () => {
	
	synth = window.speechSynthesis;

});

speechSynthesis.addEventListener("voiceschanged", () => {
	const voices = window.speechSynthesis.getVoices();
	
	for(let i = 0; i < voices.length ; i++) {
		if(voices[i].lang.includes('fr')) {
			validVoices[voices[i].name] = voices[i];
			// console.log(voices[i].name);
		}
	}

})

// use Chrome Text-To-Speech to read the text
function speak(nom, newText) {

	talking = true;
	talkingText = newText;
	personnageTalking = nom;

	let desiredVoice = '';

	switch (nom) {
		case 'Sycorax':
			desiredVoice = validVoices['Amélie (French (Canada))'];
			break;
		case 'Miranda':
			desiredVoice = validVoices['Google français'];
			break;
		case 'Ferdinand':
			desiredVoice = validVoices['Daniel (French (France))'];
			break;
		case 'Caliban':
			desiredVoice = validVoices['Thomas (French (France))'];
			break;
		case 'Prospero':
			desiredVoice = validVoices['Rocko (French (France))'];
			break;

	}

	let utterance = new SpeechSynthesisUtterance(talkingText);
	utterance.lang = "fr-FR";

	if (desiredVoice != '') {
		utterance.voice = desiredVoice;
	}

	utterance.addEventListener("end", (event) => {
		// speakSupplement()
		talkingDone();
		talking = false;
		personnageTalking = '';
	  });
	speechSynthesis.speak(utterance);

}

function talkingDone() {

}
*/