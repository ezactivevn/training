
// https://medium.com/@siddhartha.ng/ionic-3-import-using-aliases-2aa260d6fab3

const path = require('path');
const useDefaultConfig = require('@ionic/app-scripts/config/webpack.config.js');
const env = process.env.IONIC_ENV;
const baseUrl = "c:/dev/temp/rugby/client/src";

useDefaultConfig[env].resolve.alias = {
    "@app": path.resolve('./src/app/'),
	"@pages": path.resolve(baseUrl + '/pages/'),
	"@services": path.resolve('./src/services/'),
};

module.exports = function () {
    return useDefaultConfig;
};

// tsconfig.json

	// "baseUrl": "./src",
	// "paths": {
    //   "@app/*": [
    //     "app/*"
    //   ],
    //   "@pages/*": [
    //     "pages/*"
    //   ],
    //   "@services/*": [
    //     "services/*"
    //   ]
    // },

// package.json

// "config": {
// 	"ionic_source_map_type": "source-map",
// 	"ionic_webpack": "./webpack.config.js"
// },
