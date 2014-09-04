var fs = require('fs');

var createModule = function(pathToJSON) {

};

/**
 * @param {String} filename
 */
module.exports = function(filename) {
	var scriptsToAdd = [];

	var f = fs.readAsText(filename);
	var splitted = f.split(/<ng-module/g);
	if (splitted.last.length === 0) {
		console.error("ng-module element should not be at the very end of your html document");
	}
	var item;
	while(item = splitted.pop()) {
		var srcIndex = item.indexOf('src=');
		if (srcIndex !== -1) {
			//this is a proper module element with src attribute
			item = item.substr(srcIndex);
			var path = item.substr(0, item.indexOf('"'));
			console.log("loading JSON: " + path);
			var scripts = createModule(path);


		} else {

		}
	}

};