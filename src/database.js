/**
 * @module database
 */

const { v4: uuidv4 } = require('uuid');
const { Show: Show, Episode: Episode } = require('./Show.js');

/**
 * 
 * @type {String[]}
 */
const userGUIDs = [
	"demouser"
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
					"epi1"
				]
			}
		],
	}
};

/**
 * 
 */
const showGUIDs = [
	"test",
	"test2"
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
		]
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
		]
	}
};


/**
 * 
 * @param {String} id The id of the user to get.
 * @returns {Object} 
 */
const getUser = (id) => users[id];

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
 * @returns {Object} 
 */
const getShowsArr = () => {
	let retVal = showGUIDs.map((e) =>
	{
		return shows[e];
	});
	return retVal;
};

// const addUser = (show) =>
// {
// 	showGUIDs.push(uuidv4());
// 	shows[showGUIDs.length - 1] = show;
// };

const addShow = (show) =>
{
	showGUIDs.push(uuidv4());
	shows[showGUIDs.length - 1] = show;
};

const createShow = (name, thumbURL, episodes) =>
{
	shows[uuidv4()] = new Show(name, thumbURL, episodes);
};

const testUUID = () =>
{
	return uuidv4();
}

module.exports = {
	getUser,
	getShow,
	getShows,
	getShowsArr,

	addShow,
	createShow,

	testUUID,
};