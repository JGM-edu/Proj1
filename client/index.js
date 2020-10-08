// import { Show, Episode } from "../src/Show.js";
// const { Show: Show, Episode: Episode} = require('../src/Show.js');
// import { Show, Episode } from "./Show.js";

const createElement = document.createElement.bind(document);

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
		currEpisode		= document.createElement(episodeType);
	for (let i = 0; i < showArr.length; i++) {
		const e = showArr[i];
		currShow = document.createElement(showElemType);
		currShow.className = "showListing";
		retVal.appendChild(currShow);

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

/**
 * 
 * @param {*} evArgs 
 */
const requireInput_OnBlur = (evArgs) =>
{
	// document.querySelector('input').classList.remove(['requiredField']);
	// classList.contains('requiredField')
	// evArgs.currentTarget?.required && 
	if (evArgs.currentTarget.value) {
		evArgs.currentTarget.classList.remove(['requiredField']);
	}
	else if (!evArgs.currentTarget.classList.contains('requiredField')) {
		evArgs.currentTarget.classList.add(['requiredField']);
	}
};

// const requireInput_OnFocus = (evArgs) =>
// {
// 	// document.querySelector('input').required
// 	// classList.contains('required')
// 	if (evArgs.currentTarget?.required && evArgs.currentTarget.value) {
// 		evArgs.currentTarget.classList.add(['required']);
// 	}
// };

export {
	formatShows,
	requireInput_OnBlur,
};