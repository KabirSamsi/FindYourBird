//Access all DOM Elements
const newImgButton = document.getElementById('add-new-button');
const stopAddButton = document.getElementById('stop-add-button');
const newDisplayImage = document.getElementById('new-display-image');
const newImgInput = document.getElementById('new-image-url');
const newImgCitation = document.getElementById('new-image-citation');
const citationHeader = document.getElementById('citation-header');
const citationValue = document.getElementById('citation-value');

//Hide JQuery Elements
$('#add-new-form').hide();
$('#stop-add-button').hide();

const addImage = function() { //Create block for new image
    $('#add-new-form').show();
    $('#stop-add-button').show();
    $('#new-display-image').hide();
    $('#add-new-button').hide();
}

const stopAdd = function() { //Remove block for new image
    newImgInput.value = "";
    newImgCitation.value = "";
    citationHeader.innerText = "";
    citationValue.innerText = "";
    $('#add-new-form').hide();
    $('#stop-add-button').hide();
    $('#add-new-button').show();
}

const addImageInput = function() { //Add image for new image block
    if (newImgInput.value.slice(0, 8) == "https://" || newImgInput.value.slice(0, 7) == "http://") {
        newDisplayImage.src = newImgInput.value;
        newDisplayImage.alt = "Image Does Not Exist";
        $("#new-display-image").show();

    } else if (newImgInput.value == "") {
        $("#new-display-image").hide();

    } else {
        newDisplayImage.src = "";
        newDisplayImage.alt = "Image Does Not Exist";
        $("#new-display-image").show();
    }
}

const addCitationInput = function() { //Add citation for new image block
    if (newImgCitation.value != "") {
        citationHeader.innerText = "Citation: ";
    } else { //If no citation is provided
        citationHeader.innerText = "";
    }
    citationValue.innerText = newImgCitation.value;
}