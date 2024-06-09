

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


	if (event.data.hasOwnProperty('setCard')) {
		// this is a reset message
		if (event.data.setCard == 'true') {
			// get the category and content
			let categorie = event.data.categorie;
			let contenu = event.data.contenu;
			setCard(categorie, contenu);
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
	

	// // check to see if there is a category key & a content key in the data object
	// if (event.data.hasOwnProperty('categorie') && event.data.hasOwnProperty('content')) {

	// 	let categorie = event.data.categorie;
	// 	let content = event.data.content;

	// 	setCard(categorie, content);
	// }

	// Assuming you've verified the origin of the received message (which
	// you must do in any case), a convenient idiom for replying to a
	// message is to call postMessage on event.source and provide
	// event.origin as the targetOrigin.
	// event.source.postMessage(
	//   "hi there yourself!  the secret response " + "is: 42",
	//   event.origin,
	// );

});
