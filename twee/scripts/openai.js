// the URL for the OpenAI API
const url = "https://api.openai.com/v1/chat/completions";
// Create an AbortController to allow aborting the request
const controller = new AbortController();
// Create a variable to store the stream content
let streamContent = "";

async function fetchStream(phrase) {

	// check the controller to see if there is a signal
	// if there is, abort that previous signal
	if (controller.signal.aborted) {
		// aborting previous signal
		controller.abort();
	}

	// Make a POST request to the OpenAI API to get chat completions
	const response = await fetch(url, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${openAIKey}`,
		},
		body: JSON.stringify({
			messages: [{ role: "user", content: phrase }],
			temperature: 0.6,
			model: "gpt-3.5-turbo",
			// Limiting the tokens during development
			max_tokens: 30,
			stream: true,
		}),
		// Use the AbortController's signal to allow aborting the request
		// This is a `fetch()` API thing, not an OpenAI thing
		signal: controller.signal,
	});

	// Create a TextDecoder to decode the response body stream
	const decoder = new TextDecoder();

	// Iterate through the chunks in the response body using for-await...of
	for await (const chunk of response.body) {
		const decodedChunk = decoder.decode(chunk);

		// Clean up the data
		const lines = decodedChunk
			.split("\n")
			.map((line) => line.replace("data: ", ""))
			.filter((line) => line.length > 0)
			.filter((line) => line !== "[DONE]")
			.map((line) => JSON.parse(line));

		// Destructuring!
		for (const line of lines) {
			const {
				choices: [
					{
						delta: { content },
					},
				],
			} = line;

			if (content) {
				streamContent += content;
				console.log(streamContent);
			}
		}
	}

}
