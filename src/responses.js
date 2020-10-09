const http = require('http');
const fs = require('fs');
const url = require('url');
const querystring = require('querystring');

const database = require('./database.js');
// const Show = require('./Show.js');
// const Episode = require('./Episode.js');

const MIME = {
	json:	'application/json',
	css:	'text/css',
	html:	'text/html',
	js:	'text/javascript',
	png:	'image/png',
};

const statCode = {
	200: "OK",
	400: "Bad Request",
	401: "Unauthorized",
	403: "Forbidden",
	404: "Not Found",
	500: "Internal Server Error",
	"OK": 200,
	"Bad Request": 400,
	"Unauthorized": 401,
	"Forbidden": 403,
	"Not Found": 404,
	"Internal Server Error": 500,
};

const parseURLQuery = (request) => url.parse(request.url, true).query;

const respond = (request, response, content, statusCode = 200, contentType = MIME.json) => {
	response.writeHead(statusCode, { 'Content-Type': contentType });
	//   console.log(content);
	response.write(content);
	response.end();
};

// #region Static Resources
// #region Get Styles
const styles = fs.readFileSync(`${__dirname}/../client/index.css`);
const getStyles = (request, response) => respond(request, response, styles, 200, MIME.css);
// #endregion
// #region Get HTML
const page = fs.readFileSync(`${__dirname}/../client/index.html`);
const getHTML = (request, response) => respond(request, response, page, 200, MIME.html);
// #endregion
// #region Get IndexJS
const indJS = fs.readFileSync(`${__dirname}/../client/index.js`);
const getIndexJS = (request, response) => respond(request, response, indJS, 200, MIME.js);
// #endregion
// #region Get ShowJS
const showJS = fs.readFileSync(`${__dirname}/Show.js`);
const getShowJS = (request, response) => respond(request, response, showJS, 200, MIME.js);
// #endregion
// #region Get DefaultPNG
const defaultPNG = fs.readFileSync(`${__dirname}/../client/default.png`);
const getDefaultPNG = (request, response) => respond(request, response, defaultPNG, 200, MIME.png);
// #endregion
// #region 404
const get404 = (req, res) => respond(req, res, JSON.stringify({ id: 404, message: 'Not Found' }), 404);
// #endregion
// #endregion

// #region Shows
/**
 *
 * @param {*} req
 * @param {*} res
 */
const postShow = (req, res) => {
	if (req.method == 'POST') {
		let body = '';
		let post;
		req.on('data', (data) => {
			body += data;

			if (body.length > 1e6) {
				req.connection.destroy();
			}
		});
		req.on('end', () => {
			console.log(body);
			// post = querystring.parse(body);
			post = JSON.parse(body);
			console.log(post);
			database.createShow(post.name, post.thumbURL, post.episodes);
			respond(req, res, JSON.stringify({ id: 201, message: 'Show Created' }), 201);
		});
	}
};

/**
 *
 * @param {*} req
 * @param {*} res
 */
const getShows = (req, res) => {
	respond(req, res, JSON.stringify(database.getShows()));
};

/**
 *
 * @param {*} req
 * @param {*} res
 */
const getShowsArr = (req, res) => {
	respond(req, res, JSON.stringify(database.getShowsArr()));
};
// #endregion

const getUUIDTest = (req, res) => {
	respond(req, res, JSON.stringify({
		id: 200,
		message: 'Success',
		value: database.testUUID(),
	}));
};

const getLoginUser = (req, res) => {
	const pQ = querystring.parse(url.parse(req.url).query);
	try {
		// console.log(pQ);
		const sessionID = database.logInUser(pQ.username, pQ.password);
		const response = {
			id: 200,
			message: "Successfully Logged In!",
			sessionID,
		};
		respond(req, res, JSON.stringify(response));
	}
	catch (error) {
		// if (error.message)
		const response = {
			id: statCode["Internal Server Error"],
			message: `Internal Server Error; ${error.message}`,
		};
		respond(req, res, JSON.stringify(response), statCode["Internal Server Error"]);
	}
	// let sessionID = database.logInUser(pQ.username, pQ.password);
	// database.logInUser(req, res,)
};

const getAddShowToWatchlist = (req, res) => {
	const pQ = querystring.parse(url.parse(req.url).query);
	try {
		const sessionID = database.addShowToWatchlist(pQ.sessionID, pQ.username, pQ.showID);
		const response = {
			id: 200,
			message: "Successfully added!",
			// sessionID: sessionID,
		};
		respond(req, res, JSON.stringify(response));
	}
	catch (error) {
		// if (error.message)
		const response = {
			id: statCode["Internal Server Error"],
			message: `Internal Server Error; ${error.message}`,
		};
		respond(req, res, JSON.stringify(response), statCode["Internal Server Error"]);
	}
};

/**
 *
 * @param {*} req
 * @param {*} res
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
	getAddShowToWatchlist,
	getUser,

	getUUIDTest,
};
