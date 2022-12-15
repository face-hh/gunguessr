const settings = {
	hints: false,
	usage: false,
	origin: false,
	gunType: false,
};
// Reason: Some weapon names are really short, example: "TEC9" !== "TEC-9"
const accuracy = 0.51; // 51%
const input = document.getElementById('inputt');
const hint = document.getElementById('hint');
const origin = document.getElementById('origin');
const usage = document.getElementById('usage');
const gunType = document.getElementById('gunType');
const progressText = document.getElementById('progressText');
const progressOfLoading = document.getElementById('progressOfLoading');
const loadingScreen = document.getElementById('loadingScreen');
const buttonToClose = document.getElementById('buttonToClose');
const hideWhenDone = document.getElementById('hideWhenDone');
const center = document.getElementById('centerM');

const winmsg = document.getElementById('winmsg');
const countdown = document.getElementById('time');
const text = document.getElementById('skip');
const asciiImage = document.getElementById('ascii');

let guess;
let rGun;
let guns;
let past;
let date;
let streak = 0;
let clickedAll;
let filterArray;
let stopTheLoading = false;

function hide(str, term) {
	const matched = str.match(/[^{}]+(?=})/g);
	matched.forEach((y) => { str = str.replace(`{{${y}}}`, term); });
	return str;
}

function generateData(rGun) {
	settings.hints ? hint.innerHTML = hide(rGun.hint, '<span style="color:green">X</span>') : hint.innerHTML = 'Hidden;';
	settings.origin ? origin.innerHTML = rGun.origin : origin.innerHTML = 'Hidden;';
	settings.usage ? usage.innerHTML = rGun.usage : usage.innerHTML = 'Hidden;';
	settings.gunType ? gunType.innerHTML = rGun.gunType : gunType.innerHTML = 'Hidden;';
}

function skipLoading() {
	stopTheLoading = true;
}
(async () => {
	window.onkeyup = keyup;
	buttonToClose.style.display = 'none';
	guns = await (await fetch('data.json')).json();
	baseGuns = guns;
	filterArray = await (await fetch('filter.json')).json();
	gunsByValues = Object.values(guns);

	async function loadImages() {
		for (let i = 0; i < gunsByValues.length; i++) {
			await $.ajax({ 'url': gunsByValues[i].image });
			progressOfLoading.innerHTML = `<span style="color: #efdaf2">${(i + 1)}</span>/<span style="color: #e486f2">${gunsByValues.length}`;

			if (i + 1 === gunsByValues.length || stopTheLoading === true) {
				loadingScreen.style.display = 'none';
				buttonToClose.style.display = '';
				hideWhenDone.style.display = 'none';
			}
		}
	}
	await loadImages();
	rGun = generateGun();
	asciiImage.src = rGun.image;
	generateData(rGun);

	date = Date.now();


	function keyup(e) {
		guess = e.target.value;

		if (e.keyCode == 13) {

			if (text.innerHTML !== '') {
				rGun = generateGun();
				document.body.style.background = 'linear-gradient(92deg, rgb(248 248 248) 0%, rgb(0 0 0) 0%, rgb(31 27 41) 100%)';
				winmsg.innerHTML = '';
				text.innerHTML = '';
				countdown.innerHTML = '';
				document.body.style.animation = 'none';
				progress('none', 'none');
				userPressedNext = true;
				asciiImage.src = rGun.image;

				generateData(rGun);

				date = Date.now();

				return;
			}
			roll();
		}
	}

	function generateGun() {
		const keys = Object.keys(baseGuns);
		const num = Math.floor(Math.random() * keys.length);

		if (keys[num] == past) return generateGun();

		past = keys[num];
		const main = Object.values(baseGuns)[num];

		return {
			name: keys[num],
			image: main.image,
			hint: main.hint,
			origin: main.origin,
			usage: main.usage,
			gunType: main.gunType,
		};
	}

	function check(str) {
		const arr = Object.keys(guns);
		const results = {};
		for (let i = 0; i < arr.length; i++) {
			const test = arr[i];
			results[arr[i]] = stringSimilarity.compareTwoStrings(test.toLowerCase(), str.toLowerCase());
			if (i >= (arr.length - 1)) {
				const sortable = [];
				for (const vehicle in results) {
					sortable.push([vehicle, results[vehicle]]);
				}

				sortable.sort(function(a, b) {
					return b[1] - a[1];
				});
				return Object.entries(sortable)[0];
			}
		}
	}

	async function roll() {
		const time = ((Date.now() - date) / 1000);
		const res = check(guess);
		const score = calculateScore(res[1][1], time);

		if (res[1][0] == rGun.name && res[1][1] >= accuracy) {
			streak++;
			document.body.style.background = 'linear-gradient(90deg, rgb(248 248 248) 0%, rgb(0 0 0) 0%, rgb(37 82 18) 100%)';

			winmsg.innerHTML = `Great guess! It was <span style="color:green">${rGun.name}</span> <span style="color:yellow; font-size:30px"> + x${streak}</span>`;
			progress('block', 'flex');
			progressText.innerHTML = score;
			document.documentElement.style.setProperty('--percent', (score / 5000) * 100 + '%');
			userPressedNext = false;
			countDown(time * 10, countdown, true);
		}
		else {
			document.body.style.background = 'linear-gradient(90deg, rgb(248 248 248) 0%, rgb(37, 0, 0) 0%, rgb(0 0 0) 100%)';
			winmsg.innerHTML = `Bad guess, it was <span style="color:green">${rGun.name}</span> <span style="color:red; font-size:30px"> - x${streak}</span>`;
			document.body.style.animation = 'shake 0.25s 2';
			streak = 0;
		}
		hint.innerHTML = rGun.hint.replace(/{{/g, '<span style="color:green">').replace(/}}/g, '</span>');
		origin.innerHTML = rGun.origin;
		usage.innerHTML = rGun.usage;
		gunType.innerHTML = rGun.gunType;
		text.innerHTML = 'Press ENTER to continue';
		input.value = '';
	}
})();

function setting(type) {
	if (settings[type] == true) {
		settings[type] = false;
		// document.cookie = transcriptCookie(settings);

		if (type == 'hints') hint.innerHTML = 'Hidden;';
		if (type == 'origin') origin.innerHTML = 'Hidden;';
		if (type == 'usage') usage.innerHTML = 'Hidden;';
		if (type == 'gunType') gunType.innerHTML = 'Hidden;';
	}
	else if (settings[type] == false) {
		settings[type] = true;

		if (type == 'hints' && hint.innerHTML == 'Hidden;') hint.innerHTML = hide(rGun.hint, '<span style="color:green">X</span>');
		if (type == 'origin' && origin.innerHTML == 'Hidden;') origin.innerHTML = rGun.origin;
		if (type == 'usage' && usage.innerHTML == 'Hidden;') usage.innerHTML = rGun.usage;
		if (type == 'gunType' && gunType.innerHTML == 'Hidden;') gunType.innerHTML = rGun.gunType;
	}
}

function calculateScore(guess_accuracy, time) {
	let final;

	final = (5000 * guess_accuracy) - (time * 100);

	if (time >= 5) final += 500;
	if (final > 5000) final = 5000;

	return Math.round(final);
}
function reset_animation() {
	const el = document.getElementById('progress-value');
	el.style.animation = 'none';
	el.offsetHeight;
	el.style.animation = null;
}
function progress(display1, display2) {
	reset_animation();
	progressText.style.display = display1;
	progressText.innerHTML = 0;
	center.style.display = display2;
}
// function transcriptCookie(arr) {
// 	let str = '';
// 	const entries = Object.entries(arr);
// 	for (let i = 0; i < entries.length; i++) {
// 		str += `; ${entries[i][0]}=${entries[i][1]}`;
// 	}
// 	return str;
// }
// function getCookie(cname) {
// 	const name = cname + '=';
// 	const decodedCookie = decodeURIComponent(document.cookie);
// 	const ca = decodedCookie.split(';');
// 	for (let i = 0; i < ca.length; i++) {
// 		let c = ca[i];
// 		while (c.charAt(0) == ' ') {
// 			c = c.substring(1);
// 		}
// 		if (c.indexOf(name) == 0) {
// 			return c.substring(name.length, c.length);
// 		}
// 	}
// 	return '';
// }