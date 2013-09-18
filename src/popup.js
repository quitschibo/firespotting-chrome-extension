window.onload = function(){
	main();
	setupEvents();
};
function setupEvents() {
	$('#submitLink').click(submitCurrentTab);
	$('#refresh').click(refreshLinks);
	$('a#options').click(function(){
		console.log("CLICKED THE OPTIONS LINK");
		openOptions();
	});
}
function main() {
	if (localStorage['FS.NumLinks'] == null) {
		buildPopupAfterResponse = true;
		UpdateFeed();
	} else {
		buildPopup(RetrieveLinksFromLocalStorage());
  }
}

function buildPopup(links) {
	var header = document.getElementById("header");
	var feed = document.getElementById("feed");
	var issueLink = document.getElementById("issues");
	issueLink.addEventListener("click", openLinkFront);

	//Setup Title Link
	var title = document.getElementById("title");
	title.addEventListener("click", openLink);

	for (var i=0; i<links.length; i++) {
		fsLink = links[i];
		var row = document.createElement("tr");
		row.className = "link";
		var num = document.createElement("td");
		num.innerText = i+1;
		var link_col = document.createElement("td");
		var title = document.createElement("a");
		title.className = "link_title";
		title.innerText = fsLink.Title;
		title.href = fsLink.Link;
		title.addEventListener("click", openLink);
		var comments = document.createElement("a");
		comments.className = "comments";
		comments.innerText = "(comments)";
		comments.href = fsLink.CommentsLink;
		comments.addEventListener("click", openLink);
		var fireImage = document.createElement("img");
		fireImage.src = "fire_small.png";
		fireImage.className = "imagemargin";
		if (fsLink.Title.endsWith("Fire!")) {
			link_col.appendChild(fireImage);
		}
		link_col.appendChild(title);
		link_col.appendChild(comments);
		row.appendChild(num);
		row.appendChild(link_col)
		feed.appendChild(row);
	}

	// curtime - lastRefresh time -> when refreshing was max 1 second ago, show refresh animation
	var curtime =  parseFloat((new Date()).getTime());
	var lastRefresh = parseFloat(localStorage["FS.LastRefresh"]);
	if (curtime - lastRefresh <= 1000) {
		hideElement("container");
		showElement("spinner");
		$("#spinner").fadeOut(300, function() {
			showElement("container");
		});
	}
}

function refreshLinks() {
	console.log('refreshing!');
	toggle("container");
	toggle("spinner");
	var linkTable = document.getElementById("feed");
	while(linkTable.hasChildNodes()) linkTable.removeChild(linkTable.firstChild); //Remove all current links
	buildPopupAfterResponse = true;
	UpdateIfReady(true);
	updateLastRefreshTime();
}

//Submit the current tab
function submitCurrentTab() {
	chrome.windows.getCurrent(function(win){
		chrome.tabs.getSelected(win.id, function(tab){
			var submit_url = "http://news.ycombinator.com/submitlink?u=" + encodeURIComponent(tab.url) + "&t=" + encodeURIComponent(tab.title);
			openUrl(submit_url, true);
		});
	});
}

// awesome function provided by http://stackoverflow.com/questions/280634/endswith-in-javascript - Thanks a lot!
String.prototype.endsWith = function(suffix) {
	return this.indexOf(suffix, this.length - suffix.length) !== -1;
};

