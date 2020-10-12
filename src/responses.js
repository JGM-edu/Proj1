// #region Imports
const http = require('http');
const fs = require('fs');
const url = require('url');
const querystring = require('querystring');

const database = require('./database.js');
// const Show = require('./classes/Show.js');
// const Episode = require('./classes/Episode.js');
// #endregion

const MIME = {
	json	: 'application/json',
	css		: 'text/css',
	html	: 'text/html',
	png		: 'image/png',
	js		: 'text/javascript',
};

const statCode = {
	200						: "OK",
	201						: "Created",
	204						: "No Content",
	400						: "Bad Request",
	401						: "Unauthorized",
	403						: "Forbidden",
	404						: "Not Found",
	500						: "Internal Server Error",
	503						: "Service Unavailable",
	"OK"					: 200,
	"Created"				: 201,
	"No Content"			: 204,
	"Bad Request"			: 400,
	"Unauthorized"			: 401,
	"Forbidden"				: 403,
	"Not Found"				: 404,
	"Internal Server Error"	: 500,
	"Service Unavailable"	: 503,
};

// #region Helper Functions
/**
 *
 * @param {ClientRequest | IncomingMessage} request
 * @returns {ParsedUrlQuery} An object representing the parsed url query.
 */
const parseURLQuery = (request) => url.parse(request.url, true).query;

/**
 *
 * @param {ClientRequest | IncomingMessage} request
 * @param {ServerResponse} response
 * @param {Buffer | Object | String} content
 * @param {Number} statusCode
 * @param {String} contentType
 */
const respond = (
	request,
	response,
	content,
	statusCode = 200,
	contentType = MIME.json,
) => {
	response.writeHead(statusCode, { 'Content-Type': contentType });
	let writeableContent = content
	if (!(content instanceof Buffer) && typeof(content) != "string")
		writeableContent = JSON.stringify(content);
	response.write(writeableContent);
	response.end();
};
// #endregion

// #region Static Resources
// #region Get Styles
const styles = fs.readFileSync(`${__dirname}/../client/index.css`);
/**
 * Responds with /client/index.css.
 * @param {ClientRequest | IncomingMessage} request
 * @param {ServerResponse} response
 */
const getStyles = (request, response) => respond(request, response, styles, 200, MIME.css);
// #endregion
// #region Get HTML
const page = fs.readFileSync(`${__dirname}/../client/index.html`);
/**
 * Responds with /client/index.css.
 * @param {ClientRequest | IncomingMessage} request
 * @param {ServerResponse} response
 */
const getHTML = (request, response) => respond(request, response, page, 200, MIME.html);
// #endregion
// #region Get IndexJS
const indJS = fs.readFileSync(`${__dirname}/../client/index.js`);
/**
 * Responds with /client/index.js.
 * @param {ClientRequest | IncomingMessage} request
 * @param {ServerResponse} response
 */
const getIndexJS = (request, response) => respond(request, response, indJS, 200, MIME.js);
// #endregion
// #region Get ShowJS
const showJS = fs.readFileSync(`${__dirname}/classes/Show.js`);
/**
 * Responds with /src/Show.js.
 * @param {ClientRequest | IncomingMessage} request
 * @param {ServerResponse} response
 */
const getShowJS = (request, response) => respond(request, response, showJS, 200, MIME.js);
// #endregion
// #region Get DefaultPNG
const defaultPNG = fs.readFileSync(`${__dirname}/../client/default.png`);
/**
 * Responds with /client/default.png.
 * @param {ClientRequest | IncomingMessage} request
 * @param {ServerResponse} response
 */
const getDefaultPNG = (request, response) => respond(request, response, defaultPNG, 200, MIME.png);
// #endregion
// #region 404
/**
 * Responds with a 404 error.
 * @param {ClientRequest | IncomingMessage} req
 * @param {ServerResponse} res
 */
const get404 = (req, res) => respond(req, res, JSON.stringify({ id: 404, message: 'Not Found' }), 404);
// #endregion
// #endregion

// #region Shows
/**
 *
 * @param {ClientRequest | IncomingMessage} req
 * @param {ServerResponse} res
 */
const postShow = (req, res) => {
	if (req.method == 'POST') {
		let body = '';// let post;
		req.on('data', (data) => {
			body += data;
			if (body.length > 1e6)
				req.connection.destroy();
		});
		req.on('end', () => {
			let post = JSON.parse(body);
			// console.log(body);
			// console.log(post);
			database.createShow(post.name, post.thumbURL, post.episodes);
			respond(req, res, JSON.stringify({ id: 201, message: 'Show Created' }), 201);
		});
	}
};

/**
 *
 * @param {ClientRequest | IncomingMessage} req
 * @param {ServerResponse} res
 */
const getShows = (req, res) => {
	respond(req, res, JSON.stringify(database.getShows()));
};

/**
 *
 * @param {ClientRequest | IncomingMessage} req
 * @param {ServerResponse} res
 */
const getShowsArr = (req, res) => {
	respond(req, res, JSON.stringify(database.getShowsArr()));
};
// #endregion

/**
 *
 * @param {ClientRequest | IncomingMessage} req
 * @param {ServerResponse} res
 */
const getUUIDTest = (req, res) => {
	respond(req, res, JSON.stringify({
		id: 200,
		message: 'Success',
		value: database.testUUID(),
	}));
};

// #region User Profile Stuff
/**
 *
 * @param {ClientRequest | IncomingMessage} req
 * @param {ServerResponse} res
 */
const getLoginUser = (req, res) => {
	const pQ = querystring.parse(url.parse(req.url).query);
	try {
		const sessionID = database.logInUser(pQ.username, pQ.password);
		const response = {
			id: 200,
			message: "Successfully Logged In!",
			sessionID,
		};
		respond(req, res, JSON.stringify(response));
	}
	catch (error) {
		const response = {
			id: statCode["Internal Server Error"],
			message: `Internal Server Error; ${error.message}`,
		};
		respond(req, res, JSON.stringify(response), statCode["Internal Server Error"]);
	}
};

/**
 *
 * @param {ClientRequest | IncomingMessage} req
 * @param {ServerResponse} res
 */
const getAddShowToWatchlist = (req, res) => {
	const pQ = querystring.parse(url.parse(req.url).query);
	try {
		/* const sessionID = */database.addShowToWatchlist(pQ.sessionID, pQ.username, pQ.showID);
		const response = {
			id: statCode["No Content"],
			message: "No Content",
			// sessionID: sessionID,
		};
		respond(req, res, JSON.stringify(response), statCode["No Content"]);
	}
	catch (error) {
		const response = {
			id: statCode["Internal Server Error"],
			message: `Internal Server Error; ${error.message}`,
		};
		respond(req, res, JSON.stringify(response), statCode["Internal Server Error"]);
	}
};

/**
 *
 * @param {ClientRequest | IncomingMessage} req
 * @param {ServerResponse} res
 */
const getRemoveShowFromWatchlist = (req, res) => {
	const pQ = querystring.parse(url.parse(req.url).query);
	try {
		/* const sessionID = */database.removeShowFromWatchlist(pQ.sessionID, pQ.username, pQ.showID);
		const response = {
			id: statCode["No Content"],
			message: "No Content",
			// sessionID: sessionID,
		};
		respond(req, res, JSON.stringify(response), statCode["No Content"]);
	}
	catch (error) {
		const response = {
			id: statCode["Internal Server Error"],
			message: `Internal Server Error; ${error.message}`,
		};
		respond(req, res, JSON.stringify(response), statCode["Internal Server Error"]);
	}
};

/**
 *
 * @param {ClientRequest | IncomingMessage} req
 * @param {ServerResponse} res
 */
const getIsShowInWatchlist = (req, res) => {
	const pQ = querystring.parse(url.parse(req.url).query);
	// try {
	const val = database.isShowInWatchlist(pQ.sessionID, pQ.username, pQ.showID);
	const response = {
		id: statCode[200],
		message: `Return value: ${val}`,
		value: val,
		// sessionID: sessionID,
	};
	respond(req, res, JSON.stringify(response));
	// }
	// catch (error) {
	// 	const response = {
	// 		id: statCode["Internal Server Error"],
	// 		message: `Internal Server Error; ${error.message}`,
	// 	};
	// 	respond(req, res, JSON.stringify(response), statCode["Internal Server Error"]);
	// }
};

/**
 *
 * @param {ClientRequest | IncomingMessage} req
 * @param {ServerResponse} res
 */
const getUser = (req, res) => {
	const pQ = querystring.parse(url.parse(req.url).query);
	try {
		respond(req, res, JSON.stringify(database.getUser(pQ.username, pQ.sessionID)));
	}
	catch (error) {
		const response = {
			id: statCode["Internal Server Error"],
			message: `Internal Server Error; ${error.message}`,
		};
		respond(req, res, JSON.stringify(response));
	}
};

/**
 *
 * @param {ClientRequest | IncomingMessage} req
 * @param {ServerResponse} res
 */
const getSignUpUser = (req, res) => {
	const pQ = querystring.parse(url.parse(req.url).query);
	try {
		respond(req, res, JSON.stringify(database.createUser(pQ.username, pQ.password)));
	}
	catch (error) {
		const response = {
			id: statCode["Internal Server Error"],
			message: `Internal Server Error; ${error.message}`,
		};
		respond(req, res, JSON.stringify(response));
	}
};
// #endregion

module.exports = {
	getHTML,
	getStyles,
	getIndexJS,
	getShowJS,
	getDefaultPNG,

	get404,

	getShows,
	getShowsArr,
	postShow,

	getLoginUser,
	addToWatchlist: getAddShowToWatchlist,
	removeFromWatchlist: getRemoveShowFromWatchlist,
	isInWatchlist: getIsShowInWatchlist,
	getUser,

	getSignUpUser,

	getUUIDTest,
};
