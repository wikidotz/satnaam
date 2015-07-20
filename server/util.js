// a function to load json data from a file
var fs = require('fs');
var DEFAULT_ENCODING = 'utf8';
var loadJSONfile = function(filename, encoding) {
	try {
		// default encoding is utf8
		if (typeof (encoding) == 'undefined') encoding = DEFAULT_ENCODING;
		
		// read file synchroneously
		var contents = fs.readFileSync('./server/data/'+filename, encoding);

		// parse contents as JSON
		console.log("content["+contents+"]");
		return JSON.parse(contents);
		
	} catch (err) {
		// an error occurred
		throw err;	
	}
} // loadJSONfile

module.exports.loadJSONfile = loadJSONfile;
