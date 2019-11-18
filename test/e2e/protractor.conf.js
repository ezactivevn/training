var failFast = require('protractor-fail-fast');
	
exports.config = {
	allScriptsTimeout: 11000,
	specs: [
		'./src/booking.ts',
	],

	plugins: [
		failFast.init(),
	],

	capabilities: {
		'browserName': 'chrome',
		chromeOptions: {
			args: ['--no-sandbox']
		}
	},
	directConnect: true,
	baseUrl: 'http://localhost:4200/',
	framework: 'jasmine',

	jasmineNodeOpts: {
		showColors: true,
		defaultTimeoutInterval: 30000,
		print: function() {}
	},
	useAllAngular2AppRoots: true,

	beforeLaunch: function() {
		require('./src/data/setup');
		require('ts-node').register({
			project: './tsconfig.e2e.json'
		});
		require('connect')().use(require('serve-static')('www')).listen(4200);
	},

	afterLaunch: function() {
		failFast.clean(); // Cleans up the "fail file" (see below) 
	},
  
	onPrepare() {
		// https://www.npmjs.com/package/protractor-beautiful-reporter
		// https://github.com/Evilweed/protractor-beautiful-reporter
		var HtmlReporter = require('protractor-beautiful-reporter');
		jasmine.getEnv().addReporter(new HtmlReporter({
			preserveDirectory: false,
			baseDirectory: './screenshots',
			screenshotsSubfolder: 'images',
			jsonsSubfolder: 'jsons',
			docName: 'index.html',
			docTitle: 'SG Basketball App Report'
		}).getJasmine2Reporter());
	}
};
