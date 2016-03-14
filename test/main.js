/*global describe, it*/
"use strict";

var htmlDripChar = require("../"),
	fs = require("fs"),
	gulp = require('gulp'),
	should = require("should");

var File = require('gulp-util').File;
var Buffer = require('buffer').Buffer;

require("mocha");

delete require.cache[require.resolve("../")];

describe('gulp-html-drip-char', function() {
	describe('htmlDripChar()', function() {
		it('should concat two files', function(done) {
			var stream = htmlDripChar();
			var fakeFile = new File({
				cwd: "/home/HAKASHUN/",
				base: "/home/HAKASHUN/test",
				path: "/home/HAKASHUN/test/file.html",
				contents: new Buffer("jubilo")
			});

			var fakeFile2 = new File({
				cwd: "/home/HAKASHUN/",
				base: "/home/HAKASHUN/test",
				path: "/home/HAKASHUN/test/file2.html",
				contents: new Buffer("iwata")
			});

			stream.on('data', function(newFile) {
				should.exist(newFile);
				should.exist(newFile.path);
				should.exist(newFile.relative);
				should.exist(newFile.contents);
				String(newFile.contents).should.equal('jubilowat');
				Buffer.isBuffer(newFile.contents).should.equal(true);
				done();
			});

			stream.write(fakeFile);
			stream.write(fakeFile2);
			stream.end();
		});
	});
});
