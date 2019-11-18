var app = angular.module('reset_passwordApp', []);

app.controller('reset_passwordCtrl', function($scope, $rootScope, $http) {
	
	$scope.reset_passwordData = {};
	$scope.reset_password = false;
	$scope.reset_password = function(form) {
		// console.log('forgotPasswordCtrl: ' + $scope.reset_passwordData.email);

		if (typeof $scope.reset_passwordData.email === 'undefined' || $scope.reset_passwordData.email === '') {
			BootstrapDialog.show({
              	title: 'ERROR',
                type: BootstrapDialog.TYPE_WARNING,
                message: "Email can not be empty!"
        	});
		} else {
			//alert("Data: " + $.param($scope.loginData));
			$http({
				method  : 'POST',
				url     : SERVER_PATH + "resetPassword",
				data    : $.param($scope.reset_passwordData),
				headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
			})
			.success(function(response) {			
				// console.log('status: ' + response.status);
		    	if (response.status === 'OK') {
               		BootstrapDialog.show({
                		title: 'Information',
                		type: BootstrapDialog.TYPE_SUCCESS,
                		message: response.message,
                		onhidden: function(dialogRef) {
                    		location.href='login.html';
                		}
	           		});
			    } else {
        	       	BootstrapDialog.show({
                		title: 'ERROR',
                		type: BootstrapDialog.TYPE_WARNING,
                		message: response.message
           			});
		    	}
			});
		}
	};
})
