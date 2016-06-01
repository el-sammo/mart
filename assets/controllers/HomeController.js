(function() {
	'use strict';

	var app = angular.module('app');

	///
	// Controllers: Home
	///
	app.controller('HomeController', controller);
	
	controller.$inject = [
		'$scope', '$http', '$routeParams', '$rootScope', '$window', 
		'signupPrompter', 'customerMgmt', 'deviceMgr', 'layoutMgmt'
	];

	function controller(
		$scope, $http, $routeParams, $rootScope, $window,
		signupPrompter, customerMgmt, deviceMgr, layoutMgmt
	) {

		if(deviceMgr.isBigScreen()) {
			$scope.bigScreen = true;
		} else {
			$scope.bigScreen = false;
		}

		var getSessionPromise = customerMgmt.getSession();
		getSessionPromise.then(function(sessionData) {

			if(sessionData.customerId) {
				$rootScope.customerId = sessionData.customerId;
				$scope.customerId = $rootScope.customerId;
				$scope.tmplShow = 'pos';
			} else {
				layoutMgmt.logIn();
			}

		});

	}

}());
