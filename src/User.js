/** @module User */
/** @class */
class User {
	/**
	 *
	 * @param {String} username The username.
	 * @param {String} password The password.
	 * @param {Object[]} [watched = Object[]] The list of watched shows.
	 * @param {Object[]} [toWatch = String[]] The list of shows to watch.
	 */
	constructor(username, password, watched = [], toWatch = []) {
		/**
		 * The username.
		 * @type {String}
		 */
		this.username = username;
		/**
		 * The password.
		 * @type {String}
		 */
		this.password = password;
		/**
		 * The list of watched shows.
		 * @type {Object[]}
		 */
		this.watched = watched;
		/**
		 * The list of shows to watch.
		 * @type {String[]}
		 */
		this.toWatch = toWatch;
	}
}

module.exports = {
	User,
};
