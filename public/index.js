$(document).ready(function() {
	//Init ScrollSpy
	$('body').scrollspy({ target: '#main-nav' });

	//Add smooth scrolling
	$('#main-nav ').on('click',"a", function(e) {
		// check for hash value
		if (this.hash !== '') {
			// Prevent Default behaviour
			// e.preventDefault();
			// Store hash
			const hash = this.hash;
            //  console.log("click me")
			// Animate smooth scroll
			$('html,body').animate(
				{
					scrollTop: $(hash).offset().top,
				},
				900,
				function() {
                  
					// Add hash to URL after scroll
					window.location.hash = hash;
				}
			);
		}
	});
});
