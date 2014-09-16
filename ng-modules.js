var fs = require('fs');
require('array-sugar');

var glob = require('glob');
var createModule = function(pathToJSON) {
	var relativeTo = pathToJSON.substring(0, pathToJSON.lastIndexOf('/') + 1);
	var cwd = process.cwd();
	process.chdir(relativeTo);
	var moduleString;
	try{
		moduleString = fs.readFileSync(pathToJSON.substring(pathToJSON.lastIndexOf('/') + 1), 'utf8');
	}catch(err){
		console.error("Error reading file " + pathToJSON);
		throw err;
	}
	console.log("parsing JSON: " + pathToJSON);

	var moduleDef = JSON.parse(moduleString);
	var scriptsArr = [];

	if (Array.isArray(moduleDef.submodules)) {
		scriptsArr = scriptsArr.concat(moduleDef.submodules.forEach(createModule));
	}

	if (Array.isArray(moduleDef.globs)) {
		moduleDef.globs.forEach(function (globExp){
			var files = glob.sync(globExp);
			files.forEach(function (file, i){
			    files[i] = relativeTo + file;
			});
			scriptsArr = scriptsArr.concat(files);
		});
	}

	process.chdir(cwd);

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
	var item;
	while(item = splitted.pop()) {
		var srcIndex = item.indexOf('src=');
		if (srcIndex !== -1) {
			//this is a proper module element with src attribute
			item = item.substr(srcIndex + 5);
			var path = relativeToHtml + item.substr(0, item.indexOf('"'));

			var scripts = createModule(path, relativeToHtml);
			scripts.forEach(function (script){
			    scriptElements += '<script src="' + script + ' "></script>'
			});

		} else {

		}
	}

	console.log("all script elements added are");
	console.log(scriptElements);

};