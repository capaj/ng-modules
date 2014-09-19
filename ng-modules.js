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
	var scriptsArr = [{start: true, src: pathToJSON}];

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

	scriptsArr.push({src: pathToJSON});

	return scriptsArr;
};

/**
 * @param {String} filename
 * @param {String} to name of the file to create
 */
module.exports = function(filename, to) {

	var relativeToHtml = filename.substring(0, filename.lastIndexOf('/') + 1);

	var html = fs.readFileSync(filename, 'utf8');
	var moduleElements = html.match(/<ngmodule src="([^"]+)">\s*<\/ngmodule>/g);
	if (moduleElements.last.length === 0) {
		console.error("ng-module element should not be at the very end of your html document");
	}

	var cwd = process.cwd();
	process.chdir(relativeToHtml);

	/**
	 * type <String> moduleElement
	 */
	var mEl;

	while(mEl = moduleElements.pop()) {
		var indentation = 1;

		var appendNL = function(nl) {
			toInsert += '\r\n' + Array(indentation + 1).join('\t') + nl;
		};
		var toInsert = '';	//the string we will insert into HTML

		var jsonPath = mEl.substring(mEl.indexOf('"') + 1, mEl.lastIndexOf('"'));
		var dir = jsonPath.substring(0, jsonPath.lastIndexOf('/') + 1);

		var scripts = createModule(jsonPath, dir);
		scripts.forEach(function (script){
			if (typeof script === 'object') {
				if (script.start) {
					appendNL('<ngmodule src="' + script.src + '">');
					indentation++;
				} else {
					indentation--;
					appendNL('</ngmodule>');
				}
			} else {
				appendNL('<script src="' + script + '"></script>');
			}
		});

		html = html.replace(mEl, toInsert);


	}

	fs.writeFileSync(to, html, 'utf8', function(e) {
		if (e) {
			console.error("file succesfully written");
		}
		console.log("file succesfully written");
	});


	process.chdir(cwd);

	//console.log("all script elements added are");
	//console.log(toInsert);

};