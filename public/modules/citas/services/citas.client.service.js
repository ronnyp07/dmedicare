'use strict';

//Citas service used to communicate Citas REST endpoints
angular.module('citas').factory('Citas', ['$resource',
	function($resource) {
		return $resource('citas/:citaId', { citaId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]).factory('AppAction', ['$http', '$q', function($http, $q){
    var restultActions = {};
       
   restultActions.getApp = function(){
           var defer = $q.defer();
           $http.post('citas/getList').success(function(data){
           		defer.resolve(data);
           }).error(function(err){
           		defer.reject(err);
       });
           return defer.promise;
 };

 function getAppByDoctor (doctorId){
           var defer = $q.defer();
           $http.post('citas/getAppDoc', {doctorId}).success(function(data){
           		defer.resolve(data);
           }).error(function(err){
           		defer.reject(err);
       });
           return defer.promise;
 }
 
	return {
		restultActions,
		getAppByDoctor: getAppByDoctor
	};
}
]).factory('Notify', ['$rootScope', function($rootScope) {
	var notify = {};
	notify.msg = '';

	notify.sendbroadCast = function(mgs){
	  this.msg = mgs;
	  this.broadCast();
	  console.log(this.mgs);
	};

	notify.broadCast = function(){
		$rootScope.$broadcast('noError');
	};

    notify.sendMsg = function(msg, data){
       data = data || {};
       $rootScope.$emit(msg, data);
    };

    notify.getMsg = function(msg, func, scope){
     var unbind = $rootScope.$on(msg, func);

      if(scope){
          scope.$on('destroy', unbind);
      }
    };

    return notify;
	// Usar el service '$resource' para devolver un objeto '$resource' Patients
 
}]).config(function(calendarConfigProvider) {
    moment.lang("es");
    calendarConfigProvider.setDateFormatter('moment'); // use either moment or angular to format dates on the calendar. Default angular. Setting this will override any date formats you have already set.

    // calendarConfigProvider.setDateFormats({
    //   hour: 'HH:mm' // this will configure times on the day view to display in 24 hour format rather than the default of 12 hour
    // });

    // calendarConfigProvider.setTitleFormats({
    //   day: 'ddd D MMM' //this will configure the day view title to be shorter
    // });

    calendarConfigProvider.setI18nStrings({
      eventsLabel: 'Evento', //This will set the events label on the day view
      timeLabel: 'Tiempo' //This will set the time label on the time view
    });

    // calendarConfigProvider.setDisplayAllMonthEvents(true); //This will display all events on a month view even if they're not in the current month. Default false.

    // calendarConfigProvider.setDisplayEventEndTimes(true); //This will display event end times on the month and year views. Default false.

  });
