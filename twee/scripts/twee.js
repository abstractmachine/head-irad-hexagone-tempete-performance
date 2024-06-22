config.body.transition.name = 'none';

let openAIKey = "";
let currentSpeaker = "";
let delayTime = 0.065;
let currentCharIndex = 0;
let previousCharIndex = 0;
let selectedLinkIndex = -1;
let currentSound = "";
let lastPassageName = "";
let cartes = {};
let motivations = {};
let speakerColor = 'white';

let lightStates = {"1":false, "2": false, "3": false, "4":false, "5": false, "28": false};


async function parseKey(key) {

	// switch to handle the key presses
	switch (key) {

		case '=':
			if (!port) {
				await connectSerial();
			}
			break;

		case 'Backspace':
			toggleCamera();
			break;

		case 'ArrowRight':
		case 'ArrowLeft':
		case 'ArrowUp':
		case 'ArrowDown':
		case 'Shift':
			highlightLink(key);
			break;

		case 'Enter':
			clickOnHighlight();
			break;

		case 'Escape':
			storyReset();
			break;

		case ';':
			printHistory();
			break;

		case '$':
			printStoryVariables();
			break;

		case '1':
		case '&':
		case '2':
		case 'é':
			lightStates['1'] = !lightStates['1'];
			lightStates['2'] = lightStates['1'];
			if (lightStates['1']) {
				dmxOn('Sycorax');
			} else {
				dmxOff('Sycorax')
			}
			break;

		case '3':
		case '"':
			lightStates['3'] = !lightStates['3'];
			if (lightStates['3']) {
				sendDataLight(3, 'on');
			} else {
				sendDataLight(3, 'off');
			}
			break;

		case '4':
		case "'":
			lightStates['4'] = !lightStates['4'];
			if (lightStates['4']) {
				dmxOn('Douglas');
			} else {
				dmxOff('Douglas')
			}
			break;

		case '5':
		case '(':
			lightStates['5'] = !lightStates['5'];
			if (lightStates['5']) {
				dmxOn('Protagonist');
			} else {
				dmxOff('Protagonist')
			}
			break;

		case '6':
		case '§':
			lightStates['28'] = !lightStates['28'];
			if (lightStates['28']) {
				dmxOn('Interlocuteur');
			} else {
				dmxOff('Interlocuteur')
			}
			break;

		case 'a':
			case 'b':
			case 'c':
			case 'd':
			case 'e':
			case 'f':
			case 'g':
			case 'h':
			case 'i':
			case 'j':
			case 'k':
			case 'l':
			case 'm':
			case 'n':
			case 'o':
			case 'p':
			case 'q':
			case 'r':
			case 's':
			case 't':
			case 'u':
			case 'v':
			case 'w':
			case 'x':
			case 'y':
			case 'z':
				// if we're in Choosing mode
				if (engine.state.get('Action') == 'Choosing') {
					chooseCard(key.toUpperCase());
				}
				break;
		
		default:
			break;

	}

}



// Ensure the engine is initialized and ready
window.onload = function() {

	// cancel any speech that is currently happening
	cancelSpeech();

	// these are the motivations of the various characters
	loadMotivationData();

	// get the data array of all the cards
	loadCardData();

	// create a history
	restartHistory();

	// Check if the init function exists and call it to initialize the engine
	if (typeof init === 'function') {
		init();
	}

	// Extend the engine with custom functionality
	engine.extend('1.2.3', function() {

		// Listen for the state change event
		engine.event.on('state-change', passageChanged);

		// Add event listener for key presses
		document.addEventListener('keydown', function (e) {
			parseKey(e.key);
		});

		restoreVisibility();

	});

};



// Function to handle passage changes
function passageChanged() {

	while (generatedData.length > 0) {
		// get the last generated data
		let data = generatedData.pop();
		// set the data in the engine
		engine.state.set(data.id, data.response);
	}

	// cancel any previous speaking utterances
	cancelSpeech();
	// reset any selected link index
	resetHighlight();
	// reset any previous speaker attributions
	setSpeaker("");

	const name = passage.name;
	const current = engine.story.passageNamed(name);

	if (current) {

		// Delay the execution of the code inside the setTimeout
		setTimeout(function() {

			let articles = document.getElementsByTagName('article');

			// If you want to access the first 'article' element
			if (articles.length > 0) {

				let firstArticle = articles[0];
				// start with a 0 index for the character count
				resetTypewriterTime();
				// parse this article using the inner html including tags
				speakArticle(firstArticle.innerHTML);
				// reset the typewriter time
				resetTypewriterTime();
				// add the typewriter effect to the first article
				var newHtml = addTypewriterEffect(firstArticle);
				// apply new html to the first article
				firstArticle.innerHTML = newHtml;
				// we need to restore the visibility of the paragraphs that currently have opacity 0
				// this is because we want to avoid the render flash before the start of the typewriter effect
				// we need to do this after the typewriter effect has been applied
				restoreVisibility();

				// if we have a story
				if (engine.state.get('Story') == true) {
					engine.state.set('Story', false);
					getStory();
				}

				// if we're in choosing mode
				if (engine.state.get('Action') == 'Choosing') {
					choosingMode();
				}

				// if we're done with an acte and have to reset the selected cards
				if (engine.state.get('Action') == 'ResetCards') {
					resetCards();
					engine.state.set('ResetCards', false);
				}

				if (engine.state.get('Action') == 'ResetHistory') {
					resetHistory();
					engine.state.set('Action', 'none');
				}

				if (engine.state.get('Action') == 'Parse') {
					id = engine.state.get('Id');
					if (id) {
						parseGeneratedList(id);
					}
					engine.state.set('Action', 'none');
				}

				if (engine.state.get('Action') == 'Sentencize') {
					id = engine.state.get('Id');
					if (id) {
						sentencizeGeneratedText(id);
					}
					engine.state.set('Action', 'none');
				}

				// if we're playing a sound
				if (engine.state.get('Sound')) {
					// get the sound name
					let soundName = engine.state.get('Sound');
					if (soundName == 'none') {
						resetSounds();
					} else {
						playSound(engine.state.get('Sound'));
					}
				}
				// if ('Sound')

			}

			// check to see if we need to generate a prompt
			let thisPassage = engine.story.passageNamed(passage.name);

			// if this is a different passage
			if (thisPassage != lastPassageName && thisPassage  != undefined) {
				lastPassageName = thisPassage;
				if (engine.state.get('Action') == 'Generate') {
					generateText();
				}
			}

		}, 10); // Delay of 0 milliseconds
	}


}


function getStory() {
	
	// get the current names of our two characters
	let nomProtagoniste = engine.state.get('Protagoniste');
	let nomAmant = engine.state.get('Amant');
	// get the current intrigue
	let intrigue = engine.state.get('Intrigue');

	switch(intrigue) {
		case 'Révélation':
			intrigue = 'Revelation';
			break;
		case 'Désobéisance':
			intrigue = 'Desobeisance';
			break;
		case 'Coup-de-foudre':
		case 'Coup de foudre':
			intrigue = 'CoupDeFoudre';
			break;
	}

	// make sure we got all three
	if (nomProtagoniste || nomAmant || intrigue) {
		// get the cross-referenced motivations for each character's relation to the intrigue
		let protagonisteMotivation = motivations[nomProtagoniste][intrigue];
		let amantMotivation = motivations[nomAmant][intrigue];
		// record in a variable type that can be easily sent to the AI
		engine.state.set('ProtagonisteMotivation', protagonisteMotivation);
		engine.state.set('AmantMotivation', amantMotivation);
	}

}


function choosingMode() {

	// get the category and variable
	let categorie = engine.state.get('Categorie');
	let variable = engine.state.get('Variable');

	if (categorie === undefined || variable === undefined) {
		return;
	}

	// find the categorie in the cards object
	if (cartes.hasOwnProperty(categorie)) {
		// get the cards for this category
		let cards = cartes[categorie];
		// get the color from the first card
		let couleur = cards[0].couleur;
		// send message to the parent window
		window.parent.postMessage({newCard: 'true', categorie:variable, couleur:couleur}, '*');

	}

	// make sure this value in unset in the P5 cards
	window.parent.postMessage({choosing: 'true', categorie:variable}, '*');

}




function playSound(sound) {

	if (currentSound == sound) {
		return;
	}

	// send message to the parent window
	window.parent.postMessage({sound: 'true', type: 'play', name: sound}, '*');

	currentSound = sound;

}


function resetSounds() {

	// send message to the parent window
	window.parent.postMessage({sound: 'true', type: 'reset'}, '*');

	currentSound = "";

}



async function loadMotivationData() {

	// load the file named 'head-hexagone-performance-tempete-motivations.csv'
	// this file contains the data for the motivations
	// the data is in the format: Personnage,Motivation
	// the data is loaded into the motivations object

	const csv = await fetch('assets/data/head-hexagone-performance-tempete-Intrigues.csv');
	const text = await csv.text();
	const csvData = d3.csvParse(text);
	let jsonData = JSON.parse(JSON.stringify(csvData));
		
	motivations = {};

	// go through each row of the csv data
	for (let i = 0; i < jsonData.length; i++) {

		// get the name of the 'Personnage'
		let personnage = jsonData[i]['Personnage'];

		motivations[personnage] = {};
		motivations[personnage]['Assassinat'] = jsonData[i]['Assassinat'];
		motivations[personnage]['Coup-de-foudre'] = jsonData[i]['Coup-de-foudre'];
		motivations[personnage]['Désobéisance'] = jsonData[i]['Désobéisance'];
		motivations[personnage]['Vengeance'] = jsonData[i]['Vengeance'];
		motivations[personnage]['Renoncement'] = jsonData[i]['Renoncement'];
		motivations[personnage]['Révélation'] = jsonData[i]['Révélation'];

		engine.state.set(personnage + '-' + 'Assassinat', motivations[personnage]['Assassinat']);
		engine.state.set(personnage + '-' + 'Coup-de-foudre', motivations[personnage]['Coup-de-foudre']);
		engine.state.set(personnage + '-' + 'Désobéisance', motivations[personnage]['Désobéisance']);
		engine.state.set(personnage + '-' + 'Vengeance', motivations[personnage]['Vengeance']);
		engine.state.set(personnage + '-' + 'Renoncement', motivations[personnage]['Renoncement']);
		engine.state.set(personnage + '-' + 'Révélation', motivations[personnage]['Révélation']);

	}

	engine.state.set('ProtagonisteMotivation', '');
	engine.state.set('AmantMotivation', '');

}



async function loadCardData() {

	// load the file named 'head-hexagone-performance-tempete-cartes.csv'
	// this file contains the data for the cards
	// the data is in the format: Titre,Badge / numéro,Image,Texte,Couleur,Catégorie
	// the data is loaded into the cards object

	const csv = await fetch('assets/data/head-hexagone-performance-tempete-cartes.csv');
	const text = await csv.text();
	const csvData = d3.csvParse(text);
	let jsonData = JSON.parse(JSON.stringify(csvData));

	// go through each row of the csv data
	for (let i = 0; i < jsonData.length; i++) {
		// get the row
		let row = jsonData[i];
		// get the category of the row
		let categorie = row['Catégorie'];
		// get the content of the row
		let contenu = row['Texte'];
		// get the identifier
		let id = row['Badge / numéro'];
		// get the title
		let titre = row['Titre'];
		// get the color
		let couleur = row['Couleur'];
		// get the color
		let note = row['Note'];
		// if the category does not exist in the cards object, create it
		if (!cartes.hasOwnProperty(categorie)) {
			// create a new array for this category
			cartes[categorie] = [];
		}

		cartes[categorie].push({'id': id, 'titre': titre, 'contenu': contenu, 'couleur': couleur, 'note': note});
	}

}


function storyReset() {

	// stop the sound
	resetSounds();
	// reset the visible cards
	resetCards();
	// tell the Twee engine to reset
	restart();
	// reset AI History
	restartHistory();

	engine.state.set('StoryHistory', "");

	lastPassageName = "";

}


function resetCards() {

	engine.state.set('Protagoniste', '');
	engine.state.set('Amant', '');
	engine.state.set('Intrigue', '');
	engine.state.set('Lieu', '');

	// send message to the parent window
	window.parent.postMessage({reset: 'true'}, '*');
	// turn off the choosing mode
	// engine.state.set('Choisir', 'false');

}



function toggleCamera() {

	// send message to the parent window
	window.parent.postMessage({camera: 'true', action:'toggle'}, '*');

}


function chooseCard(key) {

	let categorie = engine.state.get('Categorie');
	let variable = engine.state.get('Variable');

	// get first letter of the data category and the key we pressed
	let id = categorie[0].toUpperCase() + key.toUpperCase();
	
	// let's find this id in the data
	let found = false;
	for (let i = 0; i < cartes[categorie].length; i++) {
		let carte = cartes[categorie][i];
		if (carte.id == id) {
			found = true;

			// extract data
			let titre = carte.titre;
			// set the data in Twee
			engine.state.set(variable, titre);

			// send message to the parent window
			window.parent.postMessage({choseCard: 'true', categorie:variable, contenu:titre}, '*');

			// get the name of the next passage
			let nextPassage = engine.state.get('Done');
			// turn off the choosing mode
			engine.state.set('Action', 'none');
			// go to the next passage
			go(nextPassage);
			break;
		}
	}

}


// TODO: This is a CSS<>JS hack to restore the visibility of the paragraphs
// Need to find a better way to do this
function restoreVisibility() {

	// loop through all the <p> elements
	document.querySelectorAll('p, h1, h2, h3, h4, h5, h6, ul, ol, li, speak, voiceover').forEach(function(paragraph) {
		// reset paragraph opacity to 1
		paragraph.style.opacity = '1';
	});

}


function speakArticle(article) {

	// Create a new DOMParser
	let parser = new DOMParser();

	// Parse the article string into a Document
	let doc = parser.parseFromString(article, 'text/html');

	// look for all the speech tags in the document

	// Get all the <p> and <h1> elements in the Document (everything else ignored for TTS)
	let paragraphs = doc.querySelectorAll('p, li, speak, voiceover, h1, h2, h3, h4, h5, h6');

	// loop through all results
	for(let i=0; i<paragraphs.length; i++) {

		let paragraph = paragraphs[i];
		// get the tag type of the paragraph
		let tag = paragraph.tagName.toLowerCase();
		if (tag == 'speak' || tag == 'voiceover') {
			// get the data attribute of the paragraph
			let data = paragraph.getAttribute('data-persona');
			// set the speaker to the data attribute of the paragraph
			setSpeaker(data);
			// parse the paragraph
			parseParagraph(paragraph);
		} else if (tag == 'h1' || tag == 'h2' || tag == 'h3' || tag == 'h4' || tag == 'h5' || tag == 'h6') {
			// increment character count
			addCharacterCount(paragraph.textContent);
		} else if (tag == 'p') {
			// increment character count
			addCharacterCount(paragraph.textContent);
		}
	}

}


function resetSpeaker() {
	
	currentSpeaker = "";

	// figure out how many speakers there are
	let speakerCount = 16;
	// loop through all the speakers
	dmxOffAll();

}


function setSpeaker(name) {

	currentSpeaker = name;

}


function addCharacterCount(text) {

	// this is an ugly hack because the <p> tag comes before <speak> tag
	previousCharIndex = currentCharIndex;

	// only count letters that are not spaces
	let count = text.replace(/\s/g, '').length;
	currentCharIndex += count;

}


function parseParagraph(paragraph) {

	// get the child nodes of the paragraph
	let childNodes = paragraph.childNodes;
	// go through each child node of the paragraph
	for (let i = 0; i < childNodes.length; i++) {
		const node = childNodes[i];
		// if the node is a text node, wrap each character in a span element
		if (node.nodeType === Node.TEXT_NODE) {
			// calculate the delay for the current character count (i.e. start of this text node)
			let delay = calcualteCharacterDelay(previousCharIndex);
			// start speaking using the content of this text node
			speak(currentSpeaker, node.textContent, delay);
			// if there was actual text output, fire a function called dmxOutput
			// this function will send the text to the DMX controller
			if (node.textContent.trim() !== '') {
				dmxOn(currentSpeaker);
			}
		}
	}

}


function dmxSpeaker(personaTalking, roleColor, role) {

	console.log("dmxSpeaker(" + personaTalking + "\t" + roleColor + "\t" + role);

}

function dmxOn(speaker) {

	console.log("dmxOn(" + speaker + ")");

	let c1, c2, c3, value;

	switch(speakerColor) {
		case 'white':
			c1 = 255;
			c2 = 255;
			c3 = 255;
			value = 255;
			break;
		case 'red':
			c1 = 255;
			c2 = 0;
			c3 = 0;
			value = 255;
			break;
	}

	// depending on the name of the speaker, we can turn on different lights
	switch (speaker) {
		case 'Sycorax':
			lightStates['1'] = true;
			sendDataLight(1, 'on');
			setTimeout(function() { sendDataLight(2, 'on'); }, 20);
			break;
		case 'Protagonist':
			lightStates['5'] = true;
			sendDataColor(5, 255, 255, 255, 255);
			break;
		case 'Interlocuteur':
			lightStates['28'] = true;
			sendDataColor(28, 255, 255, 255, 255);
			break;
		case 'Isis':
			lightStates['4'] = true;
			sendDataLight(4, 'on');
			return;
		case 'Douglas':
			lightStates['4'] = true;
			sendDataLight(4, 'on');
			return;
		case 'Miranda':
		case 'Ariel':
		case 'Ferdinand':
		case 'Prospero':
		case 'Antonio':
		case 'Sébastien':
		case 'Alonso':
		case 'Caliban':
			if (engine.state.get('Role') == 'Protagonist') {
				lightStates['5'] = true;
				sendDataColor(5, 255, 255, 255, 255);
			} else if (engine.state.get('Role') == 'Interlocuteur') {
				lightStates['28'] = true;
				sendDataColor(28, 255, 255, 255, 255);
			}
			break;
	}
	//switch(speaker)
}
// dmxOn()


function dmxOff(speaker) {

	console.log("dmxOff(" + speaker + ")");

	// depending on the name of the speaker, we can turn on different lights
	switch (speaker) {
		case 'Sycorax':
			lightStates['1'] = false;
			sendDataLight(1, 'off');
			setTimeout(function() { sendDataLight(2, 'off'); }, 20);
			break;
		case 'Isis':
			lightStates['4'] = false;
			sendDataLight(4, 'off');
			return;
		case 'Douglas':
			lightStates['4'] = false;
			sendDataLight(4, 'off');
			return;
		case 'Protagonist':
			lightStates['5'] = false;
			sendDataColor(5, 0, 0, 0, 0);
			break;
		case 'Interlocuteur':
			lightStates['28'] = false;
			sendDataColor(28, 0, 0, 0, 0);
			break;
		case 'Miranda':
		case 'Ariel':
		case 'Ferdinand':
		case 'Prospero':
		case 'Antonio':
		case 'Sébastien':
		case 'Alonso':
		case 'Caliban':
			if (engine.state.get('Role') == 'Protagonist') {
				lightStates['5'] = false;
				sendDataColor(5, 0, 0, 0, 0);
			} else if (engine.state.get('Role') == 'Interlocuteur') {
				lightStates['28'] = false;
				sendDataColor(28, 0, 0, 0, 0);
			}
			break;
	}
	//switch(speaker)

}


function dmxOffAll() {
	sendDataAll(i, 'off');
}
// dmxOff()


function resetTypewriterTime() {

	currentCharIndex = 0;
	previousCharIndex = 0;

}


function calcualteCharacterDelay(index) {

	let delay = (index * delayTime) + (Math.random() * delayTime);
	return delay;

}



function addTypewriterEffect(article, ignoreTypewriter = false) {

	var newArticle = "";
	var currentTag = "";

	let animationDelay;

	// go through each child node of the article
	for (let i = 0; i < article.childNodes.length; i++) {

		const node = article.childNodes[i];

		if (node.nodeType === Node.TEXT_NODE) {
			// if the node is a text node, wrap each character in a span element
			const text = node.textContent;
			const spannedText = text.split('').map(function(char) {
				// create an ascii character index
				// const ascii = String.fromCharCode(97 + (++waveIndex % 26));
				// const waveClass = 'wave-' + ascii;
				const classesAttribute = "typewriter";
				// create a 10% of wobble in the delay, so it's not too uniform. 
				animationDelay = calcualteCharacterDelay(currentCharIndex++);
				// create a style tag that will be applied to the span tag to fade in
				let style = 'animation-delay: ' + animationDelay + 's;'
				let span = "";
				// create a span tag with the random color
				if (ignoreTypewriter) {
					span = char;
				} else if (char === ' ') {
					span = ' ';
				} else {
					span = '<span class="' + classesAttribute + '" style="' + style + '">' + char + '</span>';
				}
				return span;
			}).join('');
			
			newArticle += spannedText;

		} else {

			// get the tag name of the node
			currentTag = node.tagName.toLowerCase();

			if (currentTag !== 'voiceover') {

				const classesAttribute = "typewriter";

				// create a 10% of wobble in the delay, so it's not too uniform. 
				animationDelay = calcualteCharacterDelay(currentCharIndex);
				let animationStyle = 'animation-delay: ' + animationDelay + 's;'

				// add a class to the node
				node.classList.add(classesAttribute);
				// add a style to the node
				node.style = animationStyle;

				// get the full tag with attributes but not the inner html
				let tagWithAttributes = node.outerHTML.split('>')[0] + '>';

				newArticle += tagWithAttributes;
				// if the node is an element node, call the function recursively
				newArticle += addTypewriterEffect(node, currentTag === 'a');
				newArticle += "</" + currentTag + ">";

			}

		}
		// if(Node.TextNode)

	}
	// for(article.childNodes.length)

	return newArticle;

}





function resetHighlight() {
	selectedLinkIndex = -1;
}




function clickOnHighlight() {

	// start by getting the article element
	let articles = document.getElementsByTagName('article');
	// get a list of all the links inside the article
	let links = articles[0].getElementsByTagName('a');

	if (articles.length > 0) {
		// if we have a selected link
		if (selectedLinkIndex > -1 && selectedLinkIndex < links.length) {
			// click on the selected link
			links[selectedLinkIndex].click();
		}
	
	}

}




function highlightLink(key) {

	// start by getting the article element
	let articles = document.getElementsByTagName('article');
	// get a list of all the links inside the article
	let links = articles[0].getElementsByTagName('a');
	// make sure we have links
	if (articles.length == 0) {
		resetHighlight();
	}
	else {
		if (key == 'ArrowRight') {
			if (++selectedLinkIndex >= links.length) {
				selectedLinkIndex = -1;
			}
		} else if (key == 'ArrowLeft') {
			if (--selectedLinkIndex < -1) {
				selectedLinkIndex = links.length - 1;
			}
		}
		// loop through all the links
		for (let i = 0; i < links.length; i++) {
			// if the link is the selected link
			if (i == selectedLinkIndex) {
				// add the highlight class
				links[i].classList.add('highlight');
			} else {
				// remove the highlight class
				links[i].classList.remove('highlight');
			}
		}
	}

}




// receive card changes from twee iframe
window.addEventListener("message", (event) => {

	// make sure we can trust the sender of the message
	if (!event.isTrusted) {
		return;
	}
	// if the event is looking for the OPEN_AI_API_KEY
	if (event.data.hasOwnProperty('OPEN_AI_API_KEY')) {
		openAIKey = event.data.OPEN_AI_API_KEY;
	}

});




// post a message to the parent window looking for the OPEN_AI_API_KEY
window.parent.postMessage({OPEN_AI_API_KEY: 'true'}, '*');
