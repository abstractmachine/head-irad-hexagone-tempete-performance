let cnv;
let font;
let cards = [];

function preload() {
	font = loadFont('fonts/EBGaramond-Medium.ttf');
}

function setup() {

	cnv = createCanvas(windowWidth, windowHeight*0.33, WEBGL);
	
	textFont(font);
	textSize(height*0.075);
	textAlign(CENTER, CENTER);

	cards.push(new Card(0, "intrigue", "jalousie"));
	cards.push(new Card(1, "protagoniste", "Miranda"));
	cards.push(new Card(2, "amant", "Caliban"));
	cards.push(new Card(3, "lieu", "plage"));
	cards.push(new Card(4, "scene", "amour"));

}

function windowResized() {

	resizeCanvas(windowWidth, windowHeight*0.4);

	for(let i = 0; i < cards.length; i++) {
		cards[i].resize(i);
	}

}

function draw() {

	background(0);

	for (let i = 0; i < cards.length; i++) {
		cards[i].display();
	}

}

class Card {
	constructor(index, front, back) {

		this.index = index;
		this.color = 127;

		this.resize();

		this.front = front;
		this.back = back;

	}

	resize() {
		let step = width / 5;
		this.x = (this.index*step)+(step*0.5);
		this.y = height * 0.5;
		this.height = height * 0.9;
		this.width = this.height * .61803398875;
	}

	display() {
		let cornerRadius = height*0.05;
		push();
		translate(-width/2,-height/2,0);
		translate(this.x,this.y);
		let angle = (frameCount*0.5)%360;
		let degrees = radians(angle);
		rotateY(degrees);
		rectMode(CENTER);
		if (angle > 90 && angle < 270) {
			stroke(127);
			fill(255);
			push();
			rotateY(radians(180));
			// rotate(0,radians(180),0);
			translate(0,0,1);
			text(this.front, 0, 0);
			pop();
			fill(127);
			noStroke();
		} else {
			fill(127);
			noStroke();
			push();
			translate(0,0,0);
			text(this.back, 0, 0);
			pop();
			noFill();
			stroke(127);
			strokeWeight(2);
		}
		rect(0, 0, this.width, this.height, cornerRadius);
		pop();
	}
}