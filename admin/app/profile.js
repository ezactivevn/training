app.controller('profileCtrl', function($scope, $rootScope, $http){
	$('#page-wrapper').removeClass('nav-small');

	console.log('profileCtrl');
	
	$scope.passwordData = {};
	$scope.password = false;
	$scope.password = function(form) {
		
		if (typeof $scope.passwordData.old_password === 'undefined' || $scope.passwordData.old_password === '') {
			BootstrapDialog.show({
              	title: 'ERROR',
                type: BootstrapDialog.TYPE_WARNING,
                message: "Old password can not be empty!"
        	});
		} else if (typeof $scope.passwordData.new_password === 'undefined' || $scope.passwordData.new_password === '') {
			BootstrapDialog.show({
              	title: 'ERROR',
                type: BootstrapDialog.TYPE_WARNING,
                message: "New password can not be empty!"
        	});
		} else if (typeof $scope.passwordData.rnew_password === 'undefined' || $scope.passwordData.rnew_password === '') {
			BootstrapDialog.show({
              	title: 'ERROR',
                type: BootstrapDialog.TYPE_WARNING,
                message: "New password must be retyped!"
        	});
		} else {
			$http({
				method  : 'POST',
				url     : SERVER_PATH + "changePassword",
				data    : $.param($scope.passwordData) + '&id=' + $rootScope.user_id,
				headers : { 'Content-Type': 'application/x-www-form-urlencoded' }
			})
			.success(function(response) {			
				console.log('status: ' + response.status);
		    	if (response.status === 'OK') {
               		BootstrapDialog.show({
                		title: 'Information',
                		type: BootstrapDialog.TYPE_SUCCESS,
                		message: response.message,
                		onshow: function(dialogRef) {
                    		$('#btnClose').trigger("click");
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
	