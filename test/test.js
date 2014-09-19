var ngModules = require('../ng-modules');

var fs = require('fs');

module.exports = {
	basic: function(test) {
		ngModules('./test/index_template.html', 'index.html');

		var ind = fs.readFileSync('./test/index.html', 'utf8');
		var i = ind.indexOf('<script src="js/1.js">');
		test.notEqual(i , -1);
		test.done();
	}
};