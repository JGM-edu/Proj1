/** @module Episode */
/** @class */
class Episode {
	/**
	 *
	 * @param {String} name
	 * @param {Number} season
	 * @param {Number} number
	 * @param {*} length
	 */
	constructor(name, season, number, length) {
		Object.assign(this, {
			name, season, number, length,
		});
	}

	static parse(jsonString) {
		return Episode.construct(JSON.parse(jsonString));
	}

	static construct(anonObject) {
		return new Episode(anonObject.name, anonObject.season, anonObject.number, anonObject.length);
	}
}

// module.exports = {
// 	// Show,
// 	Episode,
// };
module.exports = Episode;
