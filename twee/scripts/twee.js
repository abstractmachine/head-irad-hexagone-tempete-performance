config.body.transition.name = 'none';

let currentSpeaker = "";
let delayTime = 0.02;
let currentCharIndex = 0;
let previousCharIndex = 0;
let selectedLinkIndex = -1;

let cartes = {};

// Ensure the engine is initialized and ready
window.onload = function() {

	// cancel any speech that is currently happening
	cancelSpeech();

	loadCardData();

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
			return true;
		});

		restoreVisibility();

	});

};



function parseKey(key) {

	// switch to handle the key presses
	switch (key) {
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
			let choisir = engine.state.get('Choisir')
			if (choisir) {
				setCard(key.toUpperCase());
			}

		case 'ArrowRight':
		case 'ArrowLeft':
		case 'ArrowUp':
		case 'ArrowDown':
		case 'Shift':
			highlightLink(key);
			break;
		case 'Enter':
			break;
		case 'Escape':
			resetCards();
			restart();
			break;
		default:
			break;
	}

}



async function loadCardData() {

	// load the file named 'head-hexagone-performance-tempete-cartes.csv'
	// this file contains the data for the cards
	// the data is in the format: Titre,Badge / numéro,Image,Texte,Couleur,Catégorie
	// the data is loaded into the cards object

	const csv = await fetch('data/head-hexagone-performance-tempete-cartes.csv');
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
			// tell the p5.js sketch to create a new card for this category
			createNewPile(categorie, couleur);
		}
		// setCard(category, content);
		cartes[categorie].push({'id': id, 'titre': titre, 'contenu': contenu, 'couleur': couleur, 'note': note});
	}

}


function createNewPile(categorie, couleur) {

	// get access to the parent window
	let parent = window.parent;
	// send message to the parent window
	parent.postMessage({newCard: 'true', categorie:categorie, couleur:couleur}, '*');

}


function resetCards() {

	// get access to the parent window
	let parent = window.parent;
	// send message to the parent window
	parent.postMessage({reset: 'true'}, '*');
	// 
	engine.state.set('Choisir', 'hello');

}


function setCard(key) {

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
			// get the name of the next passage
			let nextPassage = engine.state.get('Done');
			// go to the next passage
			go(nextPassage);
			break;
		}
	}

}



// Function to handle passage changes
function passageChanged() {

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
			}
		}, 10); // Delay of 0 milliseconds
	}
	
}


// TODO: This is a CSS<>JS hack to restore the visibility of the paragraphs
// Need to find a better way to do this
function restoreVisibility() {

	// loop through all the <p> elements
	document.querySelectorAll('p, h1, h2, h3, h4, h5, h6, ul, li, speak').forEach(function(paragraph) {
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
	let paragraphs = doc.querySelectorAll('p, li, speak, h1, h2, h3, h4, h5, h6');

	// loop through all results
	for(let i=0; i<paragraphs.length; i++) {

		let paragraph = paragraphs[i];
		// get the tag type of the paragraph
		let tag = paragraph.tagName.toLowerCase();
		if (tag == 'speak') {
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
		}
	}

}


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

	// go through each child node of the article
	for (let i = 0; i < article.childNodes.length; i++) {

		const node = article.childNodes[i];

		// let waveIndex = 0;

		if (node.nodeType === Node.TEXT_NODE) {
			// if the node is a text node, wrap each character in a span element
			const text = node.textContent;
			const spannedText = text.split('').map(function(char) {
				// create an ascii character index
				// const ascii = String.fromCharCode(97 + (++waveIndex % 26));
				// const waveClass = 'wave-' + ascii;
				const classesAttribute = "typewriter";
				// create a 10% of wobble in the delay, so it's not too uniform. 
				let animationDelay = calcualteCharacterDelay(currentCharIndex++);
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
			// node.innerHTML = spannedText;
			newArticle += spannedText;

		} else {

			// get the tag name of the node
			currentTag = node.tagName.toLowerCase();
			// get the full tag with attributes but not the inner html
			let tagWithAttributes = node.outerHTML.split('>')[0] + '>';

			newArticle += tagWithAttributes;
			// if the node is an element node, call the function recursively
			newArticle += addTypewriterEffect(node, currentTag === 'a');
			newArticle += "</" + currentTag + ">";

		}
		// if(Node.TextNode)

	}
	// for(article.childNodes.length)

	return newArticle;

}





function resetHighlight() {
	selectedLinkIndex = -1;
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
			selectedLinkIndex = ++selectedLinkIndex % links.length;
		} else if (key == 'ArrowLeft') {
			selectedLinkIndex = --selectedLinkIndex % links.length;
		}
	}


}