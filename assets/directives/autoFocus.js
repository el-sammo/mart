(function() {
	'use strict';

	var app = angular.module('app');

	///
	// Focus On
	///

	/**
	 * Focus On - Sets focus to element when value evaluates to true.
	 *
	 * Example:
	 *
	 *   <input name="theInput" auto-focus>
	 *
	 */

	app.directive('autoFocus', function($timeout) {
		return {
			restrict: 'AC',
			link: function(_scope, _element) {
				$timeout(function(){
					_element[0].focus();
				}, 0);
			}
		};
	});

}());
