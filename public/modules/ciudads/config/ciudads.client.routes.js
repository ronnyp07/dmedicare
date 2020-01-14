'use strict';

//Setting up route
angular.module('ciudads').config(['$stateProvider',
	function($stateProvider) {
		// Ciudads state routing
		$stateProvider.
		state('listCiudads', {
			url: '/ciudads',
			templateUrl: 'modules/ciudads/views/list-ciudads.client.view.html'
		}).
		state('createCiudad', {
			url: '/ciudads/create',
			templateUrl: 'modules/ciudads/views/create-ciudad.client.view.html'
		}).
		state('viewCiudad', {
			url: '/ciudads/:ciudadId',
			templateUrl: 'modules/ciudads/views/view-ciudad.client.view.html'
		}).
		state('editCiudad', {
			url: '/ciudads/:ciudadId/edit',
			templateUrl: 'modules/ciudads/views/edit-ciudad.client.view.html'
		});
	}
]);