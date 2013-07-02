$(function(){
  restoreOptions();
  $('.notifications-radio, .background-tabs-radio, #RequestInterval').change(function(){
    saveOptions();
  });
});
var selectReqInterval;
var radioNotifications;
var radioBackgroundTabs;

function initVariables() {
  selectReqInterval = document.getElementById("RequestInterval");
  radioNotifications = document.getElementsByName("Notifications");
  radioBackgroundTabs = document.getElementsByName("BackgroundTabs");
}

function restoreOptions() {
  initVariables();
  var reqInterval = localStorage["FS.RequestInterval"];
  for (var i=0; i<selectReqInterval.children.length; i++) {
    if (selectReqInterval[i].value == reqInterval) {
      selectReqInterval[i].selected = "true";
      break;
    }
  }
  var notifications = localStorage["FS.Notifications"];
  for (var i=0; i<radioNotifications.length; i++) {
    if (radioNotifications[i].value == notifications) {
      radioNotifications[i].checked = "true";
    }
  }
  var backgroundTabs = localStorage["FS.BackgroundTabs"];
  for (var i=0; i<radioBackgroundTabs.length; i++) {
    if (radioBackgroundTabs[i].value == backgroundTabs) {
      radioBackgroundTabs[i].checked = "true";
    }
  }
}

function saveOptions() {
  var interval = selectReqInterval.children[selectReqInterval.selectedIndex].value;
  localStorage["FS.RequestInterval"] = interval;

  for (var i=0; i<radioNotifications.length; i++) {
    if (radioNotifications[i].checked) {
      localStorage["FS.Notifications"] = radioNotifications[i].value;
      break;
    }
  }

  for (var i=0; i<radioBackgroundTabs.length; i++) {
    if (radioBackgroundTabs[i].checked) {
      localStorage["FS.BackgroundTabs"] = radioBackgroundTabs[i].value;
      break;
    }
  }
}

