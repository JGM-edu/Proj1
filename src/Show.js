class Show
{
	/**
	 * 
	 * @param {String} name 
	 * @param {String} thumbURL 
	 * @param {Episode[]} episodes 
	 */
	constructor(name, thumbURL, episodes)
	{
		/**
		 * 
		 * @type {String}
		 */
		this.name = name;
		/**
		 * 
		 * @type {String}
		 */
		this.thumbURL = thumbURL;
		/**
		 * 
		 * @type {Episode[]}
		 */
		this.episodes = episodes;
	}
	
	/**
	 * 
	 * @param {String} jsonString 
	 * @returns {Show} 
	 */
	static parse(jsonString)
	{
		return Show.construct(JSON.parse(jsonString));
	}

	
	/**
	 * 
	 * @param {Object} anonObject 
	 * @returns {Show} 
	 */
	static construct(anonObject)
	{
		let epi = anonObject.episodes.map(e => {
			return Episode.construct(e);
		});
		return new Show(anonObject.name, anonObject.thumbURL, epi);
	}
}

class Episode
{
	/**
	 * 
	 * @param {String} name 
	 * @param {Number} season 
	 * @param {Number} number 
	 * @param {*} length 
	 */
	constructor(name, season, number, length)
	{
		Object.assign(this, { name, season, number, length });
	}
	
	static parse(jsonString)
	{
		return Episode.construct(JSON.parse(jsonString));
	}

	static construct(anonObject)
	{
		return new Episode(anonObject.name, anonObject.season, anonObject.number, anonObject.length);
	}
}

module.exports = {
	Show,
	Episode,
};