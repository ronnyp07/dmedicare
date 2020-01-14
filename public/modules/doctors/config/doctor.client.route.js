// Invocar modo JavaScript 'strict'
'use strict';

// Configurar el módulo routes de 'patients'
angular.module('doctor').config(['$stateProvider',
	function($stateProvider) {
		$stateProvider.
		state('doctorList', {
			url:'/doctors',
			templateUrl: 'modules/doctors/views/list-doctor.client.view.html'
		});
	}
]); 