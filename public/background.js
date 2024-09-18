if (typeof browser === "undefined") {
    var browser = chrome;
  }
  
  browser.action.onClicked.addListener(function() {
    browser.tabs.create({ url: 'index.html' });
  });