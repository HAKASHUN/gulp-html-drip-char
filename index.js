var through = require('through');
var path = require('path');
var gutil = require('gulp-util');
var PluginError = gutil.PluginError;
var File = gutil.File;
var Buffer = require('buffer').Buffer;
var htmlDripChar = require('html-drip-char');
var _ = require('underscore');
var _s = require('underscore.string');

module.exports = function(){
	var characters = [];
	var firstFile = null;

	function bufferContents(file){
		if (file.isNull()) return; // ignore
		if (file.isStream()) return this.emit('error', new PluginError('gulp-html-drip-char',  'Streaming not supported'));
		if (!firstFile) firstFile = file;
		var result = htmlDripChar.fromString(file.contents);
		characters.push(result);
	}

	function endStream(){
		if (characters.length === 0) return this.emit('end');
		var results = _.flatten(characters).join('');
		var uniqueCharacters = _.uniq(_s.chop(results, 1)).join('');
		var joinedContents = new Buffer(uniqueCharacters);
		var joinedPath = path.join(firstFile.base);
		var joinedFile = new File({
			cwd: firstFile.cwd,
			base: firstFile.base,
			path: joinedPath,
			contents: joinedContents
		});

		this.emit('data', joinedFile);
		this.emit('end');
	}

	return through(bufferContents, endStream);
};
