'use strict';

(function() {
	// Ciudads Controller Spec
	describe('Ciudads Controller Tests', function() {
		// Initialize global variables
		var CiudadsController,
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

			// Initialize the Ciudads controller.
			CiudadsController = $controller('CiudadsController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Ciudad object fetched from XHR', inject(function(Ciudads) {
			// Create sample Ciudad using the Ciudads service
			var sampleCiudad = new Ciudads({
				name: 'New Ciudad'
			});

			// Create a sample Ciudads array that includes the new Ciudad
			var sampleCiudads = [sampleCiudad];

			// Set GET response
			$httpBackend.expectGET('ciudads').respond(sampleCiudads);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.ciudads).toEqualData(sampleCiudads);
		}));

		it('$scope.findOne() should create an array with one Ciudad object fetched from XHR using a ciudadId URL parameter', inject(function(Ciudads) {
			// Define a sample Ciudad object
			var sampleCiudad = new Ciudads({
				name: 'New Ciudad'
			});

			// Set the URL parameter
			$stateParams.ciudadId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/ciudads\/([0-9a-fA-F]{24})$/).respond(sampleCiudad);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.ciudad).toEqualData(sampleCiudad);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Ciudads) {
			// Create a sample Ciudad object
			var sampleCiudadPostData = new Ciudads({
				name: 'New Ciudad'
			});

			// Create a sample Ciudad response
			var sampleCiudadResponse = new Ciudads({
				_id: '525cf20451979dea2c000001',
				name: 'New Ciudad'
			});

			// Fixture mock form input values
			scope.name = 'New Ciudad';

			// Set POST response
			$httpBackend.expectPOST('ciudads', sampleCiudadPostData).respond(sampleCiudadResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Ciudad was created
			expect($location.path()).toBe('/ciudads/' + sampleCiudadResponse._id);
		}));

		it('$scope.update() should update a valid Ciudad', inject(function(Ciudads) {
			// Define a sample Ciudad put data
			var sampleCiudadPutData = new Ciudads({
				_id: '525cf20451979dea2c000001',
				name: 'New Ciudad'
			});

			// Mock Ciudad in scope
			scope.ciudad = sampleCiudadPutData;

			// Set PUT response
			$httpBackend.expectPUT(/ciudads\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/ciudads/' + sampleCiudadPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid ciudadId and remove the Ciudad from the scope', inject(function(Ciudads) {
			// Create new Ciudad object
			var sampleCiudad = new Ciudads({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Ciudads array and include the Ciudad
			scope.ciudads = [sampleCiudad];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/ciudads\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleCiudad);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.ciudads.length).toBe(0);
		}));
	});
}());