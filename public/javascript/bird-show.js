const show = function(button) {
    for (let bird of document.getElementsByClassName("bird")) {
		bird.style.display = "block";
	}

    button.className = "btn btn-danger";
    button.innerText = "Show Less";
    button.setAttribute("onclick", "hide(this)");
    document.getElementById("top-10").innerText = "(Showing All Results)";
}

const hide = function(button) {
	for (let bird of document.getElementsByClassName("bird")) {
		if (parseInt(bird.id) > 10) {bird.style.display = "none";}
	}
	
	button.className = "btn btn-primary";
	button.innerText = "Show More";
	button.setAttribute("onclick", "show(this)");
	document.getElementById("top-10").innerText = "(Showing Top 10 Results)";
}
