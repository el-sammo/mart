(function() {
	'use strict';

	var app = angular.module('app');

	///
	// Controllers: ItemsAdd
	///
	app.controller('ItemsAddController', controller);
	
	controller.$inject = [
		'$scope', '$http', '$routeParams', '$rootScope', '$window', 
		'customerMgmt', 'deviceMgr', 'catMgmt', 'itemMgmt',
		'signupPrompter'
	];

	function controller(
		$scope, $http, $routeParams, $rootScope, $window,
		customerMgmt, deviceMgr, catMgmt, itemMgmt,
		signupPrompter
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

				var getCatsPromise = catMgmt.getCats();
				getCatsPromise.then(function(catData) {
					$scope.catData = catData;
				});

			}

		});

	}

}());
