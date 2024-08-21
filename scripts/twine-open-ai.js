// OpenAI Stuff
let api_key = '';
const url = 'https://api.openai.com/v1/chat/completions';
const model = 'gpt-4o';
// const model = 'gpt-3.5-turbo';


// openai variables
let last = '';
let prompt = '';
let system = '';
let tag = '';
let goPassage = '';
let response = '';

// local variables
let delay = 10;


// Extend Chapbook with the OpenAI API
engine.extend('1.2.3', function() {

	// Listen for the state change event
	engine.event.on('state-change', passageChanged);
	
});


// Function to handle passage changes
function passageChanged() {
	
	const current = engine.story.passageNamed(passage.name);
	
	// Delay the execution of the code inside the setTimeout
	setTimeout(function() {
	
		// make sure this is a new passage
		if (last != current) {

				const newKey = engine.state.get('api_key');
				if (newKey !== undefined) {
					api_key = newKey;
					// clear
					engine.state.set('api_key', undefined);
				}

				// get prompt if provided
				const newPrompt = engine.state.get('prompt');
				if (newPrompt !== undefined && newPrompt !== '') {
						// go generate new text with the prompt
						generateText(newPrompt);
				}

		}

		// remember for next passage change
		last = current;
			
	}, delay); // end setTimeout
	
}


// function to generate the text
function generateText(newPrompt) {
	
	// get the prompt
	prompt = newPrompt;

	// make sure there was a prompt
	if (api_key === undefined || api_key === '') {
		console.error('API key from OpenAI required to generate text');
		return;
	}

	// make sure there was a prompt
	if (prompt === undefined) {
		console.error('Prompt required to generate text');
		return;
	}
	// we need to clear the prompt flag now that we've gotten it
	engine.state.set('prompt', undefined);

	system = engine.state.get('system');
	if (system === undefined) {
		system = '';
	}
	engine.state.set('system', undefined);

	// get the tag for this response (optional, otherwise 'response')
	tag = engine.state.get('tag');
	if (tag === undefined) {
		tag = '';
	}
	engine.state.set('tag', undefined);

	// get the passage to go to when we receive this response (optional)
	goPassage = engine.state.get('goto');
	if (goPassage === undefined) {
		goPassage = '';
	}
	engine.state.set('goto', undefined);



	// ok so at least we had a prompt

	// clear the prompt result variable
	response = '';

	fetchResult();
	
}


// go get the results from OpenAI
async function fetchResult() {
	
	const url = 'https://api.openai.com/v1/chat/completions';

	const messages = [
		{ 
			role: "system", content: system
		},
		{
			role: "user",
			content: prompt
		},
	]
	
	const data = {
		model: model,
		messages: messages,
		temperature: 0.7
	};
	
	fetch(url, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			'Authorization': `Bearer ${api_key}`
		},
		body: JSON.stringify(data)
	})
	.then(response => response.json())
	.then(data => 
	{
		// console.log(data);
		let response = data.choices[0].message.content;
		parseResponse(response);
		// if there are any goto instructions, do them
		if (goPassage !== '') {
			go(goPassage);
		} else { // otherwise unhide any waits
			unhide();
		}
	})
	.catch((error) => {
		console.error('Error:', error);
	});
	
}


function parseResponse(response) {
	
  	// ok, this is the actual textual response
	if (tag != '') {
      engine.state.set(tag, response);
    } else {
      engine.state.set('response', response);
    }
	
}



function unhide() {

	let waits = document.getElementsByTagName('wait');
	for(let i=0; i<waits.length; i++) {
		let e = waits[i];
		let d = document.createElement('ready');
		d.innerHTML = e.innerHTML;
		e.parentNode.replaceChild(d, e);
	}

}