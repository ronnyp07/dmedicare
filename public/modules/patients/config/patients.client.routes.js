'use strict';

//Setting up route
angular.module('patients').config(['$stateProvider',
	function($stateProvider) {
		// Patients state routing
		$stateProvider.
		state('listPatients', {
			url: '/patients',
			templateUrl: 'modules/patients/views/list-patients.client.view.html'
		}).
		state('viewPatients', {
			url: '/patients/:patientId',
			templateUrl: 'modules/patients/views/patients-dashboard.template.html'
		});
		
}
		
]);