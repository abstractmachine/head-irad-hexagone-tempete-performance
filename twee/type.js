

// engine.extend('1.0.0', () => {
//     config.template.modifiers = [{
//         match: /^typewriter\s/i,
//         process(output, {invocation}) {
//       // Get the time
//       let time = invocation.replace(/^typewriter\s/i, '');

//       // Save original text
//       let text = output.text;

//       // Get length of original text
//       let length = text.length;

//       // Set initial index
//       let index = 0;

//       // Wipe out output to start
//       output.text = "";

//       // Loop through the text
//       //  -- Add a new <span> for each character
//       //  -- Set the class "fade-in"
//       //  -- Set the delay as equal to time multiplied position
//       for(let i = 0; i < length; i++) {
//         output.text += `<span class='fade-in' style='animation-delay: ${time * i}ms'>${text[i]}</span>`;
//       }

//         }
//     }, ...config.template.modifiers];
// });