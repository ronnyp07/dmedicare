'use strict';

// Dashboards controller
var appDashBoard = angular.module('dashboards');

appDashBoard.controller('DashboardsController', 
	['$scope', 
	'$stateParams', 
	'$location', 
	'Authentication', 
	'Dashboards',
	'AppAction',
	'MaintainsAction',
  'PatientFunctions',
	'lodash',
	'Maintains',
	'$resource',
	'$http',
  'MaintainDetailsService',
  'MaintainList',
  'HeaderDetailsList',
	function($scope, $stateParams, $location, Authentication, Dashboards, AppAction, MaintainsAction, PatientFunctions, lodash, Maintains, $resource, $http, MaintainDetailsService, MaintainList, HeaderDetailsList) {
		$scope.authentication = Authentication;
    console.log(MaintainList);
		
   MaintainDetailsService.getHeaderMaster(MaintainList.Estado_Consulta);
   $scope.showApp = 'citados';
   $scope.init = function(){
   		 $scope.appByDoctors();
       $scope.getPatients();       
   };

   $scope.isSaving = true;

   $scope.sendPatientChart= function(param){
    console.log(param);

      if(param){
      $location.path('/patients/' + param);
    }
   };


    $scope.getPatients = function(){
      PatientFunctions.patientFunctionResult.getPatientList().then(function(result){
      $scope.listPatient = result;
     }, function(err){});
   };

   $scope.showFunction = function(currentId){
      if(currentId === $scope.currentItem){
         $scope.currentItem = null;
      }else{
        $scope.currentItem = currentId;
       }
   };

   $scope.setView = function(view){
    $scope.showApp = view;
   };



$scope.appByDoctors = function(){
     // MaintainsAction.resultActions.getMbyCode('TipoConsulta')
     //  .then(function(res){
     //  $scope.data = res[0].parameters;

     //  MaintainsAction.resultActions.getMbyCode('EstadoConsulta')
     //  .then(function(appStatus){
     //  $scope.appStatus  = appStatus[0].parameters;

      AppAction.getAppByDoctor($scope.authentication.user._id)
     .then(function(result){
      /*Get the all apps Patient*/
      console.log(result);

      $scope.appCheckin = lodash.chain(result)
                    .filter(isAppFromToday)
                    .map(function(item){
                    	 var appUptime = getDateDiff(item.appstartDate);
                      return {
                    		appLoc: item.appLoc,
                    		appPatient: item.appPatient,
                    		appId: item.appId,
                    		appDoctor:item.appDoctor,
                    		appReason: item.appReason,
                    		appsendDate: item.appsendDate,
                    	  appstartDate: item.appstartDate,
                        appStatus: item.status.value,
                        appUptime : appUptime
                    	};
                    })
                    .value();

  $scope.watingApp = lodash.chain(result)
                    .filter(watingAppFun)
                    .map(function(item){
                      // var appType = getMaintainesDesc(item.appType);
                      // var status = getAppStatusDesc(item.status);
                      return {
                        appLoc: item.appLoc,
                        appPatient: item.appPatient,
                        appId: item.appId,
                        appDoctor:item.appDoctor,
                        appReason: item.appReason,
                        appType: item.appType.value,
                        appsendDate: item.appsendDate,
                        appstartDate: item.appstartDate,
                        appStatus: item.status.value
                      };
                    })
                    .value();

  $scope.completeApp = lodash.chain(result)
                    .filter(completeAppFun)
                    .map(function(item){                 
                      return {
                        appLoc: item.appLoc,
                        appPatient: item.appPatient,
                        appId: item.appId,
                        appDoctor:item.appDoctor,
                        appReason: item.appReason,
                        appType: item.appType.value,
                        appsendDate: item.appsendDate,
                        appstartDate: item.appstartDate,
                        appStatus: item.status.value
                        
                      };
                    })
                    .value();


      $scope.checkinCount = $scope.appCheckin.length;
      $scope.waitingCount = $scope.watingApp.length;
      $scope.completeAppCount  = $scope.completeApp.length;
      $scope.appDoctor = result;
  //     //console.log($scope.completeApp);
       $scope.isSaving = false;
       function getDateDiff(startDate){
          var now = '29/10/2015 15:17:00';
          var duration = {};

         if(moment()> new Date(startDate))
         {
           duration = {
             retrasada: true,
             hora: moment.utc(moment(moment(), 'DD/MM/YYYY HH:mm:ss').diff(moment(new Date(startDate), 'DD/MM/YYYY HH:mm:ss'))).format('HH:mm:ss')
           };
         }else {
           duration = {
             retrasada: false,
             hora: moment.utc(moment(new Date(startDate), 'DD/MM/YYYY HH:mm:ss').diff(moment(moment(), 'DD/MM/YYYY HH:mm:ss'))).format('HH:mm:ss')
           };
          }

          console.log(duration.hora + ' ' + moment.utc );
          return duration;
       }

       function isAppFromToday(team){    
        if (team){
       	return ((moment(team.appstartDate).format('DD MMMM YYYY') ===  moment().format('DD MMMM YYYY')) && (team.status.headermasterId === HeaderDetailsList.Por_Venir));
        //return ((moment(team.appstartDate).format('DD MMMM YYYY') ===  moment().format('DD MMMM YYYY')) && (team.patientCheckIn === true));
         }
        }

        function watingAppFun(team){
        if(team){
        return ((moment(team.appstartDate).format('DD MMMM YYYY') ===  moment().format('DD MMMM YYYY')) && (team.status.headermasterId === HeaderDetailsList.En_Espera));
        //return ((moment(team.appstartDate).format('DD MMMM YYYY') ===  moment().format('DD MMMM YYYY')) && (team.patientCheckIn === true));
          }
        }

        function completeAppFun(team){
          if(team){
        return ((moment(team.appstartDate).format('DD MMMM YYYY') ===  moment().format('DD MMMM YYYY')) && (team.status.headermasterId === HeaderDetailsList.Completado || team.status.headermasterId === HeaderDetailsList.Cancelado));
        //return ((moment(team.appstartDate).format('DD MMMM YYYY') ===  moment().format('DD MMMM YYYY')) && (team.patientCheckIn === true));
         }
        }

  //     function getMaintainesDesc(paramId){
  //     var mantain;
  //     if(paramId === undefined)
  //     {
  //        mantain = '';
  //     }else {
  //       mantain = lodash.chain($scope.data)
  //                          .find({ '_id': paramId})
  //                          .value();
  //     }
  //   	return mantain.value;
  //     }

  //     function getAppStatusDesc(paramId){
  //       var mantain;
  //     if(paramId === undefined)
  //     {
  //        mantain = 'En Espera';
  //     }else{
  //      mantain = lodash.chain($scope.appStatus)
  //                          .find({ '_id': paramId})
  //                          .value();
  //     }
  //     return mantain.value;
  //     }

      // });
      // });

     }, function(err){
    });/*end of */
    
};

   $scope.calculateAge = function(birthday) { // pass in player.dateOfBirth
    var ageDifMs = Date.now() - new Date(birthday);
    var ageDate = new Date(ageDifMs); // miliseconds from epoch
    return Math.abs(ageDate.getUTCFullYear() - 1970);
    };

  if($scope.authentication){
    $scope.init();
  }
	}
]);

appDashBoard .directive('dashactive', function () {
      return {
         restrict: 'A',
         scope: true,
         controller: function ($scope, $element, $attrs) {
         },
    
         link: function (scope, el, attrs) {
         	var link = el.find('li');
            link.bind('click', function() {
            	var $this = $(this);
            	var $next = $this.nextAll();
            	var $prev = $this.prevAll();
            	$prev.removeClass('active');
            	$next.removeClass('active');
		        $this.toggleClass('active');
           });
         }
      };
 });

appDashBoard .directive('divlist', function () {
      return {
         restrict: 'A',
         scope: true,
         controller: function ($scope, $element, $attrs) {
         },
    
         link: function (scope, el, attrs) {
          var link = el.find('a');
            link.bind('click', function() {
              //console.log('this has been clicked');
            var $this = $(this);
            var $div = $this.closest('div.divCont');

            //$('#LeftScrollableDiv').children().first();
            if($div.hasClass('hideDiv')){
              $div.removeClass('hideDiv');
              $div.toggleClass('showDiv');
            }else{
              $div.removeClass('showDiv');
              $div.toggleClass('hideDiv');
            }
             //    $div.style.display = 'block';
             // else
             //    $div.style.display = 'none';
            
            //   var $next = $this.nextAll();
            //   var $prev = $this.prevAll();
            //   $prev.removeClass('active');
            //   $next.removeClass('active');
            // $this.toggleClass('active');
           });
         }
      };
 });

appDashBoard.directive('appCheckin', function(){
	return {
    restrict: 'E',
    transclude: true,
    templateUrl: 'modules/dashboards/templates/checkin.html',
    link: function(scope, element, attr){         
      // when a new procedimiento is added update the cliente List..
      
    }
   };
});

appDashBoard.directive('appWaiting', function(){
  return {
    restrict: 'E',
    transclude: true,
    templateUrl: 'modules/dashboards/templates/waiting.html',
    link: function(scope, element, attr){         
      // when a new procedimiento is added update the cliente List..
    }
   };
});

appDashBoard.directive('appComplete', function(){
  return {
    restrict: 'E',
    transclude: true,
    templateUrl: 'modules/dashboards/templates/complete.html',
    link: function(scope, element, attr){         
      // when a new procedimiento is added update the cliente List..
    }
   };
});