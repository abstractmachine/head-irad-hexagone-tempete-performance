config.body.transition.name = 'none';

// Ensure the engine is initialized and ready
window.onload = function() {

	// Check if the init function exists and call it to initialize the engine
	if (typeof init === 'function') {
		init();
	}

	// Extend the engine with custom functionality
	engine.extend('1.2.3', function() {

		// Listen for the state change event
		engine.event.on('state-change', passageChanged);

		// Add event listener for key presses
		document.addEventListener('keydown', function (e) {
			// Check if the key pressed is Escape
			if (e.key === "Escape") {
				// Go to the Start passage
				go('Start');
			}
		});

		// Initial passage change logging
		passageChanged();
	});

};




// Function to handle passage changes
function passageChanged() {

	const name = passage.name;
	const current = engine.story.passageNamed(name);
	if (current) {
		// Delay the execution of the code inside the setTimeout
        setTimeout(function() {
            let articles = document.getElementsByTagName('article');

            // If you want to access the first 'article' element
            if (articles.length > 0) {
                let firstArticle = articles[0];
                // You can now work with firstArticle
                console.log(firstArticle.textContent);
            }
        }, 100); // Delay of 0 milliseconds
	}
	
}



