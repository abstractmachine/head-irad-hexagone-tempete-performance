config.body.transition.name = 'none';

// Ensure the engine is initialized and ready
window.onload = function() {

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
			// Check if the key pressed is Escape
			if (e.key === "Escape") {
				// Go to the Start passage
				go('Start');
			}
		});

		// Initial passage change logging
		passageChanged();
	});

};




// Function to handle passage changes
function passageChanged() {

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
				// add the typewriter effect to the first article
				var newHtml = addTypewriterEffect(firstArticle);
				// apply new html to the first article
				firstArticle.innerHTML = newHtml;
				// we need to restore the visibility of the paragraphs that currently have opacity 0
				// this is because we want to avoid the render flash before the start of the typewriter effect
				// we need to do this after the typewriter effect has been applied
				restoreVisibility();
			}
		}, 0); // Delay of 0 milliseconds
	}
	
}


function restoreVisibility() {

	// loop through all the <p> elements
	document.querySelectorAll('p').forEach(function(paragraph) {
		// set the display style to block
		paragraph.style.opacity = '1';
	});

}


function speakArticle(article) {


	// Create a new DOMParser
	let parser = new DOMParser();

	// Parse the article string into a Document
	let doc = parser.parseFromString(article, 'text/html');

	// Get all the <p> elements in the Document
	let paragraphs = doc.querySelectorAll('p, h1, h2, h3, h4, h5, h6, li');

	// Loop over the paragraphs and log their text content
	paragraphs.forEach(function(paragraph) {

		parseParagraph(paragraph);

	});
	// // get the child nodes of the paragraph
	// let childNodes = article.childNodes;
	// // go through each child node of the paragraph
	// for (let i = 0; i < childNodes.length; i++) {
	// 	const node = childNodes[i];
	// 	// if the node is a text node, wrap each character in a span element
	// 	if (node.nodeType === Node.TEXT_NODE) {
	// 		// speak("Douglas", node.textContent);
	// 		console.log(node.textContent);
	// 	}
	// }

	// 	// speak("Douglas", paragraph.textContent);
	// 	// console.log(paragraph.textContent);
	// });

}


function parseParagraph(paragraph) {

	// get the child nodes of the paragraph
	let childNodes = paragraph.childNodes;
	// go through each child node of the paragraph
	for (let i = 0; i < childNodes.length; i++) {
		const node = childNodes[i];
		// if the node is a text node, wrap each character in a span element
		if (node.nodeType === Node.TEXT_NODE) {
			speak("Douglas", node.textContent);
		}
	}

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
			let currentDelay = 0.0;
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
				// console.log(span);
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


