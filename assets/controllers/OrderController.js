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

		$scope.removeItem = function(order, item) {
			var idx = 0;
			order.things.forEach(function(thing) {
				if(thing.itemId === item.itemId) {
					order.things.splice(idx, 1);
					var updateOrderPromise = orderMgmt.updateOrder(order);
					updateOrderPromise.then(function(res) {
						$scope.updateOrder();
					});
				} else {
					idx++;
				}
			});
		}

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
		
							function mergeThings(existingThing, thingToMerge) {
								existingThing.quantity = (
									parseInt(existingThing.quantity) + parseInt(thingToMerge.quantity)
								);
			
								var specInst = [];
								existingThing.specInst && specInst.push(existingThing.specInst);
								thingToMerge.specInst && specInst.push(thingToMerge.specInst);
								existingThing.specInst = specInst.join('; ');
							}
			
							function buildThings(existingThings) {
								existingThings || (existingThings = []);
			
								var deferred = $q.defer();
			
								newThing(itemData[0]).then(function(thingToAdd) {
									var isDuplicate = false;
									existingThings.forEach(function(existingThing) {
										if(existingThing.itemId !== thingToAdd.itemId) {
											return;
										}
										isDuplicate = true;
										mergeThings(existingThing, thingToAdd);
									});
			
									if(! isDuplicate) {
										existingThings.push(thingToAdd);
									}
			
									deferred.resolve(existingThings);
								}).catch(deferred.reject);
			
								return deferred.promise;
							}
			
							function newThing(item) {
								var deferred = $q.defer();
			
								var thing = {
									name: item.name,
									itemId: item.id,
									price: item.price,
									quantity: 1, 
									barcode: item.barcode
								};

								deferred.resolve(thing);
			
								return deferred.promise;
							}
			
							function buildOrder(order) {
								var deferred = $q.defer();
			
								buildThings(order.things).then(function(things) {
									order.things = things;
									deferred.resolve(order);
								}).catch(deferred.reject);
			
								return deferred.promise;
							}
			
							// Controls that prevent an item from being added to
							// an order that has already been paid for
							if(orderData.paid) {
								console.log('attempting to add item to completed order...');
								$scope.orderCompleted = true;
								return;
							}
			
							buildOrder(orderData).then(function(order) {
								var updateOrderPromise = orderMgmt.updateOrder(order);
								updateOrderPromise.then(function(res) {
									$rootScope.$broadcast('orderChanged');
								});
							});

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
								$rootScope.$broadcast('orderChanged');
							});
						}
					});
				});
			});
		}


		$scope.updateOrder();
	}

}());
