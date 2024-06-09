
function resetCards() {

	// go through all the cards
	for(let i = 0; i < cards.length; i++) {
		cards[i].reset();
	}

}

function setCard(category, content) {

	let foundCategory = false;

	// go through all the cards
	for(let i = 0; i < cards.length; i++) {
		// if the category matches
		if (cards[i].category == category) {
			// set the content
			cards[i].setNext(content);
			// note that we found the category
			foundCategory = true;
			// done
			break;
		}
	}

	if (!foundCategory) {
		console.log("Category not found: ", category, content);
	}

}


class Card {

	constructor(index, hue, category) {

		this.index = index;
		this.hue = hue;
		this.saturation = 100;
		this.category = category;
		this.content = "";
		this.resize();
		this.isRevealed = false;
		this.angle = 0;
		this.next = "";

	} // constructo()


	resize() {

		let step = width / 5;
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
		fill(this.hue,this.saturation,100,100);
		noStroke();
		rect(0, 0, this.width, this.height, this.corner);
		pop();

		push();
		translate(0,0,1);
		// white
		fill(this.hue,0,100,100);
		noStroke();
		text(this.category, 0, 0, this.width, this.height);
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
		// white
		fill(this.hue,0,100,100);
		noStroke();
		text(this.content, 0, 0, this.width, this.height);
		pop();

		pop();

	} // draw()


}
