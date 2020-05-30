// This code will fetch and load the service worker from sw.js that is located at the scope of the website (root).
if (!navigator.serviceWorker.controller) {
	navigator.serviceWorker.register("/sw.js").then(function(reg) {
		console.log("Service worker has been registered for scope: " + reg.scope);
	});
}