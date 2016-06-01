(function() {
	'use strict';

	var app = angular.module('app');

	///
	// OrderController
	///

	app.controller('OrderController', controller);
	
	controller.$inject = [
		'navMgr', 'pod', '$scope', '$http', '$routeParams', 
		'$modal', 'orderMgmt', '$rootScope', '$q', 'layoutMgmt', 
		'clientConfig', 'customerMgmt', 'itemMgmt'
	];

	function controller(
		navMgr, pod, $scope, $http, $routeParams, 
		$modal, orderMgmt, $rootScope, $q, layoutMgmt, 
		clientConfig, customerMgmt, itemMgmt
	) {
		
		$scope.clientConfig = clientConfig;

		$scope.removeItem = orderMgmt.remove;

		$rootScope.$on('orderChanged', function(evt, args) {
			$scope.updateOrder();
		});

		///
		// Checkout Actions
		///

		$scope.checkout = function(order) {
			orderMgmt.checkout(order);
		};

		$scope.updateOrder = function() {
			var sessionPromise = customerMgmt.getSession();
			sessionPromise.then(function(sessionData) {
				var sid = sessionData.sid;
				var getOrderBySIDPromise = orderMgmt.getOrderBySID(sid);
				getOrderBySIDPromise.then(function(order) {
					if(order) {
						$scope.order = order;
						$scope.updateTotals(order);
					}
				});
			});
		};

		$scope.updateTotals = function(order) {
			var things;
			if(order.things) {
				things = order.things;
			} else {
				things = [];
			}
		
			var subtotal = 0;
			var tax = 0;
			// TODO this should be configged on the area level
			var taxRate = .05;
			var multiplier = 100;
			var total = 0;
		
			if(things.length > 0) {
				things.forEach(function(thing) {
					var lineTotal;
				
					if(thing.quantity && thing.quantity > 1) {
						lineTotal = parseFloat(thing.price) * thing.quantity;
					} else {
						lineTotal = parseFloat(thing.price);
					}
					subtotal = (Math.round((subtotal + lineTotal) * 100)/100);
				});
			}
		
			total = (subtotal + tax);
							
			$scope.subtotal = subtotal.toFixed(2);
			$scope.tax = tax.toFixed(2);
			$scope.total = total.toFixed(2);
							
			order.subtotal = subtotal;
			order.tax = tax;
			order.total = total;
							
			var updateOrderPromise = orderMgmt.updateOrder(order);
			updateOrderPromise.then(function(res) {
console.log('res.data:');
console.log(res.data);
			});
		};

		$scope.addItem = function() {
			var getItemByBarcodePromise = itemMgmt.getItemByBarcode($scope.bcId);
			getItemByBarcodePromise.then(function(itemData) {
				var sessionPromise = customerMgmt.getSession();
				sessionPromise.then(function(sessionData) {
					var sid = sessionData.sid;
					var getOrderBySIDPromise = orderMgmt.getOrderBySID(sid);
					getOrderBySIDPromise.then(function(orderData) {
						if(orderData && orderData.id) {
console.log('orderData:');
console.log(orderData);
						} else {
							var starterOrder = {};
							starterOrder.sid = sid;
							starterOrder.things = [];
							starterOrder.things.push(
								{
									itemId: itemData[0].id, 
									barcode: itemData[0].barcode, 
									name: itemData[0].name, 
									quantity: 1, 
									price: itemData[0].price
								}
							);
	
							var createOrderPromise = orderMgmt.createOrder(starterOrder);
							createOrderPromise.then(function(starterOrderData) {
console.log('starterOrderData:');
console.log(starterOrderData);
							});
						}
					});
				});
			});
		}


		$scope.updateOrder();
	}

}());
