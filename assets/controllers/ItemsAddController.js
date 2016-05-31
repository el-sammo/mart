(function() {
	'use strict';

	var app = angular.module('app');

	///
	// Controllers: ItemsAdd
	///
	app.controller('ItemsAddController', controller);
	
	controller.$inject = [
		'$scope', '$http', '$routeParams', '$rootScope', '$window', 
		'messenger', 'customerMgmt', 'deviceMgr', 'signupPrompter',
		'catMgmt', 'itemMgmt', 'itemSchema'
	];

	function controller(
		$scope, $http, $routeParams, $rootScope, $window,
		messenger, customerMgmt, deviceMgr, signupPrompter,
		catMgmt, itemMgmt, itemSchema
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
					$scope.data = {
						repeatSelect: null,
						availableOptions: catData
					}
				});

			}

		});

		$scope.itemSchema = itemSchema;
		$scope.item = itemSchema.populateDefaults({});

		$scope.save = function() {
			var createItemPromise = itemMgmt.createItem($scope.item);
			createItemPromise.then(function(res) {
				if(res && res.statusText && res.statusText === 'OK') {
					messenger.show($scope.item.name +' added', '');
				} else {
					messenger.show('Item FAILED', '');
				}
			});
		}

	}

}());
