'use strict';

(function() {
	// Citas Controller Spec
	describe('Citas Controller Tests', function() {
		// Initialize global variables
		var CitasController,
		scope,
		$httpBackend,
		$stateParams,
		$location;

		// The $resource service augments the response object with methods for updating and deleting the resource.
		// If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
		// the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
		// When the toEqualData matcher compares two objects, it takes only object properties into
		// account and ignores methods.
		beforeEach(function() {
			jasmine.addMatchers({
				toEqualData: function(util, customEqualityTesters) {
					return {
						compare: function(actual, expected) {
							return {
								pass: angular.equals(actual, expected)
							};
						}
					};
				}
			});
		});

		// Then we can start by loading the main application module
		beforeEach(module(ApplicationConfiguration.applicationModuleName));

		// The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
		// This allows us to inject a service but then attach it to a variable
		// with the same name as the service.
		beforeEach(inject(function($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_) {
			// Set a new global scope
			scope = $rootScope.$new();

			// Point global variables to injected services
			$stateParams = _$stateParams_;
			$httpBackend = _$httpBackend_;
			$location = _$location_;

			// Initialize the Citas controller.
			CitasController = $controller('CitasController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Cita object fetched from XHR', inject(function(Citas) {
			// Create sample Cita using the Citas service
			var sampleCita = new Citas({
				name: 'New Cita'
			});

			// Create a sample Citas array that includes the new Cita
			var sampleCitas = [sampleCita];

			// Set GET response
			$httpBackend.expectGET('citas').respond(sampleCitas);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.citas).toEqualData(sampleCitas);
		}));

		it('$scope.findOne() should create an array with one Cita object fetched from XHR using a citaId URL parameter', inject(function(Citas) {
			// Define a sample Cita object
			var sampleCita = new Citas({
				name: 'New Cita'
			});

			// Set the URL parameter
			$stateParams.citaId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/citas\/([0-9a-fA-F]{24})$/).respond(sampleCita);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.cita).toEqualData(sampleCita);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Citas) {
			// Create a sample Cita object
			var sampleCitaPostData = new Citas({
				name: 'New Cita'
			});

			// Create a sample Cita response
			var sampleCitaResponse = new Citas({
				_id: '525cf20451979dea2c000001',
				name: 'New Cita'
			});

			// Fixture mock form input values
			scope.name = 'New Cita';

			// Set POST response
			$httpBackend.expectPOST('citas', sampleCitaPostData).respond(sampleCitaResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Cita was created
			expect($location.path()).toBe('/citas/' + sampleCitaResponse._id);
		}));

		it('$scope.update() should update a valid Cita', inject(function(Citas) {
			// Define a sample Cita put data
			var sampleCitaPutData = new Citas({
				_id: '525cf20451979dea2c000001',
				name: 'New Cita'
			});

			// Mock Cita in scope
			scope.cita = sampleCitaPutData;

			// Set PUT response
			$httpBackend.expectPUT(/citas\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/citas/' + sampleCitaPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid citaId and remove the Cita from the scope', inject(function(Citas) {
			// Create new Cita object
			var sampleCita = new Citas({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Citas array and include the Cita
			scope.citas = [sampleCita];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/citas\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleCita);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.citas.length).toBe(0);
		}));
	});
}());