/**
 * Created by Oyuky on 01/11/2016.
 */
var medicinesListModule = angular.module('MedicineApp');
medicinesListModule.factory('EventFactory',['$cordovaSQLite','$ionicPlatform','$q', '$cordovaCalendar','SettingsFactory',
  function($cordovaSQLite,$ionicPlatform,$q,$cordovaCalendar, SettingsFactory) {
    var evento = {
      nombre: '',
      descripcion: '',
      inicio: '',
      fin: '',
      recordatorio1:0,
      recordatorio2:0,
    }

    return {
      createEvents: createEvents,
      deleteEvent: deleteEvent
    }
    function deleteEvent() {
      alert('eliminar evento');
    }

    function createEvents(medicineAlert) {
      try {
        var horas_disponibles = medicineAlert.numero_dias * 24;
        console.log("dias no. " + medicineAlert.numero_dias + " cada " + medicineAlert.repetir_horas + " total de horas.." + horas_disponibles);
        var repeticiones = horas_disponibles / medicineAlert.repetir_horas;
        var primeraDosis, siguienteDosis;
        var descripcion = "";
        var tempDate;
        for (var i = 1; i <= repeticiones; i++) {
          if (i == 1) {
            tempDate = new Date();
            primeraDosis = new Date();
            primeraDosis.setMinutes(tempDate.getMinutes() + 3);
            siguienteDosis = new Date(primeraDosis);
            descripcion = "Dosis no. " + i + " tomar " + medicineAlert.cantidad + " " + medicineAlert.unidad_medida;
            evento.descripcion = descripcion;
            evento.inicio = siguienteDosis;
            evento.fin = siguienteDosis;
            evento.nombre = medicineAlert.medicamento_nombre + '_MED' + medicineAlert.id;
            evento.recordatorio1 = SettingsFactory.getAlarma1();
            evento.recordatorio2 = SettingsFactory.getAlarma2();
            addEvent(evento);
            console.log("Dosis no. " + i + " tomar a las " + siguienteDosis);
          } else {
            siguienteDosis.setHours(primeraDosis.getHours() + medicineAlert.repetir_horas);
            descripcion = "Dosis no. " + i + " tomar " + medicineAlert.cantidad + " " + medicineAlert.unidad_medida;
            evento.descripcion = descripcion;
            evento.inicio = siguienteDosis;
            evento.fin = siguienteDosis;
            evento.recordatorio1 = SettingsFactory.getAlarma1();
            evento.recordatorio2 = SettingsFactory.getAlarma2();
            evento.nombre = medicineAlert.medicamento_nombre + '_MED' + medicineAlert.id;
            addEvent(evento);
            primeraDosis = siguienteDosis;
          }
        }
      }
      catch
        (error) {
        console.log("error 2 ->" + error + " - ");
      }
      console.log('Prescripción ' + medicineAlert.cantidad + ' ' + medicineAlert.unidad_medida + ' por ' + medicineAlert.numero_dias + ' día(s), cada ' + medicineAlert.repetir_horas + ' hrs.');
    }

    function addEvent(temp) {
      var deferred = $q.defer();

      $cordovaCalendar.createEventWithOptions({
        title: temp.nombre,
        notes: temp.descripcion,
        startDate: temp.inicio,
        firstReminderMinutes:temp.recordatorio1,
        secondReminderMinutes:temp.recordatorio2,
        endDate: temp.fin,
      }).then(function (result) {
        console.log('success');
        console.dir(result);
        deferred.resolve(1);
      }, function (err) {
        console.log('error');
        console.dir(err);
        deferred.resolve(0);
      });

      return deferred.promise;
    }

  }]);
