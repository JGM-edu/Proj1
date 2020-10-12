// #region Aliases
const createElement = document.createElement.bind(document);
const dqs = document.querySelector.bind(document);
const dqsa = document.querySelectorAll.bind(document);
// #endregion

/**
 * 
 * @param {HTMLButtonElement} b 
 */
const updateButton = (b) => {
	isShowInWatchlist(b.dataset.showID, (a) => b.innerHTML = (a) ? "-" : "+");
};

const updateButtons = () => dqsa('.bttn_ChangeWatchlist').forEach((e) => updateButton(e));

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
 * 
 * @param {String} showID 
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
const formatShows = (showArr, container = undefined) =>
{
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
		// currShow.onclick = (args) =>
		// {
		// 	let xhr = new XMLHttpRequest();
		// 	xhr.onload = (e) => {
		// 		dqs("#xhrResults").innerHTML = JSON.stringify(JSON.parse(xhr.responseText), undefined, '\t');
		// 	};
		// 	xhr.open('GET', `/addToFavList?sessionID=${window.sessionID}&username=${window.username}&showID=${e.id}`);
		// 	xhr.send();
		// };
		retVal.appendChild(currShow);

		// #region Add To Watchlist Button
		addToListBttn = document.createElement('button');
		addToListBttn.innerHTML = '+';
		addToListBttn.classList.add("bttn_ChangeWatchlist");
		addToListBttn.dataset.showID = e.id;
		// addToListBttn.onclick = (evArgs) => {
		// 	let xhr = new XMLHttpRequest();
		// 	xhr.onload = () => {
		// 		let obj = JSON.parse(xhr.responseText);
		// 		dqs("#xhrResults").innerHTML = JSON.stringify(obj, undefined, '\t');
		// 		if (xhr.status == 204) {
		// 			evArgs.target.innerHTML = "&check;";
		// 			evArgs.target.style.color = "green";
		// 			let tID;
		// 			tID = setTimeout(() => {
		// 				evArgs.target.innerHTML = "-";
		// 				evArgs.target.style.color = "";
		// 				clearTimeout(tID);
		// 			}, 1000);
		// 		}
		// 	};
		// 	xhr.open('GET', `/addToFavList?sessionID=${window.sessionID}&username=${window.username}&showID=${e.id}`);
		// 	xhr.send();
		// };
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

// #region Event Listeners
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
					let shows = JSON.parse(xhr.responseText);
					// shows.forEach(e => {
					// 	const currElem = document.createElement('span');
					// 	let elemChild = document.createElement('p');
					// 	elemChild.innerHTML = `Name: ${e.name}`;
					// 	currElem.appendChild(elemChild);
					// 	elemChild = document.createElement('p');
					// 	elemChild.innerHTML = `Episode 1: ${e.episodes[0].name}`;
					// 	currElem.appendChild(elemChild);
					// 	dqs('#shows').innerHTML = "";
					// 	dqs('#shows').appendChild(currElem);
					// });
				};
				xhr.open('GET', '/getShows');
				xhr.send();
				break;
			case "/postShow":
				xhr = new XMLHttpRequest();
				xhr.onload = () => dqs("#xhrResults").innerHTML = JSON.stringify(JSON.parse(xhr.responseText), undefined, '\t');
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