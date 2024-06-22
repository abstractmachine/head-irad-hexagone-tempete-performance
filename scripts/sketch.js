let cnv;
let font;
let cards = [];
let cardsToAdd = [];
let isHiding = false;


function preload() {
	font = loadFont('assets/fonts/HankenGrotesk-VariableFont_wght.ttf');
}


function setup() {

	cnv = createCanvas(windowWidth, windowHeight*0.34, WEBGL);
	
	textFont(font);
	textSize(height*0.06);
	textAlign(CENTER, CENTER);
	rectMode(CENTER);

	addRemainingCards();

}


function windowResized() {
	resizeCanvas(windowWidth, windowHeight*0.34);
	cardsResized();
}


function draw() {

	// if we have new cards to add
	if (cardsToAdd.length > 0) {
		addRemainingCards();
	}

	// set the color mode to HSB
	colorMode(HSB, 360, 100, 100);

	// black background
	clear();

	// first check to see if any cards need to be updated
	for(let i = 0; i < cards.length; i++) {
		cards[i].update();
	}

	if (!isHiding) {
		// draw all the cards
		for(let i = 0; i < cards.length; i++) {
			cards[i].draw();
		}
	}

}
