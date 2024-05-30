//Webcam Setup and usage
var constraints = {
	video: {
		width: {
			ideal: 4096
		},
		height: {
			ideal: 4096
		},
		facingMode: "user"
	},
	audio: false
};


// start webcam in browser
document.addEventListener("DOMContentLoaded", () => {
	
	var video = document.querySelector("#webcam-element");

	if (navigator.mediaDevices.getUserMedia(constraints)) {
	  navigator.mediaDevices.getUserMedia({ video: true })
		.then(function (stream) {
			video.srcObject = stream;
		})
		.catch(function (error) {
			console.log(error);
		});
	}

});