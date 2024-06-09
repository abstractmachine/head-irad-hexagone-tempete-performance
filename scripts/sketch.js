let cnv;
let font;
let cards = [];
let cardsToAdd = [];

function preload() {
	font = loadFont('fonts/HankenGrotesk-VariableFont_wght.ttf');
}

function setup() {

	cnv = createCanvas(windowWidth, windowHeight*0.33, WEBGL);
	
	textFont(font);
	textSize(height*0.06);
	textAlign(CENTER, CENTER);
	rectMode(CENTER);

	addRemainingCards();

}

function windowResized() {

	resizeCanvas(windowWidth, windowHeight*0.33);

	for(let i = 0; i < cards.length; i++) {
		cards[i].resize();
	}

}

function draw() {

	colorMode(HSB, 360, 100, 100);

	background(0,0,0);

	// first check to see if any cards need to be updated
	for(let i = 0; i < cards.length; i++) {
		cards[i].update();
	}

	// draw all the cards
	for(let i = 0; i < cards.length; i++) {
		cards[i].draw();
	}

}


function addRemainingCards() {

	for(let i = 0; i < cardsToAdd.length; i++) {
		let category = cardsToAdd[i].categorie;
		let hue = cardsToAdd[i].hue;
		let card = new Card(cards.length, hue, category);
		cards.push(card);
	}

	cardsToAdd = [];

}


// receive card changes from twee iframe
window.addEventListener("message", (event) => {

	// make sure we can trust the sender of the message
	if (!event.isTrusted) {
		return;
	}


	// is this a reset-all-cards message ?
	if (event.data.hasOwnProperty('reset')) {
		// this is a reset message
		if (event.data.reset == 'true') {
			resetCards();
		}
	}


	// are we adding a new card category?
	if (event.data.hasOwnProperty('newCard')) {
		// this is a reset message
		if (event.data.newCard == 'true') {
			// get the category and color
			let categorie = event.data.categorie;
			let couleur = event.data.couleur;
			// convert the #RRGGBB color to HSB
			let hsb = hexToHSB(couleur);
			let hue = hsb.h;
			// add the new card
			cardsToAdd.push({categorie: categorie, hue: hue});
		}
	}
	

	// check to see if there is a category key & a content key in the data object
	if (event.data.hasOwnProperty('category') && event.data.hasOwnProperty('content')) {

		let category = event.data.category;
		let content = event.data.content;

		setCard(category, content);
	}

	// Assuming you've verified the origin of the received message (which
	// you must do in any case), a convenient idiom for replying to a
	// message is to call postMessage on event.source and provide
	// event.origin as the targetOrigin.
	// event.source.postMessage(
	//   "hi there yourself!  the secret response " + "is: 42",
	//   event.origin,
	// );

});


function hexToHSB(hex) {
	let r = parseInt(hex.slice(1, 3), 16);
	let g = parseInt(hex.slice(3, 5), 16);
	let b = parseInt(hex.slice(5, 7), 16);
	let hsb = rgbToHsb(r, g, b);
	return hsb;
}


function rgbToHsb(r, g, b) {
	r /= 255;
	g /= 255;
	b /= 255;

	let max = Math.max(r, g, b), min = Math.min(r, g, b);
	let h, s, v = max;

	let d = max - min;
	s = max == 0 ? 0 : d / max;

	if (max == min) {
		h = 0; // achromatic
	} else {
		switch (max) {
			case r:
				h = (g - b) / d + (g < b ? 6 : 0);
				break;
			case g:
				h = (b - r) / d + 2;
				break;
			case b:
				h = (r - g) / d + 4;
				break;
		}
		h /= 6;
	}

	return { h: h * 360, s: s * 100, v: v * 100 };
}


