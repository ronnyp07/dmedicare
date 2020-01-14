'use strict';

//Setting up route
angular.module('pais').config(['$stateProvider',
	function($stateProvider) {
		// Pais state routing
		$stateProvider.
		state('listPais', {
			url: '/pais',
			templateUrl: 'modules/pais/views/list-pais.client.view.html'
		}).
		state('createPai', {
			url: '/pais/create',
			templateUrl: 'modules/pais/views/create-pai.client.view.html'
		}).
		state('viewPai', {
			url: '/pais/:paiId',
			templateUrl: 'modules/pais/views/view-pai.client.view.html'
		}).
		state('editPai', {
			url: '/pais/:paiId/edit',
			templateUrl: 'modules/pais/views/edit-pai.client.view.html'
		});
	}
]);