let userPressedNext = false;

async function countDown(end, element, seconds = false, locale = false) {
	const animationDuration = 1000;
	const frameDuration = 1000 / 60;
	const totalFrames = Math.round(animationDuration / frameDuration);

	let frame = 0;

	const counter = setInterval(() => {
		if (userPressedNext) return clearInterval(counter);
		frame++;

		const progress = frame / totalFrames;

		const currentCount = Math.round(end * progress);

		if (parseInt(element.innerHTML.replace(/s/, '')) !== currentCount) {
			if (seconds) {
				element.innerHTML = currentCount / 10 + 's';
			}
			else if (locale) {
				element.innerHTML = currentCount.toLocaleString();
			}
			else {
				element.innerHTML = currentCount;
			}
		}

		if (frame === totalFrames) {
			clearInterval(counter);
		}
	}, frameDuration);
}