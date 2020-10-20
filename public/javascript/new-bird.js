let birdNames = "<%=birds%>".split(',');
let birdRegExpNames = []

let requestNames = "<%=requests%>".split(',');
let requestRegExpNames = []

const nameInput = document.getElementById("name");
const imageInput = document.getElementById('image-input')
const imageDisplay = document.getElementById('image-display')
const citationInput = document.getElementById('citation-input')
const citationHeader = document.getElementById('citation-header')
const citationValue = document.getElementById('citation-value')

let nameInputValue;
$("#overlap-warning-bird").hide();
$("#overlap-warning-request").hide();

for (let name of birdNames) {
  birdRegExpNames.push(name.toLowerCase().replace(/[^A-Za-z]/g, ''));
}

for (let name of requestNames) {
  requestRegExpNames.push(name.toLowerCase().replace(/[^A-Za-z]/g, ''));
}

nameInput.addEventListener('keydown', () => {
  setTimeout(() => {
    nameInputValue = nameInput.value.toLowerCase().replace(/[^A-Za-z]/g, '');

    if (nameInput.value != "") {

      if(birdRegExpNames.includes(nameInputValue)) {
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
  } , 3); //Wait 3 milliseconds, gives enough time for the computer to process your latest keystrokes
})

imageInput.addEventListener('keydown', () => {
  setTimeout(() => {
    if(imageInput.value.slice(0, 8) == "https://" || imageInput.value.slice(0, 7) == "http://") {
      imageDisplay.src = imageInput.value
      imageDisplay.alt = "Image Does Not Exist"
      $("#image-display").show()

    } else if (imageInput.value == "") {
      console.log("Hiding image")
      $("#image-display").hide()

    } else {
      imageDisplay.src = ""
      imageDisplay.alt = "Image Does Not Exist"
      $("#image-display").show()
    }
  }, 3)
})

imageInput.addEventListener('paste', () => {
  setTimeout(() => {
    if(imageInput.value.slice(0, 8) == "https://" || imageInput.value.slice(0, 7) == "http://") {
      imageDisplay.src = imageInput.value
      imageDisplay.alt = "Image Does Not Exist"
      $("#image-display").show()

    } else if (imageInput.value == "") {
      $("#image-display").hide()

    } else {
      imageDisplay.src = ""
      imageDisplay.alt = "Image Does Not Exist"
      $("#image-display").show()
    }
  }, 3)
})

citationInput.addEventListener('keydown', () => {
  setTimeout(() => {

    if (citationInput.value != "") {
      citationHeader.innerText = "Citation: "
      citationValue.innerText = citationInput.value

    } else {
      citationHeader.innerText = ""
      citationValue.innerText = citationInput.value
    }
  }, 3)
})

citationInput.addEventListener('paste', () => {
  setTimeout(() => {

    if (citationInput.value != "") {
      citationHeader.innerText = "Citation: "
      citationValue.innerText = citationInput.value

    } else {
      citationHeader.innerText = ""
      citationValue.innerText = citationInput.value
    }
  }, 3)
})
