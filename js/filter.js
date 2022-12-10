let loaded = false;

async function filter({ selectedOptions }) {
	if (!loaded) return loaded = true;
	if (clickedAll) return baseGuns = guns, clickedAll = false;

	baseGuns = [];

	for (let i = 0; i < selectedOptions.length; i++) {
		const x = selectedOptions[i].innerHTML;
		const keys = filterArray[x.replace(/&amp;/gi, '&')];

		for (let J = 0; J < keys.length; J++) {
			baseGuns.push(guns[keys[J]]);
		}
	}
}