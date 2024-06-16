var synth;
let personnageTalking = '';
let talkingText = '';
let validVoices = {};
let utterances = [];


// start webcam in browser
document.addEventListener("DOMContentLoaded", () => {
	
	synth = window.speechSynthesis;

});


speechSynthesis.addEventListener("voiceschanged", () => {

	const voices = window.speechSynthesis.getVoices();
	
	for(let i = 0; i < voices.length ; i++) {
		if(voices[i].lang.includes('fr')) {
			validVoices[voices[i].name] = voices[i];
		}
	}

})


function cancelSpeech() {
	
	speechSynthesis.cancel();
	utterances = [];

}


function isTalking() {

	return utterances.length > 0;

}


// use Chrome Text-To-Speech to read the text
function speak(nom, newText, delayTime = 0) {

	personnageTalking = nom;

	let desiredVoice = '';

	// if (newText != '' && newText != ' ') {
	// 	console.log("nom: ", nom);
	// 	console.log("newText: ", newText);
	// }

	switch (nom) {
		case 'Douglas':
			// don't speak text from Douglas
			return;
		case 'Isis':
			// don't speak text from Isis
			return;
		case '':
			desiredVoice = validVoices['Amélie (French (Canada))'];
			break;
		case 'Sycorax':
			desiredVoice = validVoices['Chantal (French (Belgium))'];
			break;
		case 'Miranda':
			desiredVoice = validVoices['Google français'];
			break;
		case 'Ariel':
			desiredVoice = validVoices['Aurélie']; // audrey, aude
			break;
		case 'Ferdinand':
			desiredVoice = validVoices['Daniel (French (France))'];
			break;
		case 'Prospero':
			desiredVoice = validVoices['Thomas (French (France))'];
			break;
		case 'Antonio':
			desiredVoice = validVoices['Daniel (French (France))'];
			break;
		case 'Sébastien':
			desiredVoice = validVoices['Daniel (French (France))'];
			break;
		case 'Alonso':
			desiredVoice = validVoices['Daniel (French (France))'];
			break;
		case 'Caliban':
			desiredVoice = validVoices['Thomas (French (France))'];
			break;

	}

	if (newText == '' || newText == ' ') {
		return;
	}

	let utterance = new SpeechSynthesisUtterance(newText);
	utterance.lang = "fr-FR";

	if (desiredVoice != '') {
		utterance.voice = desiredVoice;
		// console.log("desiredVoice: ", desiredVoice);
	}

	utterance.addEventListener("end", (event) => {
		// speakSupplement()
		talkingDone();
		// find this utterance in the array
		let index = utterances.indexOf(event.currentTarget);
		utterances.splice(index, 1);
		personnageTalking = '';
	});

	let utteranceDelay = Math.max(250, delayTime*1000);

	setTimeout(function () {
		talkingText = newText;
		speechSynthesis.speak(utterance);
		utterances.push(utterance);
	}, utteranceDelay);

}


function talkingDone() {

	// tell the dmx controller to turn off the lights for the personnage
	dmxOff(personnageTalking);

}

