/** @module ValidationError */
/** @class */
class ValidationError extends Error {
	constructor(message, obj, invalidPropertyName) {
		super(message);
		/**
		 *
		 */
		this.invalidPropertyName = invalidPropertyName;
		/**
		 *
		 */
		this.invalidProperty = obj[invalidPropertyName];
		if (obj.sessionID) {
			/**
			 *
			 */
			this.sessionID = obj.sessionID;
		}
		if (obj.username) {
			/**
			 *
			 */
			this.username = obj.username;
		}
		if (obj.password) {
			/**
			 *
			 */
			this.password = obj.password;
		}
		if (obj.showID) {
			/**
			 *
			 */
			this.showID = obj.showID;
		}
	}
}

module.exports = { ValidationError };
