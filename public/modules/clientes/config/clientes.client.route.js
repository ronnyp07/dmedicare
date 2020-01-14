'use strict';

//Setting up route
angular.module('clientes').config(['$stateProvider',
	function($stateProvider) {
		$stateProvider.
		state('listClientes', {
			url: '/clientes',
			templateUrl: 'modules/clientes/views/list-clientes.client.view.html'
		});
	}
]); 