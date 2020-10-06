const http = require('http');
const url = require('url');

const responses = require('./responses.js');

const port = process.env.PORT || process.env.NODE_PORT || 3000;

const onRequest = (req, res) =>
{
	const jumpTable = {
		GET: {
			"/"				: responses.getHTML,
			"/index.css"	: responses.getStyles,
			"/index.js"		: responses.getIndexJS,
			"/Show.js"		: responses.getShowJS,
			'/default.png'	: responses.getDefaultPNG,
			"404"			: responses.get404,
			"/getShows"		: responses.getShows,
			"/getShowsArr"	: responses.getShowsArr,
			"/getUUIDTest"	: responses.getUUIDTest,
		},
		POST: {
			"/postShow"		: responses.postShow,
		},
		HEAD: {
			
		}
	};
	const reqMethod = (req.method && jumpTable[req.method]) ? req.method : "GET";
	
	const parsedURL = new url.URL(req.url, `http://${req.headers.host}`);

	console.log(`${req.url} - ${parsedURL.pathname} (${req.method})`);

	if (typeof jumpTable[reqMethod][parsedURL.pathname] !== "function") {
		jumpTable[reqMethod]["404"](req, res);
	}
	else {
		jumpTable[reqMethod][parsedURL.pathname](req, res);
	}
};

console.log("Creating server");
http.createServer(onRequest).listen(port);
// console.log(`Server listening on ${request.headers.host}:${port}`);
console.log(`Server listening on 127.0.0.1:${port}`);