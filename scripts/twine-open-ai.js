// copy this text to your Twine Story JavaScript field

// OpenAI Stuff
let key = "";
const url = "https://api.openai.com/v1/chat/completions";
const model = "gpt-4o";
// const model = "gpt-3.5-turbo";

// Variables
let last = "";
let prompt = "";
let tag = "";
let goto= "";
let response = "";

engine.extend('1.2.3', function() {

		// Listen for the state change event
		engine.event.on('state-change', passageChanged);
  
});


// Function to handle passage changes
function passageChanged() {
  
	const current = engine.story.passageNamed(passage.name);
  
  	// make sure this is a new passage
	if (last != current) {
		if (engine.state.get('Action') == 'Generate') {
     		generateText(); 
    	}
    }
  
  	// remember for next passage change
  	last = current;
  
}


// function to generate the text
function generateText() {
  
	// we need to turn off the Action flag
	engine.state.set('Action', '');
  
	// get the prompt
  	prompt = engine.state.get('Prompt');
  	// make sure there was a prompt
  	if (prompt === undefined) {
     	console.error("Prompt required to generate text");
      	return;
    }
  
  	// get the tag for this response (optional)
  	tag = engine.state.get('Prompt');
  	if (tag === undefined) {
     	tag = "";
    }
  
  	// get the passage to go to when we receive this response (optional)
  	goto = engine.state.get('Goto');
  	if (goto === undefined) {
      	goto = "";
    }
  
  	// clear the prompt result variable
  	response = "";
  
}