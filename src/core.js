var maxFeedItems = 15;
var req;
var buildPopupAfterResponse = false;
var OnFeedSuccess = null;
var OnFeedFail = null;
var retryMilliseconds = 120000;
var localStorage = new Array();
var useForce = false;

function SetInitialOption(key, value) {
	if (localStorage[key] == null) {
		localStorage[key] = value;
	}
}

// function for retrieving new ideas
function UpdateIfReady(force) {
	var lastRefresh = parseFloat(localStorage["FS.LastRefresh"]);
	var interval = parseFloat(localStorage["FS.RequestInterval"]);
	var nextRefresh = lastRefresh + interval;
	var curTime = parseFloat((new Date()).getTime());
	var isReady = (curTime > nextRefresh);
	var isNull = (localStorage["FS.LastRefresh"] == null);
	useForce = force;
	if ((force == true) || (localStorage["FS.LastRefresh"] == null)) {
		this.UpdateFeed();
	} else {
		if (isReady) {
			this.UpdateFeed();
		}
	}
}

// function calls rss feed
function UpdateFeed() {
	$.ajax({type:'GET', dataType:'xml', url: 'http://firespotting.com/rss', timeout:5000, success:onRssSuccess, error:coreObject.onRssError, async: false});
}

// function for parsing the rss result
function onRssSuccess(doc) {
	if (!doc) {
		coreObject.handleFeedParsingFailed("Not a valid feed.");
		return;
	}
	links = coreObject.parseFSLinks(doc);
	coreObject.handleLinkNotification(links);
	coreObject.SaveLinksToLocalStorage(links);

	if (this.buildPopupAfterResponse == true) {
		this.buildPopupAfterResponse = false;
		this.delegateBuildPopup(links);
	}
	localStorage["FS.LastRefresh"] = new Date().getTime();
}

function openLinkFront() {
	openUrl(this.href, true);
}

/**
 * Function just for delegating to buildPopup() method on popup.js.
 */
function delegateBuildPopup(links) {
	buildPopup(links);
}

function RetrieveLinksFromLocalStorage() {
	var numLinks = localStorage["FS.NumLinks"];
	if (numLinks == null) {
		return null;
	} else {
		var links = new Array();
		for (var i=0; i<numLinks; i++) {
			links.push(JSON.parse(localStorage["FS.Link" + i]))
		}
		return links;
	}
}

// Show |url| in a new tab.
function openUrl(url, take_focus) {
	// Only allow http and https URLs.
	if (url.indexOf("http:") != 0 && url.indexOf("https:") != 0) {
		return;
	}
	chrome.tabs.create({url: url, selected: take_focus});
}

function hideElement(id) {
	var e = document.getElementById(id);
	e.style.display = 'none';
}

function showElement(id) {
	var e = document.getElementById(id);
	e.style.display = 'block';
}

function openOptions() {
	var optionsUrl = chrome.extension.getURL('options.html');
	chrome.tabs.create({url: optionsUrl});
}

function openLink() {
	openUrl(this.href, (localStorage['FS.BackgroundTabs'] == 'false'));
}

function printTime(d) {
	var hour   = d.getHours();
	var minute = d.getMinutes();
	var ap = "AM";
	if (hour   > 11) { ap = "PM";             }
	if (hour   > 12) { hour = hour - 12;      }
	if (hour   == 0) { hour = 12;             }
	if (minute < 10) { minute = "0" + minute; }
	var timeString = hour +
		':' +
		minute +
		" " +
		ap;
	return timeString;
}

var coreObject = {
	/**
	 * Show notifications, if needed.
	 */
	handleLinkNotification: function (link) {
		if (localStorage['FS.Notifications'] == 'true') {
			// don't do anything, when notification are off
			return;
		}
		if (!useForce && (localStorage['FS.LastNotificationTitle'] == null || localStorage['FS.LastNotificationTitle'] != links[0].Title)) {
			this.ShowLinkNotification(links[0]);
			localStorage['FS.LastNotificationTitle'] = links[0].Title;
		} else if (useForce && localStorage['FS.LastNotificationTitle'] == null) {
			// is only valid for first loading -> the first title will be ignored, because you will see the full list the first time.
			localStorage['FS.LastNotificationTitle'] = links[0].Title;
		}
	},

	updateLastRefreshTime: function () {
		localStorage["FS.LastRefresh"] = (new Date()).getTime();
	},

	DebugMessage: function (message) {
		var notification = webkitNotifications.createNotification(
			"bulb18.png",
			"DEBUG",
			printTime(new Date()) + " :: " + message
		);
		notification.show();
	},

	ShowLinkNotification: function (link) {
		var notification = webkitNotifications.createNotification("bulb48.png", "Firespotting Top Idea", link.Title);

		// notification onClick function
		notification.addEventListener("click", function () {
			window.open(link.Link);
			notification.close();
		});

		// set notification timeout
		if (localStorage["FS.NotificationTimeout"] != "infinity") {
			setTimeout(function() { notification.close(); }, localStorage["FS.NotificationTimeout"]);
		}
		notification.show();
	},

	onRssError: function (xhr, type, error) {
		handleFeedParsingFailed('Failed to fetch RSS feed.');
	},

	handleFeedParsingFailed: function (error) {
		localStorage["FS.LastRefresh"] = localStorage["FS.LastRefresh"] + retryMilliseconds;
	},

	parseXml: function (xml) {
		var xmlDoc;
		try {
			xmlDoc = new ActiveXObject('Microsoft.XMLDOM');
			xmlDoc.async = false;
			xmlDoc.loadXML(xml);
		} catch (e) {
			xmlDoc = (new DOMParser).parseFromString(xml, 'text/xml');
		}
		return xmlDoc;
	},

	parseFSLinks: function (doc) {
		var entries = doc.getElementsByTagName('entry');
		if (entries.length == 0) {
			entries = doc.getElementsByTagName('item');
		}
		var count = Math.min(entries.length, maxFeedItems);
		var links = new Array();
		for (var i=0; i< count; i++) {
			item = entries.item(i);
			var hnLink = new Object();
			//Grab the title
			var itemTitle = item.getElementsByTagName('title')[0];
			if (itemTitle) {
				hnLink.Title = itemTitle.textContent;
			} else {
				hnLink.Title = "Unknown Title";
			}

			//Grab the Link
			var itemLink = item.getElementsByTagName('link')[0];
			if (!itemLink) {
				itemLink = item.getElementsByTagName('comments')[0];
			}
			if (itemLink) {
				hnLink.Link = itemLink.textContent;
			} else {
				hnLink.Link = '';
			}

			//Grab the comments link
			var commentsLink = item.getElementsByTagName('comments')[0];
			if (commentsLink) {
				hnLink.CommentsLink = commentsLink.textContent;
			} else {
				hnLink.CommentsLink = '';
			}

			links.push(hnLink);
		}
		return links;
	},

	SaveLinksToLocalStorage: function (links) {
		localStorage["FS.NumLinks"] = links.length;
		for (var i=0; i<links.length; i++) {
			localStorage["FS.Link" + i] = JSON.stringify(links[i]);
		}
	},

	toggle: function (id) {
		var e = document.getElementById(id);
		if(e.style.display == 'block')
			e.style.display = 'none';
		else
			e.style.display = 'block';
	}
}


// node.js boilerplate
// TODO: add comments for indicating from which method each export is
module.exports.SetInitialOption = SetInitialOption;
module.exports.localStorage = localStorage;
module.exports.UpdateIfReady = UpdateIfReady;
module.exports.UpdateFeed = UpdateFeed;
module.exports.onRssSuccess = onRssSuccess;
module.exports.parseFSLinks = coreObject.parseFSLinks;
module.exports.ShowLinkNotification = coreObject.ShowLinkNotification;
module.exports.SaveLinksToLocalStorage = coreObject.SaveLinksToLocalStorage;
module.exports.handleLinkNotification = coreObject.handleLinkNotification;
module.exports.buildPopupAfterResponse = buildPopupAfterResponse;
module.exports.delegateBuildPopup = delegateBuildPopup;
module.exports.useForce = useForce;
module.exports.coreObject = coreObject;