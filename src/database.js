/**
 * @module database
 */

// #region Imports
const { v4: uuidv4 } = require('uuid');
// const { Show: Show, Episode: Episode } = require('./Show.js');
const Show = require('./Show.js');
const Episode = require('./Episode.js');
const User = require('./User.js');
// #endregion

// #region Storage
// #region Persistant
/**
 *
 * @type {String[]}
 */
const userGUIDs = [
	"demouser",
];

/**
 * The collection of users.
 * @type {Object}
 */
const users = {
	"demouser": {
		"username": "demo_user",
		"password": "password",
		"watched": [
			{
				showID: "test",
				episodesSeen: [
					"epi1",
				],
			},
		],
		'toWatch': [
			'test2',
		],
	},
};

/**
 *
 */
const showGUIDs = [
	"test",
	"test2",
];

/**
 * The collection of shows.
 * @type {Object}
 */
const shows = {
	"test": {
		name: "TestShow",
		thumbURL: "",
		episodes: [
			{
				name: "epi1",
				season: 1,
				number: 1,
				length: "23:00",
			},
			{
				name: "epi2",
				season: 1,
				number: 2,
				length: "26:00",
			},
		],
	},
	"test2": {
		name: "TestShow2",
		thumbURL: "https://m.media-amazon.com/images/M/MV5BODkzMjhjYTQtYmQyOS00NmZlLTg3Y2UtYjkzN2JkNmRjY2FhXkEyXkFqcGdeQXVyNTM4MDQ5MDc@._V1_.jpg",
		episodes: [
			{
				name: "Shinsei",
				season: 1,
				number: 1,
				length: "24:00",
			},
			{
				name: "Confrontation",
				season: 1,
				number: 2,
				length: "24:00",
			},
			{
				name: "Episode 3",
				season: 1,
				number: 3,
				length: "25:00",
			},
			{
				name: "Episode 4",
				season: 1,
				number: 4,
				length: "26:00",
			},
			{
				name: "Episode 5",
				season: 1,
				number: 5,
				length: "25:00",
			},
			{
				name: "Episode 6",
				season: 1,
				number: 6,
				length: "26:00",
			},
			{
				name: "S2Episode 1",
				season: 2,
				number: 1,
				length: "24:00",
			},
			{
				name: "S2Episode 2",
				season: 2,
				number: 2,
				length: "24:00",
			},
			{
				name: "S2Episode 3",
				season: 2,
				number: 3,
				length: "25:00",
			},
			{
				name: "S2Episode 4",
				season: 2,
				number: 4,
				length: "26:00",
			},
			{
				name: "S2Episode 5",
				season: 2,
				number: 5,
				length: "25:00",
			},
			{
				name: "S2Episode 6",
				season: 2,
				number: 6,
				length: "26:00",
			},
		],
	},
};
// #endregion
// #region Session
/**
 *
 */
let activeSessionsGUIDs = [/* *currID* */];
/**
 *
 */
const activeSessions = { /* *currID*: *corrosponding username*, ... */ };
// #endregion
// #endregion

// #region Helper Functions
/**
 *
 * @returns {String} A generated id.
 */
const testUUID = () => uuidv4();

/**
 * Checks if the specified username is in use.
 * @param {String} uName The name to check.
 * @returns {Boolean} True if taken, false otherwise.
 */
const isUsernameTaken = (uName) => (!!(users[uName]));

/**
 * Checks if the specified username is usable (currently only means not taken).
 * @param {String} uName The name to check.
 * @returns {Boolean} True if usable, false otherwise.
 */
const isValidUsername = (uName) => isUsernameTaken(uName);
// #endregion

// #region Gets
// #region Get User Info
/**
 *
 * @param {String} id The id of the user to get.
 * @returns {Object}
 */
const getUser = (id) => users[id];

/**
 *
 * @returns {Object}
 */
const getUsers = () => users;

/**
 *
 * @returns {User[]} An array of the users.
 */
const getUsersArr = () => userGUIDs.map((e) => users[e]);
// #endregion
// #region Get Show Info
/**
 *
 * @param {String} id The id of the show to get.
 * @returns {Object}
 */
const getShow = (id) => shows[id];

/**
 *
 * @returns {Object}
 */
const getShows = () => shows;

/**
 *
 * @returns {Show[]}
 */
const getShowsArr = () => showGUIDs.map((e) => shows[e]);
// #endregion
// #endregion

/**
 *
 * @param {User} user
 */
const addUser = (user) => {
	if (isUsernameTaken(user.username)) throw new Error("The given username is taken.");
	userGUIDs.push(user.username);
	users[user.username] = user;
};

const createUser = (username, password) => {
	if (isUsernameTaken(username)) throw new Error("The given username is taken.");
	else {
		userGUIDs.push(username);
		users[username] = new User(username, password);
		// Auto login new user.
		return logInUser(username, password);
	}
};

/**
 *
 * @param {Show} show
 */
const addShow = (show) => {
	showGUIDs.push(uuidv4());
	shows[showGUIDs[showGUIDs.length - 1]] = show;
	return showGUIDs[showGUIDs.length - 1];
};

/**
 *
 * @param {String} name
 * @param {String} thumbURL
 * @param {Episode[]} episodes
 * @returns {String} The created show's ID.
 */
const createShow = (name, thumbURL, episodes) => {
	showGUIDs.push(uuidv4());
	shows[showGUIDs[showGUIDs.length - 1]] = new Show(name, thumbURL, episodes);
	return showGUIDs[showGUIDs.length - 1];
};

// #region USER PROFILE
/**
 *
 * @param {String} username
 * @param {String} [currSessionID = undefined]
 * @returns {String} The new Session ID required for all user-specific actions.
 */
const assignNewSessionID = (username, oldSessionID = undefined) => {
	activeSessionsGUIDs = activeSessionsGUIDs.filter((val) => val != oldSessionID);
	activeSessions[oldSessionID] = undefined;
	let currSessionID;
	do {
		currSessionID = uuidv4();
	} while (activeSessions[currSessionID]);
	activeSessionsGUIDs.push(currSessionID);
	activeSessions[currSessionID] = username;
	return currSessionID;
};

/**
 *
 * @param {String} username
 * @param {String} password
 * @returns {String} The Session ID required for all user-specific actions.
 */
const logInUser = (username, password) => {
	if (users[username] && users[username].password && users[username].password == password) {
		const registeredSessions = activeSessionsGUIDs.filter((e) => activeSessions[e] == username);
		if (registeredSessions.length != 0) {
			registeredSessions.forEach((e) => { activeSessions[e] = undefined; });
		}
		return assignNewSessionID(username);
	}
	if (!users[username]) {
		throw new Error("The specified user does not exist.");
	}
	else if (users[username].password != password) {
		throw new Error("The password is incorrect.");
	}
	else {
		throw new Error("Unspecified login error.");
	}
};

/**
 *
 * @param {String} sessionID The id of the client's session.
 * @param {String} username The username of the client
 * @param {String} showID The id of the show to add
 * @throws {Error}
 */
const addShowToWatchlist = (sessionID, username, showID) => {
	if (!(activeSessions[sessionID] == username)) {
		throw new Error("Session ID is not registered to given username.");
	}
	else if (!getShow(showID)) {
		throw new Error("Invalid ShowID");
	}
	else if (!getUser(username)) {
		throw new Error("Invalid Username");
	}
	else {
		users[username].toWatch.push(showID);
	}
};
// #endregion

module.exports = {
	getUser,
	getShow,
	getShows,
	getShowsArr,

	addUser,
	createUser,
	addShow,
	createShow,

	addShowToWatchlist,

	isUsernameTaken,
	isValidUsername,
	testUUID,
};
