(function() {
	'use strict';

	var app = angular.module('app');

	///
	// Cat Management
	///

	app.factory('catMgmt', service);
	
	service.$inject = [
		'$http', '$q', '$sce', 'configMgr', 'querystring'
	];
	
	function service(
		$http, $q, $sce, configMgr, querystring
	) {
		var cat;
		var getCatPromise;

		var service = {
			getCat: function(catId) {
				if(getCatPromise) {
					return getCatPromise;
				}

				var url = '/cats/' + catId;
				getCatPromise = $http.get(url).then(function(res) {
					mergeIntoCat(res.data);
					return cat;
				}).catch(function(err) {
					console.log('GET ' + url + ': ajax failed');
					console.error(err);
					return $q.reject(err);
				});

				return getCatPromise;
			},

			createCat: function(catData) {
				var url = '/cats/create';
				return $http.post(url, catData).success(
					function(data, status, headers, config) {
						if(status >= 400) {
							return $q.reject(data);
						}
						mergeIntoCat(data, true);
						return cat;
					}
				).catch(function(err) {
					console.log('POST ' + url + ': ajax failed');
					console.error(err);
					return $q.reject(err);
				});
			},

			updateCat: function(catData) {
				var url = '/cats/' + catData.id;
				return $http.put(url, catData).success(
					function(data, status, headers, config) {
						if(status >= 400) {
							return $q.reject(data);
						}
						mergeIntoCat(data, true);
						return cat;
					}
				).catch(function(err) {
					console.log('PUT ' + url + ': ajax failed');
					console.error(err);
					return $q.reject(err);
				});
			}

		};

		function mergeIntoCat(data, replace) {
			if(! cat) {
				cat = data;
				return;
			}

			// Delete all original keys
			if(replace) {
				angular.forEach(cat, function(val, key) {
					delete cat[key];
				});
			}

			angular.forEach(data, function(val, key) {
				cat[key] = val;
			});
		};

		return service;
	}

}());
