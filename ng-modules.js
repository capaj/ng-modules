var fs = require('fs');
require('array-sugar');

var glob = require('glob');
var createModule = function(pathToJSON, relativeTo) {
	if (!relativeTo) {
		relativeTo = '';
	}

	var moduleString;
	try{
		//var path = pathToJSON.substring(pathToJSON.lastIndexOf('/') + 1);
		moduleString = fs.readFileSync(pathToJSON, 'utf8');
	}catch(err){
		console.error("Error reading file " + pathToJSON);
		throw err;
	}
	console.log("parsing JSON: " + pathToJSON);

	var moduleDef = JSON.parse(moduleString);
	var scriptsArr = [];

	if (Array.isArray(moduleDef.submodules)) {
		moduleDef.submodules.forEach(function(sub) {
			var dir = relativeTo + sub.substring(0, sub.lastIndexOf('/') + 1);

			scriptsArr = scriptsArr.concat(createModule(relativeTo + sub, dir));
		});

	}

	if (Array.isArray(moduleDef.globs)) {
		moduleDef.globs.forEach(function (globExp){
			var files = glob.sync(relativeTo + globExp);
			files.forEach(function (file, i){
			    files[i] = file;
			});
			scriptsArr = scriptsArr.concat(files);
		});
	}

	return scriptsArr;
};

/**
 * @param {String} filename
 * @param {String} to name of the file to create
 */
module.exports = function(filename, to) {
	var scriptElements = '';
	var relativeToHtml = filename.substring(0, filename.lastIndexOf('/') + 1);

	var f = fs.readFileSync(filename, 'utf8');
	var splitted = f.split(/<ng-module/g);
	if (splitted.last.length === 0) {
		console.error("ng-module element should not be at the very end of your html document");
	}

	var cwd = process.cwd();
	process.chdir(relativeToHtml);

	var item;
	while(item = splitted.pop()) {
		var srcIndex = item.indexOf('src=');
		if (srcIndex !== -1) {
			//this is a proper module element with src attribute
			item = item.substr(srcIndex + 5);

			var jsonPath = item.substr(0, item.indexOf('"'));
			var dir = jsonPath.substring(0, jsonPath.lastIndexOf('/') + 1);

			var scripts = createModule(jsonPath, dir);
			scripts.forEach(function (script){
			    scriptElements += '<script src="' + script + ' "></script>'
			});

		} else {
			throw 'ng-module element lacks required src attribute';
		}
	}


	process.chdir(cwd);

	console.log("all script elements added are");
	console.log(scriptElements);

};