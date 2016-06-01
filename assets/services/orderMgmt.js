(function() {
	'use strict';

	var app = angular.module('app');

	///
	// Order Management
	///

	app.factory('orderMgmt', service);
	
	service.$inject = [
		'$http', '$q', 'configMgr',	'$modal', '$rootScope'
	];
	
	function service(
		$http, $q, configMgr, $modal, $rootScope
	) {

// TODO have orders exist with an sid and a status of paid/not
// the current order should be the one with the sid and unpaid status

		var order;
		var getOrderBySIDPromise;
		var createOrderPromise;

		var service = {
			checkout: function(order) {
				$modal.open({
					templateUrl: '/templates/checkout.html',
					backdrop: true,
					controller: 'CheckoutController',
					resolve: {
						args: function() {
							return {
								order: order
							}
						}
					}
				});
			},

			remove: function(thing) {
				$modal.open({
					templateUrl: '/templates/removeItemOptions.html',
					backdrop: true,
					controller: 'OrderMgmtController',
					resolve: {
						args: function() {
							return {
								thing: thing
							}
						}
					}
				});
			},

			getOrderBySID: function(sid) {
				var url = '/orders/bySID/' + sid;
				getOrderBySIDPromise = $http.get(url).then(function(res) {
					return res.data[0];
				}).catch(function(err) {
					console.log('GET ' + url + ': ajax failed');
					console.error(err);
					return $q.reject(err);
				});

				return getOrderBySIDPromise;
			},

			createOrder: function(orderData) {
				var url = '/orders/create';
				return $http.post(url, orderData).success(
					function(data, status, headers, config) {
						if(status >= 400) {
							return $q.reject(data);
						}
						mergeIntoOrder(data, true);
						return order;
					}
				).catch(function(err) {
					console.log('POST ' + url + ': ajax failed');
					console.error(err);
					return $q.reject(err);
				});
			},

			updateOrder: function(orderData) {
				var url = '/orders/' + orderData.id;
				return $http.put(url, orderData).success(
					function(data, status, headers, config) {
						if(status >= 400) {
							return $q.reject(data);
						}
						mergeIntoOrder(data, true);
						return order;
					}
				).catch(function(err) {
					console.log('PUT ' + url + ': ajax failed');
					console.error(err);
					return $q.reject(err);
				});
			},

		};

		function mergeIntoOrder(data, replace) {
			if(! order) {
				order = data;
				return;
			}

			// Delete all original keys
			if(replace) {
				angular.forEach(order, function(val, key) {
					delete order[key];
				});
			}

			angular.forEach(data, function(val, key) {
				order[key] = val;
			});
		};

		return service;
	}

}());
