// https://stackoverflow.com/questions/50774649/reading-multiple-file-in-a-directory-one-by-one-in-node-js

const fs = require('fs');
const path = require('path');

const PHP_FILE = '.php';
const PHP_FOLDER = '../../server';
const fileOut = path.join(__dirname, 'result.txt');

var documents = [];
if (require.main === module) {
	build();
}

function walkSync (dir, filelist = []) {
    fs.readdirSync(dir).forEach(file => {
        const dirFile = path.join(dir, file);
        try {
            filelist = walkSync(dirFile, filelist);
        }
        catch (err) {
            if (err.code === 'ENOTDIR' || err.code === 'EBUSY') filelist = [...filelist, dirFile];
            else throw err;
        }
    });
    return filelist;
}

function build(filePath, counter) {
    // read all PHP files
	let dir = path.join(__dirname, PHP_FOLDER)
	let files = walkSync(dir);
	// console.log('Files = ', files);
	var counter = 0;
    let promises = files.map(file => {
		// console.log('file = ', file);
		if (file.endsWith(PHP_FILE))
			parseFile(file, ++counter);
	});

	Promise.all(promises).then(function(values) {
		console.log('values = ', values);
		setTimeout(function(){
			process();
		}, 4000);
	});
}

function parseFile(filePath, counter) {
	console.log("filePath = " + filePath);
	var content = fs.readFileSync(filePath);
	eval(filePath, content.toString());
}

function eval(filePath, content) {

	// var str = '--- ' + filePath + ' ---\n';
	var sqlLines = [];
	var lines = content.split(/\r\n|\n/);
	for (var il = 0; il < lines.length; il++) {
		var line = lines[il].trim();
		if (line.length == 0 || line.indexOf("//") != -1)
			continue;
		// search for SQL statement
		var lc = line.toLowerCase();
		if (lc.indexOf('->select') >= 0 || lc.indexOf('->join') >= 0 || lc.indexOf('->insert') >= 0 ||
			lc.indexOf('->update') >= 0 || lc.indexOf('->delete') >= 0) {
			if (lc.indexOf('admin->') >= 0 || lc.indexOf('client->') >= 0)
				sqlLines.push({line: line});
		} 
		// let vals = line.split(/\t/);
	}
	documents.push({file: filePath, sqlLines: sqlLines});
}

function process() {
	var str = '---------- \n';
	var str = '--- TOTAL PHP FILES : ' + documents.length + '\n\n';

	for (i = 0; i < documents.length; i++) {
		document = documents[i];
		str += document.file + '\n';
		let sqlLines =  document.sqlLines;
		for (j = 0; j < sqlLines.length; j++) {
			let line = sqlLines[j].line;
            // console.log('line - ', line);

			let maxLength = line.length > 100 ? 100 : line.length;
			// evaluate
			let errorMsg = '';
			var lc = line.toLowerCase();
			// check on RETURN
			if (lc.indexOf('->update') >= 0 || lc.indexOf('->delete') >= 0) {
				let equalIdx = lc.indexOf('=');
				if (equalIdx > 0 && equalIdx < lc.indexOf('->')) {
					errorMsg = '*';
				}
			} else if (lc.indexOf('->selectone') >= 0) {
				let idx = lc.indexOf('from ');
				let idx1 = idx + 5;
				let idx2 = lc.indexOf('where', idx1);
				let plural_table = lc.substring(idx1,idx2).trim();
				let single_table = plural_table.substring(0,plural_table.length-1);
				let equalIdx = lc.indexOf('=');
				if (lc.substring(0,equalIdx).indexOf(plural_table) > 0) {
					// can not have plural
					errorMsg = '#';
				} else if (lc.substring(0,equalIdx).indexOf(single_table) < 0) {
					// must have singular
					errorMsg = '#';
				}
			} else if (lc.indexOf('->select') >= 0) {
				let idx = lc.indexOf('from ');
				let idx1 = idx + 5;
				let idx2 = lc.indexOf('where', idx1);
				if (idx2 < 0)
					idx2 = lc.indexOf('"', idx1);
				let plural_table = lc.substring(idx1,idx2).trim();
				let equalIdx = lc.indexOf('=');
				if (lc.substring(0,equalIdx).indexOf(plural_table) < 0) {
					// must have plural
					errorMsg = '#';
				}
			} else if (lc.indexOf('->join') >= 0) {
				let idx = lc.indexOf('from ');
				let idx1 = idx + 5;
				let idx2 = lc.indexOf('join', idx1);
				let plural_table = lc.substring(idx1,idx2).trim();
				let equalIdx = lc.indexOf('=');
				if (lc.substring(0,equalIdx).indexOf(plural_table) < 0) {
					// must have plural
					errorMsg = '#';
				}
			}
			str += errorMsg + '   ' + line.substring(0,maxLength) + '\n';
		}
	}
	saveFile(fileOut, str);
}

function saveFile(filePath, text) {
    fs.writeFile(filePath, text, function(err) {
        if(err)
            console.log('ERROR - ', err);
        console.log('"The file : ' + filePath + ' was saved!');
    }); 
}
