
jQuery(document).ready(function() {

    /*
        Fullscreen background
    */
    $.backstretch("/cdn/site/img/backgrounds/1.jpg");

    /*
        Wow
    */
    new WOW().init();

    /*
	    Countdown initializer
	*/
	var now = new Date();
	var countTo = 365 * 24 * 60 * 60 * 1000 + now.valueOf();
	$('.timer').countdown(countTo, function(event) {
		$(this).find('.days').text(event.offset.totalDays);
		$(this).find('.hours').text(event.offset.hours);
		$(this).find('.minutes').text(event.offset.minutes);
		$(this).find('.seconds').text(event.offset.seconds);
	});





});

