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
		hnLink = links[i];
		var row = document.createElement("tr");
		row.className = "link";
		var num = document.createElement("td");
		num.innerText = i+1;
		var link_col = document.createElement("td");
		var title = document.createElement("a");
		title.className = "link_title";
		title.innerText = hnLink.Title;
		title.href = hnLink.Link;
		title.addEventListener("click", openLink);
		var comments = document.createElement("a");
		comments.className = "comments";
		comments.innerText = "(comments)";
		comments.href = hnLink.CommentsLink;
		comments.addEventListener("click", openLink);
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
		$("#spinner").fadeOut("slow", function() {
			showElement("container");
		});
		localStorage["FS.showLoadingAnimation"] = false;
	}
}

function refreshLinks() {
	console.log('refreshing!');
	toggle("container");
	toggle("spinner");
	var linkTable = document.getElementById("feed");
	while(linkTable.hasChildNodes()) linkTable.removeChild(linkTable.firstChild); //Remove all current links
	buildPopupAfterResponse = true;
	UpdateFeed();
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

