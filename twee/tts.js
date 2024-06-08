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
function speak(nom, newText) {

	personnageTalking = nom;

	let desiredVoice = '';

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

	if (newText == '' || newText == ' ') {
		return;
	}

	let utterance = new SpeechSynthesisUtterance(newText);
	utterance.lang = "fr-FR";

	if (desiredVoice != '') {
		utterance.voice = desiredVoice;
	}

	utterance.addEventListener("end", (event) => {
		// speakSupplement()
		talkingDone();
		// find this utterance in the array
		let index = utterances.indexOf(event.currentTarget);
		utterances.splice(index, 1);
		personnageTalking = '';
	});


	setTimeout(function () {
		talkingText = newText;
		speechSynthesis.speak(utterance);
		utterances.push(utterance);
	}, 250);

}


function talkingDone() {

}