/**
 * Created by Oyuky on 18/10/2016.
 */
var medicinesListModule =  angular.module('ConfigurationApp',['ngCordova','ngStorage']);

medicinesListModule.controller('ConfigurationCtrl',['$scope','$cordovaSQLite', '$ionicPlatform', 'SettingsFactory',
  function ConfigurationCtrl ($scope, $cordovaSQLite, $ionicPlatform, SettingsFactory) {

    initMethods();

    function initMethods() {
      $scope.settings = SettingsFactory.get();
      $scope.updateConfiguration = updateConfiguration
    }

    $scope.configForm = {
      alarma1: 0,
      alarma2: 0
    };

    $scope.configForm.alarma1 = SettingsFactory.getAlarma1();
    $scope.configForm.alarma2 = SettingsFactory.getAlarma2();

    function updateConfiguration() {
      SettingsFactory.setAlarma1($scope.configForm.alarma1);
      SettingsFactory.setAlarma2($scope.configForm.alarma2);
    }
  }]);
