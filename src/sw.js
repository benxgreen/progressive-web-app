self.addEventListener("install", function(event) {
	event.waitUntil(preLoad());
  });
  
  var preLoad = function(){
	console.log("Installing web app");
	return caches.open("offline").then(function(cache) {
	  console.log("Caching home-page and most visited pages for optimisation");
	//   In the below string, put any pages that you want to be pre-loaded and stored in the cache for the browser to hold even when the device has no internet connection. Ensure that your offline page is pre-loaded so that this is loaded when the device loses connectivity.
	  return cache.addAll(["/", "/offline.html"]);
	});
  };
  
  self.addEventListener("fetch", function(event) {
	event.respondWith(checkResponse(event.request).catch(function() {
	  return returnFromCache(event.request);
	}));
	event.waitUntil(addToCache(event.request));
  });
  
  var checkResponse = function(request){
	return new Promise(function(fulfill, reject) {
	  fetch(request).then(function(response){
		if(response.status !== 404) {
		  fulfill(response);
		} else {
		  reject();
		}
	  }, reject);
	});
  };
  
  var addToCache = function(request){
	return caches.open("offline").then(function (cache) {
	  return fetch(request).then(function (response) {
		console.log(response.url + " was cached");
		return cache.put(request, response);
	  });
	});
  };
  
  var returnFromCache = function(request){
	return caches.open("offline").then(function (cache) {
	  return cache.match(request).then(function (matching) {
	   if(!matching || matching.status == 404) {
		//    Redirect the browser client to the offline page when there is a 404 page.
		 return cache.match("/offline.html");
	   } else {
		 return matching;
	   }
	  });
	});
  };