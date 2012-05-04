$(document).ready(function() {
	
	UI.stylishForms();
	
	Events.enableFocusCall();
	Events.submitFormOnEnter();
	
	$('#searchField').focus();
	$('#searchField').keyup(Events.typingInSearchField);
	$('#searchButton').click(Events.submitForm);

});