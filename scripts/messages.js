// receive card changes from twee iframe
window.addEventListener("message", (event) => {

	// make sure we can trust the sender of the message
	if (!event.isTrusted) {
		return;
	}
	// if the event is looking for the OPEN_AI_API_KEY
	if (event.data.hasOwnProperty('OPEN_AI_API_KEY')) {
		// send the key to the sender
		event.source.postMessage(
			{OPEN_AI_API_KEY: keys.OPEN_AI_API_KEY},
			event.origin,
		);
	}


	if (event.data.hasOwnProperty('sound')) {

		if (event.data.sound == 'true') {
			// this is a sound message
			if (event.data.type == 'play') {
				// play the sound
				soundPlay(event.data.name);
			}
			else if (event.data.type == 'reset') {
				// reset the sound
				soundReset();
			}
		}
	}


	// is this a reset-all-cards message ?
	if (event.data.hasOwnProperty('reset')) {
		// this is a reset message
		if (event.data.reset == 'true') {
			resetCards();
		}
	}


	if (event.data.hasOwnProperty('camera')) {
		// this is a reset message
		if (event.data.camera == 'true') {
			if (event.data.action == 'toggle') {
				// find the 'webcam-element' and toggle it
				let webcamElement = document.getElementById('webcam-element');
				// using the class 'visible' to toggle the webcam
				webcamElement.classList.toggle('visible');
				// if the classList contains 'visible'
				if (webcamElement.classList.contains('visible')) {
					isHiding = true;
				} else {
					isHiding = false;
				}
			}
		}
	}


	if (event.data.hasOwnProperty('choosing')) {
		// this is a reset message
		if (event.data.choosing == 'true') {
			// get the category and content
			let categorie = event.data.categorie;
			resetCard(categorie);
		}
	}


	if (event.data.hasOwnProperty('choseCard')) {
		// this is a reset message
		if (event.data.choseCard == 'true') {
			// get the category and content
			let categorie = event.data.categorie;
			let contenu = event.data.contenu;
			choseCard(categorie, contenu);
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
			// check to see if the category already exists
			let foundCategory = false;
			for(let i = 0; i < cards.length; i++) {
				if (cards[i].categorie == categorie) {
					foundCategory = true;
					break;
				}
			}
			// see if the cardsToAdd array already has this category
			for(let i = 0; i < cardsToAdd.length; i++) {
				if (cardsToAdd[i].categorie == categorie) {
					foundCategory = true;
					break;
				}
			}
			if (!foundCategory) {
				// add the new card
				cardsToAdd.push({categorie: categorie, hue: hue});
			}
		}
	}

});
