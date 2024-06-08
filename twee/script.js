config.body.transition.name = 'none';

let currentDelay = 0.0;
let currentSpeaker = "";


// Ensure the engine is initialized and ready
window.onload = function() {

	// cancel any speech that is currently happening
	cancelSpeech();

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



function parseKey(key) {

	// switch to handle the key presses
	switch (key) {
		case 'ArrowRight':
			break;
		case 'ArrowLeft':
			break;
		case 'ArrowUp':
			break;
		case 'ArrowDown':
			break;
		case 'Enter':
			break;
		case 'Escape':
			restart();
			break;
		default:
			break;
	}

}



// Function to handle passage changes
function passageChanged() {

	// cancel any previous speaking utterances
	cancelSpeech();
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
	let paragraphs = doc.querySelectorAll('speak, h2');

	// Loop over the paragraphs and log their text content
	paragraphs.forEach(function(paragraph) {
		// get the tag type of the paragraph
		let tag = paragraph.tagName.toLowerCase();
		if (tag == 'h2') {
			setSpeaker(paragraph.textContent);
		} else {
			parseParagraph(paragraph);
		}
	});

}


function setSpeaker(name) {

	currentSpeaker = name;

}


function parseParagraph(paragraph) {

	// get the child nodes of the paragraph
	let childNodes = paragraph.childNodes;
	// go through each child node of the paragraph
	for (let i = 0; i < childNodes.length; i++) {
		const node = childNodes[i];
		// if the node is a text node, wrap each character in a span element
		if (node.nodeType === Node.TEXT_NODE) {
			// get list of the parent node classes
			let classes = node.parentNode.classList;
			console.log(classes);

			speak(currentSpeaker, node.textContent);
		}
	}

}


function resetTypewriterTime() {

	currentDelay = 0;

}



function addTypewriterEffect(article, ignoreTypewriter = false) {

	var newArticle = "";
	var currentTag = "";

	// go through each child node of the article
	for (let i = 0; i < article.childNodes.length; i++) {

		const node = article.childNodes[i];

		if (node.nodeType === Node.TEXT_NODE) {
			// if the node is a text node, wrap each character in a span element
			const text = node.textContent;
			let delayTime = 0.02;
			const spannedText = text.split('').map(function(char) {
				// create a 10% of wobble in the delay, so it's not too uniform. 
				currentDelay += delayTime + (Math.random() * delayTime);
				// create a style tag that will be applied to the span tag to fade in
				// const style = "animation: fadeIn 1s linear forwards; animation-delay: " + delay + "s";
				let style = 'opacity: 0; animation-delay: ' + currentDelay + 's;'
				let span = "";
				// create a span tag with the random color
				if (ignoreTypewriter) {
					span = char;
				} else if (char === ' ') {
					span = ' ';
				} else {
					span = '<span class="typewriter" style="' + style + '">' + char + '</span>';
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


