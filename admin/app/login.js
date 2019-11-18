var app = angular.module('sgbApp', []);
app.controller('loginCtrl', function($scope, $rootScope, $http) {
	
	// Le Quyet Tien - 22/06/2016	
	// login
	$scope.loginData = {};
	$scope.login = false;
	$scope.login = function(form) {
		
		if (typeof $scope.loginData.email === 'undefined' || typeof $scope.loginData.password === 'undefined') {
			BootstrapDialog.show({
              	title: 'ERROR',
                type: BootstrapDialog.TYPE_WARNING,
                message: "Email or password can not be empty!"
            });
			    // alert("Email or password can not be empty!");
		
		} else if ($scope.loginData.email != '' && $scope.loginData.password != '' 
							&& $scope.loginData.email != 'undefined') {
			//alert("Data: " + $.param($scope.loginData));
			$http({
				method  : 'POST',
				url     : SERVER_PATH + "login",
				data    : $.param($scope.loginData),
				headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
			})
			.success(function(response) {				
			    if (response.status == "OK") {
                	location.href='index.html?id=' + response.info.base64;
			    	// location.href='index.html?id=' + response.info.md5;
			    } else {
                	// alert(response.message);
                	BootstrapDialog.show({
                		title: 'ERROR',
                		type: BootstrapDialog.TYPE_WARNING,
                		message: response.message
            		});
			    }
            });
		} else {
			
			BootstrapDialog.show({
              	title: 'ERROR',
                type: BootstrapDialog.TYPE_WARNING,
                message: "Email or password can not be empty!"
            });
			// alert("Email or password can not be empty!");
		}
	};
})
