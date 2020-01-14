'use strict';

// Init the application configuration module for AngularJS application
var ApplicationConfiguration = (function() {
	// Init module configuration options
	var applicationModuleName = 'datamedicare';
	var applicationModuleVendorDependencies = [
	'ngResource',
	'ngLodash', 
	'ngCookies',  
	'ngAnimate',  
	'ngTouch',  
	'ngSanitize',  
	'ui.router', 
	'mwl.calendar', 
	'ui.bootstrap',  
	'ui.utils',
	'ui.select2', 
	'ngMaterial', 
	'ngTable', 
	'ui.date', 
	'ui.calendar',  
	'pais', 
	'ciudads',
	'clientes',
	'citas',
	'doctor',
	'locations',
	'documents',
	'angularUtils.directives.dirPagination',
    'users'];

	// Add a new vertical module
	var registerModule = function(moduleName, dependencies) {
		// Create angular module
		angular.module(moduleName, dependencies || []);

		// Add the module to the AngularJS configuration file
		angular.module(applicationModuleName).requires.push(moduleName);
	};

	return {
		applicationModuleName: applicationModuleName,
		applicationModuleVendorDependencies: applicationModuleVendorDependencies,
		registerModule: registerModule
	};
})();