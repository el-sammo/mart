(function() {
	'use strict';

	var app = angular.module('app');

	app.factory('itemSchema', service);
	
	service.$inject = [ ];
	
	function service() {
		function nameTransform(item) {
			if(! item || ! item.name || item.name.length < 1) {
				return 'item-name';
			}
			return (item.name
				.replace(/[^a-zA-Z ]/g, '')
				.replace(/ /g, '-')
				.toLowerCase()
			);
		}

		var service = {
			defaults: {
				item: {
					name: '',
					category: '',
					description: '',
					size: '',
					price: '',
					barcode: '',
					active: '',
					taxable: ''
				}
			},

			populateDefaults: function(item) {
				$.map(service.defaults.item, function(value, key) {
					if(item[key]) return;
					if(typeof value === 'object') {
						item[key] = angular.copy(value);
						return;
					}
					item[key] = value;
				});
				return item;
			}
		};

		return service;
	}

}());
