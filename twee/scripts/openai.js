// the URL for the OpenAI API
const url = "https://api.openai.com/v1/chat/completions";
// which model we are using
// const model = "gpt-3.5-turbo";
const model = "gpt-4o";

let generatedData = [];

async function generateText() {

	// we need to turn off the generate flag
	engine.state.set('Action', '');

	// get the generation Id
	let id = engine.state.get('Id');

	// we have to have an Id
	if (id == undefined) {

		console.error('No Id');

	} else {

		// create the prompt
		let messages = createMessages();
	
		// go get the generated phrase from the API
		if (messages != null) {
			hideLinks();
			fetchPhrase(messages, id);
		}

	}

	// we should also turn off all the other variables
	engine.state.set('Intrigue-Note', '');
	engine.state.set('Acte-Note', '');
	engine.state.set('Lieu-Note', '');
	engine.state.set('Interlocuteur-Note', '');
	engine.state.set('Prompt-Note', '');

}

function createMessages() {

	// get whoever is talking
	let persona = engine.state.get('Persona');

	// we have to have someone talking
	if (persona == undefined || persona == '') {
		console.error('No Persona');
		return null;
	}

	// do we need to get the note for the Persona
	let personaNote = getNote('Persona-Note');

	// start with the system prompt created around the Persona
	let system = getSystemPrompt(persona, personaNote);

	// add eventual additional information

	// start with acte
	let acteNote = getNote('Acte-Note');
	if (acteNote != '') {
		let acteName = engine.state.get('Acte-Note');
		system += '\n\n' + 'Nous sommes dans une acte nommé ' + acteName + ': ' + acteNote;
	}

	// if we are in a specific scene
	let lieuNote = getNote('Lieu-Note');
	if (lieuNote != '') {
		let lieuName = engine.state.get('Lieu-Note');
		system += '\n\n' + 'Le lieu de cet acte est ' + lieuName + ': ' + lieuNote;
	}

	// get the intrigue
	let intrigueNote = getNote('Intrigue-Note');
	if (intrigueNote != '') {
		let intrigueName = engine.state.get('Intrigue-Note');
		system += '\n\n' + "L'intrigue actuelle est celle de " + intrigueName + ": " + intrigueNote;
	}

	let user = "";

	// if we are talking to someone
	let interlocuteur = engine.state.get('Interlocuteur');
	if (interlocuteur == undefined) {
		interlocuteur = '';
	}

	let interlocuteurNote = getNote('Interlocuteur-Note');

	if (interlocuteur != '' && interlocuteurNote != '') {
		system += '\n\n' + 'Vous parlez à ' + interlocuteur + '.' + interlocuteurNote;
	} else if (interlocuteur != '') {
		system += '\n\n' + 'Vous parlez à ' + interlocuteur + '.';
	}

	let prompt = engine.state.get('Prompt');
	if (prompt != undefined && prompt != '') {
		user += getUserPrompt(interlocuteur, prompt, persona);
	}

	// create the messages object
	let messages = [
		{
			role: 'system',
			content: system
		},
		{
			role: 'user',
			content: user
		}
	];

	return messages;
}

async function fetchPhrase(messages, id) {

	const url = 'https://api.openai.com/v1/chat/completions';
	const data = {
		model: model,
		messages: messages,
		temperature: 0.7
	};

	// console.log('Sending request with Id: ' + id);

	fetch(url, {
		method: 'POST',
		headers: {
		'Content-Type': 'application/json',
		'Authorization': `Bearer ${openAIKey}`
		},
		body: JSON.stringify(data)
	})
	.then(response => response.json())
	.then(data => 
	{
		let response = data.choices[0].message.content;
		parseResponse(response, id);
	})
	.catch((error) => {
		console.error('Error:', error);
		unhideLinks();
	});

}

function parseResponse(response, id) {

	unhideLinks();

	// there is a prononciation issue with the character 'ô' in the French language
	// response = fixText(response);

	// we want a big block of text
	response = removeLineBreaks(response);

	// remove the first word if it is all captial letters
	response = removeCapitalizedFirstWord(response);

	// push into the generated data array
	generatedData.push( { id: id, response: response } );

}


function removeCapitalizedFirstWord(text) {

	// get the first word
	let firstWord = text.split(' ')[0];
	// check if it is all capital letters
	if (firstWord == firstWord.toUpperCase()) {
		// remove the first word, including space
		text = text.slice(firstWord.length + 1);
	}

	return text;

}


function removeLineBreaks(text) {
	
	// remove line breaks
	text = text.replace(/\n/g, ' ');

	return text;

}


function fixText(text) {

	// replace the character 'ô' with 'oh'
	text = text.replace(/ô/g, 'oh');
	// replace the character Ô with 'Oh'
	text = text.replace(/Ô/g, 'Oh');

	return text;

}


function hideLinks() {
	
	// get the <article> element
	let article = document.querySelector('article');
	// get all the <a> elements in the article
	let links = article.querySelectorAll('a');
	// loop through the links
	links.forEach(link => {
		// add a 'hidden' class to the link
		link.classList.add('hidden');
	});

}


function unhideLinks() {
	
	// get the <article> element
	let article = document.querySelector('article');
	// get all the <a> elements in the article
	let links = article.querySelectorAll('a');
	// loop through the links
	links.forEach(link => {
		// remove the hidden class from the link
		link.classList.remove('hidden');
	});

}


function getSystemPrefix() {

	let prefix = "Nous allons re-écrire ensemble une version contemporaine transformée de la Tempête de Shakespeare, en utilisant le langage de l'époque. Vous parlez toujours en français, jamais Anglais. Vous allez toujours parler comme si vous êtes un personnage de la Tempête de Shakespeare. Je vais vous donnez votre nom et vous allez parler comme si vous êtes ce personnage.";

	return prefix;

}


function getSystemPrompt(persona, note = '') {

	let system = getSystemPrefix();

	//system += "Vous allez répondre à mes questions, puis parfois vous allez glisser une phrase venant de La tempête de Shakespeare (traduite en français par M. Guizot) mais comme si ce sont vos propres paroles. Cette citation sera ajoutée uniquement si elle est en adéquation avec le sujet actuel. Ne mettez surtout pas de guillemets autour de la citation.";

	system += '\n\n' + 'Vous êtes le personnage nommé ' + persona + '.';

	if (note != '') {
		system += ' ' + 'Voici une description de votre personnage:\n\n"' + note + '"';
	}

	return system;

}


function getUserPrompt(speaker, content, persona) {

	let user = '';
	// if there is a speaker, add it to the prompt
	if (speaker != '') {
		user += speaker.toUpperCase() + '\n';
	}
	// if there is content (the user's input), add it to the prompt
	if (content != '') {
		user += content + '\n\n';
	}
	// this is the speech of the character that will be generated
	if (persona != '') {
		user += persona.toUpperCase() + '\n';
	}

	return user;

}

function getNote(categorie) {

	if (categorie == undefined || categorie == '') {
		return '';
	}

	let titre = engine.state.get(categorie);

	if (titre == undefined || titre == '') {
		return '';
	}

	let cartesTrouvees;

	if (categorie == 'Interlocuteur') {
		cartesTrouvees = cartes['Persona'];
	} else {
		cartesTrouvees = cartes[categorie];
	}

	if (cartesTrouvees == undefined || cartesTrouvees == '' || cartesTrouvees == null) {
		return '';
	}

	for (let i = 0; i < cartesTrouvees.length; i++) {
		if (cartesTrouvees[i].titre == titre) {
			return cartesTrouvees[i].note;
		}
	}

}