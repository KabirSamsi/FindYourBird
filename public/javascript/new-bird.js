let birdNames = "<%=birds%>".split(',');
let birdRegExpNames = [];

let requestNames = "<%=requests%>".split(',');
let requestRegExpNames = [];

const nameInput = document.getElementById("name");
const imageInput = document.getElementById('image-input');
const imageDisplay = document.getElementById('image-display');
const citationInput = document.getElementById('citation-input');
const citationHeader = document.getElementById('citation-header');
const citationValue = document.getElementById('citation-value');

let nameInputValue;
$("#overlap-warning-bird").hide();
$("#overlap-warning-request").hide();

for (let name of birdNames) {
	birdRegExpNames.push(name.toLowerCase().replace(/[^A-Za-z]/g, ''));
}

for (let name of requestNames) {
	requestRegExpNames.push(name.toLowerCase().replace(/[^A-Za-z]/g, ''));
}

const changeLabel = function(slider) { //Update label when slider is changed
	if (!document.getElementById(slider.id.split('-')[0]).checked) { //If slider is updated and button is not checked, it has to be updated
		if (slider.value != 0) {
			document.getElementById(slider.id.split('-')[0]).checked = true;
		}
	} else if (slider.value == 0) {
		document.getElementById(slider.id.split('-')[0]).checked = false;
	}
	document.getElementById(`${slider.id}-label`).innerText = slider.value; //Update slider value
}

const resetSlider = function(input) { //Uncheck/check button and reset slider
	if (!input.checked) {
		document.getElementById(`${input.id}-slider`).value = 0;
		document.getElementById(`${input.id}-slider-label`).innerText = "0";
	} else {
		document.getElementById(`${input.id}-slider`).value = 1;
		document.getElementById(`${input.id}-slider-label`).innerText = "1";
	}
}

nameInput.addEventListener('keydown', () => {
	setTimeout(() => {
		nameInputValue = nameInput.value.toLowerCase().replace(/[^A-Za-z]/g, '');
		if (nameInput.value != "") {
			if (birdRegExpNames.includes(nameInputValue)) {
				$("#overlap-warning-bird").show();
				$("#overlap-warning-request").hide();
				$("#overlap-break").hide();

			} else if (requestRegExpNames.includes(nameInputValue)) {
				$("#overlap-warning-bird").hide();
				$("#overlap-warning-request").show();
				$("#overlap-break").hide();
			
			} else {
				$("#overlap-warning-bird").hide();
				$("#overlap-warning-request").hide();
				$("#overlap-break").show();
			}
		
		} else {
			$("#overlap-warning-bird").hide();
			$("#overlap-warning-request").hide();
			$("#overlap-break").show();
		}
	} , 3); //Wait 3 milliseconds, gives enough time for the computer to process your latest keystroke
});

imageInput.addEventListener('keydown', () => {
	setTimeout(() => {
		if (imageInput.value.slice(0, 8) == "https://" || imageInput.value.slice(0, 7) == "http://") {
			imageDisplay.src = imageInput.value;
			imageDisplay.alt = "Image Does Not Exist";
			$("#image-display").show();
		
		} else if (imageInput.value == "") {
			$("#image-display").hide();
		
		} else {
			imageDisplay.src = "";
			imageDisplay.alt = "Image Does Not Exist";
			$("#image-display").show();
		}
	}, 3);
});

imageInput.addEventListener('paste', () => {
	setTimeout(() => {
		if (imageInput.value.slice(0, 8) == "https://" || imageInput.value.slice(0, 7) == "http://") {
			imageDisplay.src = imageInput.value;
			imageDisplay.alt = "Image Does Not Exist";
			$("#image-display").show();
		
		} else if (imageInput.value == "") {
			("#image-display").hide();

		} else {
			imageDisplay.src = "";
			imageDisplay.alt = "Image Does Not Exist";
			$("#image-display").show();
		}
	}, 3);
});

citationInput.addEventListener('keydown', () => {
	setTimeout(() => {
		if (citationInput.value != "") {
			citationHeader.innerText = "Citation: ";
			citationValue.innerText = citationInput.value;
		
		} else {
			citationHeader.innerText = "";
			citationValue.innerText = citationInput.value;
		}
	}, 3);
});

citationInput.addEventListener('paste', () => {
	setTimeout(() => {
		if (citationInput.value != "") {
			citationHeader.innerText = "Citation: ";
			citationValue.innerText = citationInput.value;
		
		} else {
			citationHeader.innerText = "";
			citationValue.innerText = citationInput.value;
		}
	}, 3);
});