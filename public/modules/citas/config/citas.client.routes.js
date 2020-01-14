'use strict';

//Setting up route
angular.module('citas').config(['$stateProvider',
	function($stateProvider) {
		// Citas state routing
		$stateProvider.
		state('listCitas', {
			url: '/citas',
			templateUrl: 'modules/citas/views/list-citas.client.view.html'
		}).
		state('createCita', {
			url: '/citas/create',
			templateUrl: 'modules/citas/views/create-cita.client.view.html'
		}).
		state('viewCita', {
			url: '/citas/:citaId',
			templateUrl: 'modules/citas/views/view-cita.client.view.html'
		}).
		state('editCita', {
			url: '/citas/:citaId/edit',
			templateUrl: 'modules/citas/views/edit-cita.client.view.html'
		});
	}
]);