var ngModules = require('../ng-modules');

var fs = require('fs');

module.exports = {
	basic: function() {
		ngModules('./test/index_template.html', 'index.html');

		var ind = fs.readFileSync('./test/index.html');
		expect(ind.indexOf('<script src="1.js">')).to.not.equal(-1);

	}
};