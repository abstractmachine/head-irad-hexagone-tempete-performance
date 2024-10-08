
function resetCards() {

	cards = [];

}

function cardsResized() {

	for(let i = 0; i < cards.length; i++) {
		cards[i].resize();
	}

}



function addRemainingCards() {

	for(let i = 0; i < cardsToAdd.length; i++) {
		let categorie = cardsToAdd[i].categorie;
		let hue = cardsToAdd[i].hue;
		let card = new Card(cards.length, hue, categorie);
		cards.push(card);
	}

	cardsToAdd = [];

	cardsResized();

}


function choseCard(categorie, content) {

	let foundCategorie = false;

	// go through all the cards
	for(let i = 0; i < cards.length; i++) {
		// if the category matches
		if (cards[i].categorie == categorie) {
			// set the content
			cards[i].setNext(content);
			// note that we found the category
			foundCategorie = true;
			// done
			break;
		}
	}

	if (!foundCategorie) {
		// console.log("categorie not found: ", categorie, content);
	}

}


function resetCard(categorie) {

	let foundCategorie = false;

	// go through all the cards
	for(let i = 0; i < cards.length; i++) {
		// if the category matches
		if (cards[i].categorie == categorie) {
			// set the content
			cards[i].reset();
			// note that we found the category
			foundCategorie = true;
			// done
			break;
		}
	}

	if (!foundCategorie) {
		// console.log("categorie not found: ", categorie);
	}

}


class Card {

	constructor(index, hue, categorie) {

		if (hue == 60) {
			this.front = color(0,0,100,100);
			this.back = color(0,0,0,100);
		} else if (hue == 180) {
			this.front = color(0,0,100,100);
			this.back = color(0,0,0,100);
		} else {
			this.front = color(0,0,100,100);
			this.back = color(0,0,100,100);
		}

		this.index = index;
		this.hue = hue;
		this.saturation = 100;
		this.brightness = 100;
		this.categorie = categorie;
		this.content = "";
		this.resize();
		this.isRevealed = false;
		this.angle = 0;
		this.next = "";

	} // constructor()


	resize() {

		let step = width / 6;
		this.x = -(width*0.5) + (step * this.index) + (step*0.5);
		this.y = 0;
		this.height = height * 0.9;
		this.width = height * 0.6;
		this.corner = height * 0.05;

	} // resize()


	reset() {
		// reset the content
		this.content = "";
		this.next = "";
		// flip the card back
		this.isRevealed = false;
	}


	update() {

		// if we need to switch to a new value
		if (this.next != "") {
			// if we're still flipping
			if (this.angle != 0) {
				this.isRevealed = false;
			} else if (this.angle == 0) {
				// switch value to the next value
				this.content = this.next;
				this.next = "";
				// reveal the card
				this.isRevealed = true;
			}
		}
		
		if (this.isRevealed) {
			this.revealed();
		} else {
			this.flipped();
		}

	} // update()


	setNext(next) {
		
		// if we already have this value, don't bother
		if (this.content == next) {
			return;
		}

		this.next = next;

	} // setNext();


	flipped() {

		// if we need to animate the flip
		if (this.angle != 0) {
			this.interpolate(0);
		}

	} // flipped()


	revealed() {

		// if we need to animate the flip
		if (this.angle != 180) {
			this.interpolate(180);
		}

	} // revealed()


	interpolate(targetAngle) {

		// interpolate to target value
		let interpolation = 0.1;
		this.angle += ((targetAngle - this.angle) * interpolation);

		// snap to target value
		if (abs(this.angle - targetAngle) < 5) {
			this.angle = targetAngle;
		}

	}


	draw() {

		push();

		translate(this.x, this.y, 0);
		rotateY(radians(this.angle));

		push();
		translate(0,0,0.5);
		fill(this.hue,this.saturation,this.brightness,100);
		noStroke();
		rect(0, 0, this.width, this.height, this.corner);
		pop();

		let cardTitle = this.categorie;

		if (cardTitle == "Protagoniste" || cardTitle == "Amant") {
			cardTitle = "Personnage";
		}

		push();
		translate(0,0,1);
		// white
		fill(this.back);
		noStroke();
		text(cardTitle, 0, 0, this.width, this.height);
		pop();

		push();
		translate(0,0,0);
		fill(this.hue,this.saturation,33,100);
		noStroke();
		rect(0, 0, this.width*0.97, this.height*0.97, this.corner);
		pop();

		push();
		translate(0,0,-2);
		rotateY(PI);
		// foreground
		fill(this.front);
		noStroke();
		text(this.content, 0, 0, this.width, this.height);
		pop();

		pop();

	} // draw()


}
