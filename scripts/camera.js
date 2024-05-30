
var videoElement = null;
var luxonisDeviceId = null;

// start webcam in browser
document.addEventListener("DOMContentLoaded", () => {
	
	videoElement = document.querySelector("#webcam-element");

	// list all the available devices
	if (!navigator.mediaDevices?.enumerateDevices) {
			console.log("enumerateDevices() not supported.");
		} else {
			// List cameras and microphones.
			navigator.mediaDevices
			.enumerateDevices()
			.then((devices) => {
				devices.forEach((device) => {
					// we're only looking at video devices
					if (device.kind == "videoinput") {
						// we want the Luxonis camera
						if (device.label.includes("Luxonis")) {
							luxonisDeviceId = device.deviceId;
							// console.log("Luxonis found: ", luxonis);
						}
					}
			});
			// now that we've loaded all the devices, start the webcam
			startWebcam();
		})
		.catch((err) => {
			console.error(`${err.name}: ${err.message}`);
		});

	}

});


function startWebcam() {
	
	let constraints = {
		'audio': false,
		'video': {
			'width': {
				ideal: 4096
			},
			'height': {
				ideal: 4096
			},
			'deviceId': luxonisDeviceId
		}
	};

	// start the webcam

	if (navigator.mediaDevices.getUserMedia(constraints)) {
		navigator.mediaDevices.getUserMedia(constraints)
		.then(function (stream) {
			// console.log(stream);
			//Display the video stream in the video object
			videoElement.srcObject = stream;
		})
		.catch(function (e) {
			logError(e.name + ": " + e.message);
		});
	}

}