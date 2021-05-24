//Access all DOM Elements
const nameInput = document.getElementById("name");
const imageInput = document.getElementById('image-input');
const imageDisplay = document.getElementById('image-display');
const citationInput = document.getElementById('citation-input');
const citationHeader = document.getElementById('citation-header');
const citationValue = document.getElementById('citation-value');

//Hide JQuery Elements
let nameInputValue;
$("#overlap-warning-bird").hide();
$("#overlap-warning-request").hide();

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

const updateImage = function() { //Update image display based on entered input URL
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
}

const updateCitation = function() { //Update imgae citation based on entered input citation
	if (citationInput.value != "") {
		citationHeader.innerText = "Citation: ";
		citationValue.innerText = citationInput.value;
	
	} else {
		citationHeader.innerText = "";
		citationValue.innerText = citationInput.value;
	}
}