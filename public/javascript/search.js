$("#searchWarning").hide();
const searchbutton = document.getElementById('go');
const searchInput = document.getElementById('search');

searchbutton.addEventListener('click', e => {
	if (searchInput.value == "") {
		e.preventDefault();
		$("#searchWarning").show();
	
	} else {
		$("#searchWarning").hide();
	}
});
