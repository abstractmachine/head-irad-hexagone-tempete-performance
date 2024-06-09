
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


	constructor(index, hue, category, content) {

		this.index = index;
		this.hue = hue;
		this.saturation = 50;
		this.category = category;
		this.content = content;
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


	update() {

		if (this.next != "" && this.angle != 0) {
			this.isRevealed = false;
		} else if (this.next != "" && this.angle == 0) {
			this.isRevealed = false;
			this.content = this.next;
			this.next = "";
		}
		
		if (this.isRevealed) {
			this.revealed();
		} else {
			this.flipped();
		}

	} // update()


	setNext(next) {
		this.next = next;
	} // setNext();


	flipped() {

		
		if (abs(this.angle - 0) < 5) {
			this.angle = 0;
		}

	} // flipped()


	revealed() {

		let interpolation = 0.1;
		this.angle += ((180 - this.angle) * interpolation);
		
		if (abs(this.angle - 180) < 5) {
			this.angle = 180;
		}

	} // revealed()


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
		fill(this.hue,this.saturation,0,100);
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
		fill(this.hue,this.saturation,100,100);
		noStroke();
		text(this.content, 0, 0, this.width, this.height);
		pop();

		pop();

	} // draw()


}
