window.onload = function () {
	document.querySelector('.preloader').style.display="none";
	document.querySelector('.content').style.display="block";
};
$(window).load = function() {
	$('.loading').fadeOut();
	$('#load').delay(150).fadeOut('slow');
},4000;