/** @module User */

class User
{
	/**
	 * 
	 * @param {String} username 
	 * @param {String} password 
	 * @param {Object[]} watched 
	 */
	constructor(username, password, watched)
	{
		Object.assign(this, { username, password, watched });
	}
}

module.exports = {
	User
};