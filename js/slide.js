$(document).ready(function() {
	$('#owl-carousel').owlCarousel({
		autoPlay: 2000,
		items: 3,
		itemsDesktop: [1199, 3],
		itemsDesktopSmall: [979, 3],
		center: true,
		nav: true,
		loop: true,
		responsive: {
			600: {
				items: 1,
			},
		},
	});
});

onload = async () => {
	const data = await fetch('data.json');
	const guns = await data.json();
	const gunsL = Object.keys(guns).length;
	const gunsH = Object.values(guns);

	let ctr = 0;
	for (let i = 0; i < gunsL; i++) {
		ctr += parseInt(gunsH[i].hint.split(' ').length);
	}
	countDown(gunsL.toLocaleString(), document.getElementById('guns'));
	countDown(ctr, document.getElementById('information'), false, true);
};