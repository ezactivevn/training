/**
 * Cube - Bootstrap Admin Theme
 * Copyright 2014 Phoonio
 */

var app = angular.module('sgbApp', [
	'ngRoute',
	'angular-loading-bar',
	'ngAnimate'
]);

app.config(['cfpLoadingBarProvider', function (cfpLoadingBarProvider) {

	console.log('app.config - cfpLoadingBarProvider');

	cfpLoadingBarProvider.includeBar = true;
	cfpLoadingBarProvider.includeSpinner = true;
	cfpLoadingBarProvider.latencyThreshold = 100;
}]);

/**
 * Configure the Routes
 */
app.config(['$routeProvider', function ($routeProvider) {

	console.log('app.config - routeProvider');

	$routeProvider
		// Default
		.when("/", {
			redirectTo: '/dashboard'
		})

		// Dashboard
		.when("/dashboard", {
			templateUrl: "views/dashboard.html",
			controller: "dashboardCtrl",
			title: 'Dashboard'
		})

		// Tables
        .when("/tables/user_editor", {
			templateUrl: "views/user_editor.html",
			controller: "tablesCtrl", 
			title: 'Users'
		})

		// System
		.when("/profile", {
			templateUrl: "views/profile.html",
			controller: "profileCtrl",
			title: 'Profile'
		})

		.when("/logout", {
			templateUrl: "views/frontend.html",
			controller: "logoutCtrl",
			title: 'Logout'
		})

		.when("/error-404", {
			templateUrl: "views/error-404.html",
			controller: "mainCtrl",
			title: 'Error 404'
		})

		.otherwise({
			redirectTo: '/error-404'
		});
}]);

app.run(['$location', '$rootScope', '$http', function ($location, $rootScope, $http) {
	// check permission
	$rootScope.$on('$routeChangeStart', function (event, next, current) {
		console.log(next);
		if ($rootScope.user_role != undefined) {
			var next_route = next.$$route.controller;
			if ($rootScope.user_role == USER_ADMINISTRATOR && (USER_ADMINISTRATOR_PERMISSION.includes(next_route) == false))
				$location.path("/error-404");
		}
	});

	$rootScope.$on('$routeChangeSuccess', function (event, current, previous) {
		$rootScope.title = current.$$route.title;
	});

	console.log('app.run');

	// Phan Viet Hoang - 02/07/16 - get user data for header
	var absUrl = $location.absUrl();
	var idx = absUrl.indexOf("=");

	console.log('app.run - absUrl = ' + absUrl);

	if (idx == -1) {
		// must go to login
		location.href = 'login.html';
		return;
	}

	var idx_pound = absUrl.indexOf("#", idx + 1);

	// alert('idx_pound = ' + idx_pound);

	if (idx_pound > 0)
		base64 = absUrl.substring(idx + 1, idx_pound);
	else
		base64 = absUrl.substring(idx + 1);

	console.log('base64 = ' + base64);

	try {
		str = atob(base64);
	} catch (err) {
		console.log('message = ' + err.message);
		BootstrapDialog.show({
			title: 'ERROR',
			type: BootstrapDialog.TYPE_WARNING,
			message: "Please log in again!"
		});

		// must go to login
		location.href = 'login.html';
		return;
	}

	// get id and time
	var vals = str.split("|");
	user_id = vals[0];

	console.log('And user id = ' + user_id);

	$rootScope.user_id = user_id;
	$rootScope.getUser = function () {
		$http({
				method: "POST",
				url: SERVER_PATH + "getInfoUser",
				data: "user_id=" + $rootScope.user_id + '&ss_id=' + vals[2],
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded'
				}
			})
			.success(function (response) {
				console.log(response);
				if (response.status == "OK") {
					$rootScope.user_name = response.info.first_name + ' ' + response.info.last_name;
					$rootScope.user_role = response.info.role;
					$rootScope.initSideMenu();
				} else {
					alert(response.message);
					location.href = 'login.html';
					return;
				}
			});
	};

	$rootScope.initSideMenu = function() {

		// Tables
		var html_tables_component =
			'<a href="" class="dropdown-toggle">' +
				'<i class="fa fa-table"></i>' +
				'<span>Tables</span>' +
				'<i class="fa fa-angle-right drop-icon"></i>' +
			'</a>' +
			'<ul class="submenu">' +
				'<li>' +
					'<a data-match-route="/tables/user_editor" href="#/tables/user_editor">' +
						'Users' +
					'</a>' +
				'</li>' +
			'</ul>';

		// Administrator
		if ($rootScope.user_role == USER_ADMINISTRATOR) {
			$('#tablesContent').html(html_tables_component);
		}
        
    };

	$rootScope.getUser();

	console.log('app.run - before return');

	// override confirm function to implement more options, make sure to place after BootstrapDialog.js file is loaded
	BootstrapDialog.confirm = function () {
		var options = {};
		var defaultOptions = {
			type: BootstrapDialog.TYPE_PRIMARY,
			title: null,
			message: null,
			closable: false,
			draggable: false,
			btnCancelLabel: BootstrapDialog.DEFAULT_TEXTS.CANCEL,
			btnOKLabel: BootstrapDialog.DEFAULT_TEXTS.OK,
			btnOKClass: null,
			onshown: null,
			callback: null
		};
		if (typeof arguments[0] === 'object' && arguments[0].constructor === {}.constructor) {
			options = $.extend(true, defaultOptions, arguments[0]);
		} else {
			options = $.extend(true, defaultOptions, {
				title: arguments[0],
				message: arguments[1],
				closable: false,
				buttonLabel: BootstrapDialog.DEFAULT_TEXTS.OK,
				callback: typeof arguments[2] !== 'undefined' ? arguments[2] : null
			});
		}
		if (options.btnOKClass === null) {
			options.btnOKClass = ['btn', options.type.split('-')[1]].join('-');
		}

		return new BootstrapDialog({
			type: options.type,
			// title: options.title,
			title: options.title,
			message: options.message,
			closable: options.closable,
			draggable: options.draggable,
			size: options.size, //<-- added size
			onshown: options.onshown, //<-- added onshown callback
			tabindex: false,
			data: {
				callback: options.callback
			},
			buttons: [{
				label: options.btnCancelLabel,
				action: function (dialog) {
					if (typeof dialog.getData('callback') === 'function' && dialog.getData('callback').call(this, false) === false) {
						return false;
					}
					return dialog.close();
				}
			}, {
				label: options.btnOKLabel,
				cssClass: options.btnOKClass,
				action: function (dialog) {
					if (typeof dialog.getData('callback') === 'function' && dialog.getData('callback').call(this, true) === false) {
						return false;
					}
					return dialog.close();
				}
			}]
		}).open();
	};


}]);

app.controller('mainCtrl', function ($scope, $rootScope, $http, $location) {
	$('#page-wrapper').removeClass('nav-small');
	// do nothing for now. DO NOT remove

	console.log('app.controller - mainCtrl');
});

app.controller('logoutCtrl', function ($scope, $rootScope, $http, $location) {
	$('#page-wrapper').removeClass('nav-small');
	// do nothing for now. DO NOT remove

	console.log('app.controller - logoutCtrl - user_id: ' + $rootScope.user_id);

	$http({
			method: 'POST',
			url: SERVER_PATH + "logout",
			data: 'user_id=' + $rootScope.user_id,
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded'
			}
		})
		.success(function (response) {
			if (response.status == "OK") {} else {
				// alert(response.message);
				BootstrapDialog.show({
					title: 'ERROR',
					type: BootstrapDialog.TYPE_WARNING,
					message: response.message
				});
			}
		});
});
