(function() {
	'use strict';

	var app = angular.module('app');

	///
	// Item Management
	///

	app.factory('itemMgmt', service);
	
	service.$inject = [
		'$http', '$q', '$sce', 'configMgr', 'querystring'
	];
	
	function service(
		$http, $q, $sce, configMgr, querystring
	) {
		var item;
		var getItemPromise;
		var getItemsByBarcodePromise;
		var getItemsByCategoryPromise;

		var service = {
			getItem: function(itemId) {
				if(getItemPromise) {
					return getItemPromise;
				}

				var url = '/items/' + itemId;
				getItemPromise = $http.get(url).then(function(res) {
					mergeIntoItem(res.data);
					return item;
				}).catch(function(err) {
					console.log('GET ' + url + ': ajax failed');
					console.error(err);
					return $q.reject(err);
				});

				return getItemPromise;
			},

			getItemByBarcode: function(barcode) {
				var url = '/items/byBarcode/' + barcode;
				getItemsByBarcodePromise = $http.get(url).then(function(res) {
					mergeIntoItem(res.data);
					return item;
				}).catch(function(err) {
					console.log('GET ' + url + ': ajax failed');
					console.error(err);
					return $q.reject(err);
				});

				return getItemsByBarcodePromise;
			},

			getItemsByCategory: function(category) {
				var url = '/items/byCategory/' + category;
				getItemsByCategoryPromise = $http.get(url).then(function(res) {
					mergeIntoItem(res.data);
					return item;
				}).catch(function(err) {
					console.log('GET ' + url + ': ajax failed');
					console.error(err);
					return $q.reject(err);
				});

				return getItemsByCategoryPromise;
			},

			createItem: function(itemData) {
				var url = '/items/create';
				return $http.post(url, itemData).success(
					function(data, status, headers, config) {
						if(status >= 400) {
							return $q.reject(data);
						}
						mergeIntoItem(data, true);
						return item;
					}
				).catch(function(err) {
					console.log('POST ' + url + ': ajax failed');
					console.error(err);
					return $q.reject(err);
				});
			},

			updateItem: function(itemData) {
				var url = '/items/' + itemData.id;
				return $http.put(url, itemData).success(
					function(data, status, headers, config) {
						if(status >= 400) {
							return $q.reject(data);
						}
						mergeIntoItem(data, true);
						return item;
					}
				).catch(function(err) {
					console.log('PUT ' + url + ': ajax failed');
					console.error(err);
					return $q.reject(err);
				});
			}

		};

		function mergeIntoItem(data, replace) {
			if(! item) {
				item = data;
				return;
			}

			// Delete all original keys
			if(replace) {
				angular.forEach(item, function(val, key) {
					delete item[key];
				});
			}

			angular.forEach(data, function(val, key) {
				item[key] = val;
			});
		};

		return service;
	}

}());
