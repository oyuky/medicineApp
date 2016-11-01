/**
 * Created by Oyuky on 31/10/2016.
 */
var medicinesListModule = angular.module('MedicineApp');

medicinesListModule.factory('SettingsFactory', [function() {

  var _settingsKey = "appSettings",
    defaultSettings = {
      alarma1: 0,
      alarma2: 5
    };

  function _retrieveSettings() {
    var settings = localStorage[_settingsKey];
    if(settings)
      return angular.fromJson(settings);
    return defaultSettings;
  }

  function _saveSettings(settings) {
    localStorage[_settingsKey] = angular.toJson(settings);
    console.log(angular.toJson(settings));
    console.log(_settingsKey);
  }

  return {
    get: _retrieveSettings,
    set: _saveSettings,
    getAlarma1: function () {
      return _retrieveSettings().alarma1;
    },
    setAlarma1: function (alarma1) {
      var settings = _retrieveSettings();
      settings.alarma1 = alarma1;
      _saveSettings(settings);
    },
    getAlarma2: function () {
      return _retrieveSettings().alarma2;
    },
    setAlarma2: function (alarma2) {
      var settings = _retrieveSettings();
      settings.alarma2 = alarma2;
      _saveSettings(settings);
    }
  }
}]);
