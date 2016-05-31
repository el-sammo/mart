(function() {
	'use strict';

	var app = angular.module('app');

	///
	// Layout Controller
	///


	app.controller('LayoutController', controller);
	
	controller.$inject = [
		'navMgr', 'pod', '$scope', '$window',
		'$http', '$routeParams', '$modal', 'layoutMgmt',
		'$rootScope', 'customerMgmt', 'deviceMgr',
		'signupPrompter', 'catMgmt', 'itemMgmt', 'orderMgmt'
	];

	function controller(
		navMgr, pod, $scope, $window,
		$http, $routeParams, $modal, layoutMgmt,
		$rootScope, customerMgmt, deviceMgr,
		signupPrompter, catMgmt, itemMgmt, orderMgmt
	) {

		if(deviceMgr.isBigScreen()) {
			$scope.bigScreen = true;
		} else {
			$scope.bigScreen = false;
		}

		$scope.showMenu = false;

		$scope.menuClicked = function(forceValue) {
			if(! _.isUndefined(forceValue)) {
				$scope.showMenu = forceValue;
				return;
			}
			$scope.showMenu = !$scope.showMenu;
		}

		$scope.showLogout = false;
		$scope.accessAccount = false;

		$scope.home = function() {
			$window.location.href = location.origin + "/app/";
		}

		var sessionPromise = customerMgmt.getSession();
		sessionPromise.then(function(sessionData) {
			if(sessionData.customerId) {
				$scope.showLogout = true;
				$scope.accessAccount = true;
				$scope.customerId = sessionData.customerId;
			}

			$scope.showAccount = function() {
				$window.location.href = location.origin + "/app/account";
			}

			$scope.logIn = layoutMgmt.logIn;
			$scope.logOut = layoutMgmt.logOut;
			$scope.signUp = layoutMgmt.signUp;

		});

		function capitalizeFirstLetter(string) {
			return string.charAt(0).toUpperCase() + string.slice(1);
		}

		$rootScope.$on('customerLoggedIn', function(evt, args) {
			$scope.showLogout = true;
			$scope.accessAccount = true;
			$scope.customerId = args;
			$rootScope.$broadcast('orderChanged');
		});

		$scope.showCategories = function() {
			var getCatsPromise = catMgmt.getCats();
			getCatsPromise.then(function(catsData) {
				$scope.catsData = catsData;
				$scope.tmplShow = 'categories';
			});
		}

		$scope.showItems = function(category) {
			var getItemsByCategoryPromise = itemMgmt.getItemsByCategory(category);
			getItemsByCategoryPromise.then(function(itemsData) {
				$scope.itemsData = itemsData;
				$scope.tmplShow = 'items';
			});
		}

		$scope.showItem = function(itemId) {
			var getItemPromise = itemMgmt.getItem(itemId);
			getItemPromise.then(function(itemData) {
				$scope.itemData = itemData;
				$scope.tmplShow = 'item';
			});
		}

		$scope.showPOS = function() {
			$scope.tmplShow = 'pos';
		}

	}

}());
