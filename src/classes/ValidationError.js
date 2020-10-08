/** @module ValidationError */
/** @class */
class ValidationError extends Error
{
	constructor(message, obj, invalidPropertyName)
	{
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
			this.sessionID = sessionID;
		}
		if (obj.username) {
			/**
			 * 
			 */
			this.username = username;
		}
		if (obj.password) {
			/**
			 * 
			 */
			this.password = password;
		}
		if (obj.showID) {
			/**
			 * 
			 */
			this.showID = showID;
		}
	}
}

module.exports = { ValidationError };