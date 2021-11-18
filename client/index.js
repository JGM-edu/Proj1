// #region Aliases
const createElement = document.createElement.bind(document);
const dqs = document.querySelector.bind(document);
const dqsa = document.querySelectorAll.bind(document);
// #endregion

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
	isError					: (code) => code >= 400,
	isSuccess				: (code) => code >= 200 && code < 300,
	isInfo					: (code) => code >= 100 && code < 200,
};

/**
 * 
 * @param {HTMLButtonElement} b 
 */
const updateButton = (b) => {
	isShowInWatchlist(b.dataset.showID, (a) => b.innerHTML = (a) ? "-" : "+");
};

const updateButtons = () => dqsa('.bttn_ChangeWatchlist').forEach((e) => updateButton(e));

/**
 * Visually updates listing of shows in the database.
 */
const updateShowListings = () => {
	let xhr = new XMLHttpRequest();
	xhr.onload = () => {
		dqs("#xhrResults").innerHTML = JSON.stringify(JSON.parse(xhr.responseText), undefined, '\t');
		dqs("#shows").innerHTML = "";
		formatShows(JSON.parse(xhr.responseText), dqs("#shows"));
	};
	xhr.open('GET', '/getShowsArr');
	xhr.send();
};

/**
 * Visually updates user's to watch list.
 */
const updateUser = () => {
	// window.username = dqs('#username').value;
	let xhr = new XMLHttpRequest();
	xhr.onload = (args) => {
		let obj = JSON.parse(xhr.responseText);
		dqs("#xhrResults").innerHTML = JSON.stringify(obj, undefined, '\t');
		// window.sessionID = obj.sessionID;
		if (statCode.isSuccess(xhr.status))
			formatUser(obj, dqs('#userInfo'));
	};
	xhr.open('GET', `${'/getUser'}?username=${window.username}&sessionID=${window.sessionID}`);
	xhr.send();
}

/**
 * Checks if the specified show is in the user's watchlist.
 * @param {String} showID The specified show's uuid.
 * @param {Function} callback A function that accepts a boolean that fires on response.
 */
const isShowInWatchlist = (showID, callback) => {
	let xhr = new XMLHttpRequest();
	xhr.onload = () => {
		const obj = JSON.parse(xhr.responseText);
		const val = (xhr.status == 200) && obj.value;
		callback(val);
	};
	xhr.open('GET', `/isInWatchlist?sessionID=${window.sessionID}&username=${window.username}&showID=${showID}`);
	xhr.send();
};

/**
 * 
 * @param {Show[]} showArr 
 * @param {HTMLElement} [container = undefined] 
 * @returns {Element} 
 */
const formatShows = (showArr, container = undefined) => {
	const containerType = 'div', showElemType = 'span', showTitleType = 'h4', showEpiListType = 'div', episodeType = 'span';
	const retVal		= (container) ? container : document.createElement(containerType);
	let currShow		= document.createElement(showElemType), 
		currShowTitle	= document.createElement(showTitleType),
		currShowThumb	= document.createElement('img'),
		currShowEpiList	= document.createElement(showEpiListType),
		currEpisode		= document.createElement(episodeType),
		addToListBttn	= document.createElement('button');
	for (let i = 0; i < showArr.length; i++) {
		const e = showArr[i];
		currShow = document.createElement(showElemType);
		currShow.className = "showListing";
		currShow.dataset.name = e.name;
		currShow.dataset.thumbURL = e.thumbURL;
		currShow.dataset.showID = e.id;
		retVal.appendChild(currShow);

		// #region Add To Watchlist Button
		addToListBttn = document.createElement('button');
		addToListBttn.innerHTML = '+';
		addToListBttn.classList.add("bttn_ChangeWatchlist");
		addToListBttn.dataset.showID = e.id;
		addToListBttn.onclick = bttn_ChangeWatchlist_OnClick;
		currShow.appendChild(addToListBttn);
		// #endregion

		currShowTitle = document.createElement(showTitleType);
		currShowTitle.className = "showName";
		currShowTitle.innerHTML = e.name;
		currShow.appendChild(currShowTitle);

		currShowThumb = document.createElement('img');
		currShowThumb.className = "showThumbnail";
		currShowThumb.src = (e.thumbURL) ? e.thumbURL : './default.png';
		currShowThumb.alt = `Show Thumbnail (${e.thumbURL})`;
		currShow.appendChild(currShowThumb);

		currShowEpiList = document.createElement(showEpiListType);
		currShowEpiList.className = "showEpisodeListing";
		currShow.appendChild(currShowEpiList);
		
		let currEpiNum		= document.createElement('p'),
			currEpiName		= document.createElement('p'),
			currEpiLength	= document.createElement('p');
		for (let j = 0; j < e.episodes.length; j++) {
			const elem = e.episodes[j];
			
			currEpisode = document.createElement(episodeType);
			currEpisode.className = "episode";
			currShowEpiList.appendChild(currEpisode);
			
			currEpiNum = document.createElement('p');
			currEpiNum.className = "episodeNumber";
			currEpiNum.innerHTML = `S${elem.season}E${elem.number}`;
			currEpisode.appendChild(currEpiNum);
			
			currEpiName = document.createElement('p');
			currEpiName.className = "episodeName";
			currEpiName.innerHTML = elem.name;
			currEpisode.appendChild(currEpiName);
			
			currEpiLength = document.createElement('p');
			currEpiLength.className = "episodeLength";
			currEpiLength.innerHTML = elem.length;
			currEpisode.appendChild(currEpiLength);
		}
	}
	return retVal;
};

const formatShow = (show, container = undefined) => {
	const containerType = 'span', showTitleType = 'h4', showEpiListType = 'div', episodeType = 'span';
	const retVal		= (container) ? container : document.createElement(containerType);
	let currShow		= retVal, 
		currShowTitle	= document.createElement(showTitleType),
		currShowThumb	= document.createElement('img'),
		currShowEpiList	= document.createElement(showEpiListType),
		currEpisode		= document.createElement(episodeType),
		addToListBttn	= document.createElement('button');
	const e = show;
	// currShow = document.createElement(containerType);
	currShow.className = "showListing";
	currShow.dataset.name = e.name;
	currShow.dataset.thumbURL = e.thumbURL;
	currShow.dataset.showID = e.id;

	// #region Add To Watchlist Button
	addToListBttn = document.createElement('button');
	addToListBttn.innerHTML = '+';
	addToListBttn.classList.add("bttn_ChangeWatchlist");
	addToListBttn.dataset.showID = e.id;
	addToListBttn.onclick = bttn_ChangeWatchlist_OnClick;
	currShow.appendChild(addToListBttn);
	// #endregion

	currShowTitle = document.createElement(showTitleType);
	currShowTitle.className = "showName";
	currShowTitle.innerHTML = e.name;
	currShow.appendChild(currShowTitle);

	currShowThumb = document.createElement('img');
	currShowThumb.className = "showThumbnail";
	currShowThumb.src = (e.thumbURL) ? e.thumbURL : './default.png';
	currShowThumb.alt = `Show Thumbnail (${e.thumbURL})`;
	currShow.appendChild(currShowThumb);

	currShowEpiList = document.createElement(showEpiListType);
	currShowEpiList.className = "showEpisodeListing";
	currShow.appendChild(currShowEpiList);
		
	let currEpiNum		= document.createElement('p'),
		currEpiName		= document.createElement('p'),
		currEpiLength	= document.createElement('p');
	for (let j = 0; j < e.episodes.length; j++) {
		const elem = e.episodes[j];
		
		currEpisode = document.createElement(episodeType);
		currEpisode.className = "episode";
		currShowEpiList.appendChild(currEpisode);
		
		currEpiNum = document.createElement('p');
		currEpiNum.className = "episodeNumber";
		currEpiNum.innerHTML = `S${elem.season}E${elem.number}`;
		currEpisode.appendChild(currEpiNum);
		
		currEpiName = document.createElement('p');
		currEpiName.className = "episodeName";
		currEpiName.innerHTML = elem.name;
		currEpisode.appendChild(currEpiName);
		
		currEpiLength = document.createElement('p');
		currEpiLength.className = "episodeLength";
		currEpiLength.innerHTML = elem.length;
		currEpisode.appendChild(currEpiLength);
	}
	return retVal;
};

/**
 * 
 * @param {User} user 
 * @param {HTMLElement} [container = undefined] 
 */
const formatUser = (user, container = undefined) => {
	const containerType = 'div', userNameType = 'h4', watchlistType = 'div', showType = 'span', epiWatchedListType = 'div', episodeType = 'span';
	if (container)
		container.innerHTML = '';
	const retVal = (container) ? container : document.createElement(containerType);
	// let// currShow		= document.createElement(showElemType), 
		// currShowTitle	= document.createElement(userNameType),
		// currShowThumb	= document.createElement('img'),
		// currShowEpiList	= document.createElement(showEpiListType),
		// currEpisode		= document.createElement(episodeType),
		// addToListBttn	= document.createElement('button');
	
	// #region Username
	let userNameElem = document.createElement(userNameType);
	userNameElem.innerHTML = user.username;
	retVal.appendChild(userNameElem);
	// #endregion

	// #region Watchlist
	let watchlistCont = document.createElement(watchlistType);
	watchlistCont.className = 'watchlist';
	retVal.appendChild(watchlistCont);
	
	let currShow = document.createElement(showType),
		currShowName = document.createElement('p'),
		currShowThumb = document.createElement('img'),
		currShowNum = document.createElement('p');
	for (let i = 0; i < user.toWatch.length; i++) {
		const showXHR = new XMLHttpRequest();
		showXHR.onload = () => {
			const show = JSON.parse(showXHR.responseText);
			currShow = document.createElement(showType);
			currShow.className = 'wl_Show';
			switch (user.toWatch.length) {
				case 1:
					currShow.style.gridColumnStart = "1";
					currShow.style.gridColumnEnd = "-1";
					break;
				case 2:
					if (i == 0) {
						currShow.style.gridColumnStart = "1";
						currShow.style.gridColumnEnd = "3";
					}
					else if (i == 1) {
						currShow.style.gridColumnStart = "-3";
						currShow.style.gridColumnEnd = "-1";
					}
					break;
				case 3:
					watchlistCont.style.gridTemplateColumns = "1fr 1fr 1fr";
					break;
				default:
					break;
			}
			currShow.onclick = (e) => {
				e.stopPropagation();
				formatShow(show, dqs('#messageBox'));
				let mb = document.querySelector('#messageBox');
				mb.style.zIndex = 10;
				let timestamp, currOpacity = 0, opacityStep = .05, funct;
				funct = () => {
					currOpacity += opacityStep;
					mb.style.opacity = (currOpacity >= 1) ? 1 : currOpacity;
					clearTimeout(timestamp);
					if (currOpacity < 1)
						timestamp = setTimeout(funct, 50);
				};
				timestamp = setTimeout(funct, 50);
				document.body.addEventListener('click', body_OnClick_fadeOutMsgBox);
			};
			watchlistCont.appendChild(currShow);
			
			currShowName = document.createElement('p');
			currShowName.className = 'wl_ShowName';
			currShowName.innerHTML = show.name;
			currShow.appendChild(currShowName);
	
			currShowThumb = document.createElement('img');
			currShowThumb.className = 'wl_ShowThumb';
			currShowThumb.src = (show.thumbURL) ? show.thumbURL : './default.png';
			currShowThumb.alt = `Show Thumbnail: ${show.thumbURL}`;
			currShow.appendChild(currShowThumb);
			
			currShowNum = document.createElement('p');
			currShowNum.className = 'wl_ShowNum';
			currShowNum.innerHTML = ''+(i+1);
			currShow.appendChild(currShowNum);
		}
		showXHR.open('GET', `/getShow?showID=${user.toWatch[i]}`);
		showXHR.send();
	}
	// #endregion

	// #region Watched
	
	// #endregion
	return retVal;
};

// #region Event Listeners
const msgBox_OnClick_StopProp = (e) => {
	e.stopPropagation();
};
/**
 * 
 * @param {MouseEvent} e 
 */
const body_OnClick_fadeOutMsgBox = (e) => {
	e.stopPropagation();
	document.body.removeEventListener('click', body_OnClick_fadeOutMsgBox);
	let mb = document.querySelector('#messageBox'), timestamp = undefined, currOpacity = 1, opacityStep = .05;
	let funct2;
	funct2 = () => {
		currOpacity -= opacityStep;
		mb.style.opacity = (currOpacity < 0) ? 0 : currOpacity;
		clearTimeout(timestamp);
		if (currOpacity > 0)
			timestamp = setTimeout(funct2, 50);
		else {
			mb.style.zIndex = -1;
			mb.innerHTML = "";
			mb.className = "";
		}
	};
	timestamp = setTimeout(funct2, 50);
};

/**
 * 
 * @param {MouseEvent} evArgs 
 */
const bttn_ChangeWatchlist_OnClick = (evArgs) => {
	if (!window.username || !window.sessionID) {
		alert("You must be logged in to add or remove shows from your watchlist.");
		return;
	}
	let cb = (isInList) => {
		let xhr = new XMLHttpRequest(),
			showID = evArgs.target.parentElement.dataset.showID;
		xhr.onload = () => {
			let obj;
			switch (xhr.status) {
				case 200:
				case 201:
					obj = JSON.parse(xhr.responseText);
					dqs("#xhrResults").innerHTML = JSON.stringify(obj, undefined, '\t');
				case 204:
				case 205:
					if (!isInList) {
						evArgs.target.innerHTML = "&check;";
						evArgs.target.style.color = "green";
						let tID;
						tID = setTimeout(() => {
							evArgs.target.innerHTML = "-";
							evArgs.target.style.color = "";
							clearTimeout(tID);
						}, 1000);
					}
					else {
						evArgs.target.innerHTML = "&check;";
						evArgs.target.style.color = "green";
						let tID;
						tID = setTimeout(() => {
							evArgs.target.innerHTML = "+";
							evArgs.target.style.color = "";
							clearTimeout(tID);
						}, 1000);
					}
					break;
				default:
					obj = JSON.parse(xhr.responseText);
					dqs("#xhrResults").innerHTML = JSON.stringify(obj, undefined, '\t');
					evArgs.target.innerHTML = (isInList) ? "-" : "+";
					break;
			}
			updateUser();
		};
		const url = (!isInList) ? "addToFavList" : 'removeFromFavList',
			sessID = window.sessionID,
			uName = window.username;
		xhr.open('GET', `/${url}?sessionID=${sessID}&username=${uName}&showID=${showID}`);
		xhr.send();
	};
	isShowInWatchlist(evArgs.target.dataset.showID, cb);
};

/**
 * 
 * @param {FocusEvent} e 
 */
const requireInput_OnBlur = (e) => {
	if (e.target.value)
		e.target.classList.remove(['requiredField']);
	else if (!e.target.classList.contains('requiredField'))
		e.target.classList.add(['requiredField']);
};

const bttnSwitch_OnClick = (evArgs) => {
	const bttn_Switch = document.querySelector("#bttn_Switch");
	const bttn_Login = document.querySelector("#bttn_Login");
	switch (document.querySelector("button#bttn_Login").dataset.url) {
		case "/getSignUpUser":
			bttn_Switch.innerHTML = "Want to Sign Up?";
			bttn_Login.innerHTML = "Log In";
			bttn_Login.dataset.url = "/getLoginUser";
			break;
		case "/getLoginUser":
		default:
			bttn_Switch.innerHTML = "Want to Log In?";
			bttn_Login.innerHTML = "Sign Up";
			bttn_Login.dataset.url = "/getSignUpUser";
			break;
	}
};

/**
 * 
 * @param {MouseEvent} evArgs 
 */
const bttnLogin_OnClick = (evArgs) => {
	let xhr = new XMLHttpRequest();
	switch (document.querySelector("button#bttn_Login").dataset.url) {
		case "/getSignUpUser":
			window.username = dqs('#username').value;
			// xhr = new XMLHttpRequest();
			xhr.onload = (args) => {
				let obj = JSON.parse(xhr.responseText);
				dqs("#xhrResults").innerHTML = JSON.stringify(obj, undefined, '\t');
				window.sessionID = obj.sessionID;
				updateButtons();
			};
			xhr.open('GET', `${dqs("button#bttn_Login").dataset.url}?username=${dqs('#username').value}&password=${dqs('#password').value}`);
			xhr.send();
			break;
		case "/getLoginUser":
		default:
			window.username = dqs('#username').value;
			// xhr = new XMLHttpRequest();
			xhr.onload = (args) => {
				let obj = JSON.parse(xhr.responseText);
				dqs("#xhrResults").innerHTML = JSON.stringify(obj, undefined, '\t');
				window.sessionID = obj.sessionID;
				updateButtons();
			};
			xhr.open('GET', `${dqs("button#bttn_Login").dataset.url}?username=${dqs('#username').value}&password=${dqs('#password').value}`);
			xhr.send();
			break;
	}
};

const init = () => {
	const dqs = document.querySelector.bind(document);
	window.sessionID;
	window.username;
	let xhr;
	// SETUP FUNCTIONALITY
	document.querySelectorAll("[required]").forEach((e) =>
	{
		e.addEventListener('blur', requireInput_OnBlur);
	});
	dqs("#bttn_Switch").onclick = bttnSwitch_OnClick;
	dqs("#bttn_Login").onclick = bttnLogin_OnClick;

	const episodeDOMTemplate = document.createElement('div');

	let currLabel = document.createElement('label');
	currLabel.htmlFor = 'epiName';
	currLabel.innerHTML = "Episode Name";
	episodeDOMTemplate.appendChild(currLabel);

	let curr = document.createElement('input');
	// curr.classList.add(['epiName', 'requiredField']);
	curr.className = 'epiName requiredField';
	// curr.addEventListener('blur', requireInput_OnBlur);
	curr.required = true;
	curr.name = 'epiName';
	curr.type = 'text';
	currLabel.appendChild(curr);

	currLabel = document.createElement('label');
	currLabel.htmlFor = 'epiSeason';
	currLabel.innerHTML = "Episode Season";
	episodeDOMTemplate.appendChild(currLabel);

	curr = document.createElement('input');
	curr.className = 'epiSeason';
	curr.name = 'epiSeason';
	curr.type = 'number';
	curr.min = 1;
	curr.value = 1;
	currLabel.appendChild(curr);

	currLabel = document.createElement('label');
	currLabel.htmlFor = 'epiNumber';
	currLabel.innerHTML = "Episode Number";
	episodeDOMTemplate.appendChild(currLabel);

	curr = document.createElement('input');
	curr.className = 'epiNumber';
	curr.name = 'epiNumber';
	curr.type = 'number';
	curr.min = 1;
	curr.value = 1;
	currLabel.appendChild(curr);

	currLabel = document.createElement('label');
	currLabel.htmlFor = 'epiLength';
	currLabel.innerHTML = "Episode Length";
	episodeDOMTemplate.appendChild(currLabel);

	curr = document.createElement('input');
	curr.className = 'epiLength';
	curr.name = 'epiLength';
	curr.type = 'time';
	curr.step = '1';
	curr.value = "00:00:00";
	currLabel.appendChild(curr);

	dqs(`#numEpisodes`).onchange = (e) => {
		if (dqs(`#newShowEpisodes`).children.length != dqs(`#numEpisodes`).value) {
			dqs(`#newShowEpisodes`).innerHTML = "";
			for (let i = 0; i < dqs(`#numEpisodes`).value; i++)
				dqs(`#newShowEpisodes`).appendChild(episodeDOMTemplate.cloneNode(true));
		}
		document.querySelectorAll("[required]").forEach((e) => e.addEventListener('blur', requireInput_OnBlur));
	};

	dqs(`#launchXHR`).onclick = (e) => {
		switch (dqs("#url").value) {
			case "/getShows":
				xhr = new XMLHttpRequest();
				xhr.onload = (e) => {
					dqs("#xhrResults").innerHTML = JSON.stringify(JSON.parse(xhr.responseText), undefined, '\t');
				};
				xhr.open('GET', '/getShows');
				xhr.send();
				break;
			case "/postShow":
				xhr = new XMLHttpRequest();
				xhr.onload = () => {
					dqs("#xhrResults").innerHTML = JSON.stringify(JSON.parse(xhr.responseText), undefined, '\t');
					updateShowListings();
				};
				xhr.open("POST", dqs('#url').value);
				xhr.send(JSON.stringify({
					name: 		dqs('#showName').value,
					thumbURL:	dqs('#thumbURL').value,
					episodes:	(() => {
						let retVal = [];
						for (let i = 0; i < dqs('#newShowEpisodes').children.length; i++) {
							const elem = dqs('#newShowEpisodes').children[i];
							retVal.push({
								name:	elem.children[0].children[0].value,
								season:	elem.children[1].children[0].value,
								number:	elem.children[2].children[0].value,
								length:	elem.children[3].children[0].value,
							});
						}
						return retVal;
					})()
				}));
				break;
			case "/getUUIDTest":
				xhr = new XMLHttpRequest();
				xhr.onload = (args) => dqs("#xhrResults").innerHTML = JSON.stringify(JSON.parse(xhr.responseText), undefined, '\t');
				xhr.open('GET', dqs('#url').value);
				xhr.send();
				break;
			case "/getLoginUser":
				window.username = dqs('#username').value;
				xhr = new XMLHttpRequest();
				xhr.onload = (args) => {
					let obj = JSON.parse(xhr.responseText);
					dqs("#xhrResults").innerHTML = JSON.stringify(obj, undefined, '\t');
					window.sessionID = obj.sessionID;
				};
				xhr.open('GET', `${dqs('#url').value}?username=${dqs('#username').value}&password=${dqs('#password').value}`);
				xhr.send();
				break;
			case "/getUser":
				// window.username = dqs('#username').value;
				xhr = new XMLHttpRequest();
				xhr.onload = (args) => {
					let obj = JSON.parse(xhr.responseText);
					dqs("#xhrResults").innerHTML = JSON.stringify(obj, undefined, '\t');
					// window.sessionID = obj.sessionID;
					if (statCode.isSuccess(xhr.status))
						formatUser(obj, dqs('#userInfo'));
				};
				xhr.open('GET', `${dqs('#url').value}?username=${window.username}&sessionID=${window.sessionID}`);
				xhr.send();
				break;
			case "/getShowsArr":
			default:
				xhr = new XMLHttpRequest();
				xhr.onload = () => {
					dqs("#xhrResults").innerHTML = JSON.stringify(JSON.parse(xhr.responseText), undefined, '\t');
					dqs("#shows").innerHTML = "";
					formatShows(JSON.parse(xhr.responseText), dqs("#shows"));
				};
				xhr.open('GET', '/getShowsArr');
				xhr.send();
				break;
		}
	};

	dqs(`#launchXHR`).onclick();
};
// #endregion

// #region Exports
export {
	init,
	formatShows,
	requireInput_OnBlur,
	bttnSwitch_OnClick,
	bttnLogin_OnClick,
};
// #endregion