'use strict';

//Setting up route
angular.module('locations').config(['$stateProvider',
	function($stateProvider) {
		$stateProvider.
		state('listLocations', {
			url: '/locations',
			templateUrl: 'modules/locations/views/list-locations.client.view.html'
		});
	}
]); 