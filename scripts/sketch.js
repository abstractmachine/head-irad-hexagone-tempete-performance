let cnv;
let font;
let cards = [];

function preload() {
	font = loadFont('fonts/HankenGrotesk-VariableFont_wght.ttf');
}

function setup() {

	cnv = createCanvas(windowWidth, windowHeight*0.33, WEBGL);
	
	textFont(font);
	textSize(height*0.06);
	textAlign(CENTER, CENTER);
	rectMode(CENTER);

	let hueOffset = 30;
	let hue = 0;

	hue = (((360 * 0) / 5) + hueOffset) % 360;
	cards.push(new Card(0, hue, "Protagoniste", "Content"));
	hue = (((360 * 1) / 5) + hueOffset) % 360;
	cards.push(new Card(1, hue, "Amant", "Content"));
	hue = (((360 * 2) / 5) + hueOffset) % 360;
	cards.push(new Card(2, hue, "Intrigue", "Content"));
	hue = (((360 * 3) / 5) + hueOffset) % 360;
	cards.push(new Card(3, hue, "Lieu", "Content"));
	hue = (((360 * 4) / 5) + hueOffset) % 360;
	cards.push(new Card(4, hue, "Scene", "Content"));

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


