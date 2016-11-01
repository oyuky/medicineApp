/**
 * Created by Oyuky on 22/09/2016.
 */
var medicinesListModule = angular.module('MedicineApp');
medicinesListModule.factory('MedicineFactory',['$cordovaSQLite','$ionicPlatform','$q', '$cordovaCalendar','SettingsFactory',
  function($cordovaSQLite,$ionicPlatform,$q, $cordovaCalendar,SettingsFactory) {
    var db;
    var medicineList;
    var medicineTemp;
    var evento = {
      nombre: '',
      descripcion: '',
      inicio: '',
      fin: '',
      recordatorio1:0,
      recordatorio2:0,
    }

    return {
      initDB: initDB,
      getAllMedicines: getAllMedicines,
      addNewMedicine: addNewMedicine,
      deleteMedicine: deleteMedicine,
      createEvents: createEvents,
      getMedicine: getMedicine
    }

    function initDB() {
      try {
        console.log("paso 0... ");
        $ionicPlatform.ready(function () {
          console.log("paso 1... ");
          if (window.cordova) {
            // App syntax
            db = $cordovaSQLite.openDB({name: 'medicineApp.db', location: 'default'});
            console.log("paso 2... ");
          } else {
            // Ionic serve syntax
            db = window.openDatabase("medicineApp.db", "1.0", "MedicineApp", -1);
            console.log("paso 2.1... ");
          }
          //$cordovaSQLite.execute(db, 'DROP TABLE IF EXISTS Medicamento');
          var query = "CREATE TABLE IF NOT EXISTS Medicamento " +
            "(id INTEGER PRIMARY KEY, " +
            "medicamento_nombre TEXT, " +
            "cantidad NUMBER, " +
            "unidad_medida TEXT, " +
            "numero_dias NUMBER, " +
            "repetir_horas NUMBER, " +
            "observaciones TEXT)";

          runQuery(query, [], function (res) {
            console.log("table created ");
          }, function (err) {
            console.log(err);
          });
        }.bind(this));
      } catch (err) {
        console.log("inicio---- ->" + err + " - ");
      }
    }

    function getAllMedicines() {
      var deferred = $q.defer();
      var query = "SELECT id, medicamento_nombre FROM Medicamento ";
      runQuery(query, [], function (response) {
        //Success Callback
        console.log(response);
        medicineList = response.rows;
        deferred.resolve(response);
      }, function (error) {
        //Error Callback
        console.log(error);
        deferred.reject(error);
      });
      return deferred.promise;
    }

    function addNewMedicine(formData) {
      console.log('adding new medicine :' + formData.txtMedicamentoNombre);
      var deferred = $q.defer();
      var query = "INSERT INTO Medicamento (medicamento_nombre, cantidad, unidad_medida, numero_dias, repetir_horas, observaciones ) VALUES (?,?,?,?,?,?)";
      runQuery(query, [formData.txtMedicamentoNombre, formData.txtCantidad, formData.ddlUnidadMedida,
        formData.txtDias, formData.txtRepetirHoras, formData.txtObservaciones], function (response) {
        //Success Callback
        console.log(response);
        deferred.resolve(response);
      }, function (error) {
        //Error Callback
        console.log(error);
        deferred.reject(error);
      });

      return deferred.promise;
    }

    function deleteMedicine(id) {
      var deferred = $q.defer();
      var query = "DELETE FROM Medicamento WHERE id = ?";
      runQuery(query, [id], function (response) {
        //Success Callback
        console.log(response);
        deferred.resolve(response);
      }, function (error) {
        //Error Callback
        console.log(error);
        deferred.reject(error);
      });

      return deferred.promise;
    }

    function getMedicine(id) {
      var deferred = $q.defer();
      var query = "SELECT * FROM Medicamento WHERE id = ?";
      runQuery(query, [id], function (response) {
        //Success Callback
        console.log(response);
        medicineTemp = response.rows.item(0);
        deferred.resolve(response);
      }, function (error) {
        //Error Callback
        console.log(error);
        deferred.reject(error);
      });

      return deferred.promise;
    }


    /*
     function getMedicine(id) {
     var medicine;
     if (medicinelist) {
     for (var i = 0; i < medicinelist.length; i++) {
     if (medicinelist.item(i).id == id)
     medicine = medicinelist.item(i);
     }
     }
     return medicine;
     }*/

    function runQuery(query, dataArray, successCb, errorCb) {
      $ionicPlatform.ready(function () {
        $cordovaSQLite.execute(db, query, dataArray).then(function (res) {
          successCb(res);
        }, function (err) {
          errorCb(err);
        });
      }.bind(this));
    }

    function createEvents(id) {
      try {
        var medicineAlert;
        getMedicine(id).then(function (res) {
          var countRes = res.rows.length;
          if (countRes > 0) {
            medicineAlert = res.rows.item(0);
            var horas_disponibles = medicineTemp.numero_dias * 24;
            console.log("dias no. " + medicineTemp.numero_dias + " cada " + medicineTemp.repetir_horas + " total de horas.." + horas_disponibles);
            var repeticiones = horas_disponibles / medicineTemp.repetir_horas;
            var primeraDosis, siguienteDosis;
            var descripcion = "";
            for (var i = 1; i <= repeticiones; i++) {
              if (i == 1) {
                temp = new Date();
                primeraDosis = new Date();
                primeraDosis.setMinutes(temp.getMinutes() + 3);
                siguienteDosis = new Date(primeraDosis);
                descripcion = "Dosis no. " + i + " tomar " + medicineTemp.cantidad + " " + medicineTemp.unidad_medida;
                evento.descripcion = descripcion;
                evento.inicio = siguienteDosis;
                evento.fin = siguienteDosis;
                evento.nombre = medicineTemp.medicamento_nombre + '_MED' + medicineTemp.id;
                evento.recordatorio1 = SettingsFactory.getAlarma1();
                evento.recordatorio2 = SettingsFactory.getAlarma2();
                addCalendar(evento);
                console.log("Dosis no. " + i + " tomar a las " + siguienteDosis);
              } else {
                siguienteDosis.setHours(primeraDosis.getHours() + medicineTemp.repetir_horas);
                descripcion = "Dosis no. " + i + " tomar " + medicineTemp.cantidad + " " + medicineTemp.unidad_medida;
                evento.descripcion = descripcion;
                evento.inicio = siguienteDosis;
                evento.fin = siguienteDosis;
                evento.recordatorio1 = SettingsFactory.getAlarma1();
                evento.recordatorio2 = SettingsFactory.getAlarma2();
                evento.nombre = medicineTemp.medicamento_nombre + '_MED' + medicineTemp.id;
                addCalendar(evento);
                primeraDosis = siguienteDosis;
              }
            }
          }
          else {
            $scope.messageinfo = "Error al consultar. ";
          }
        }, function (err) {
          $scope.messageinfo += "Error -> " + err;
        });
      }

      catch
        (error) {
        $scope.messageinfo += "error 2 ->" + error + " - ";
      }
      event.inicio=new Date();
      //event.descripcion= 'Prescripción ' + medicineAlert.cantidad + ' ' + medicineAlert.unidad_medida + ' por ' + medicineAlert.numero_dias + ' día(s), cada ' + medicineAlert.repetir_horas + ' hrs.';
      console.log(event);
    }

    function addCalendar(temp) {
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
/*
    function getConfig(){
      var deferred = $q.defer();
      var query = "SELECT * FROM Configuracion ";
      runQuery(query, function (response) {
        //Success Callback
        console.log(response);
        medicineTemp = response.rows.item(0);
        deferred.resolve(response);
      }, function (error) {
        //Error Callback
        console.log(error);
        deferred.reject(error);
      });

      return deferred.promise;
    }

    function updateConfiguration(formConfiguration) {
      console.log('update config:' + formConfiguration.alarma1);
      var deferred = $q.defer();
      var query = "UPDATE Configuracion SET (recordatorio_1, recordatorio_2) VALUES (?,?)";
      runQuery(query, [formConfiguration.alarma1, formConfiguration.alarma1], function (response) {
        //Success Callback
        console.log(response);
        deferred.resolve(response);
      }, function (error) {
        //Error Callback
        console.log(error);
        deferred.reject(error);
      });

      return deferred.promise;
    }
  */
  }]);
/*
function medicineFactory($cordovaSQLite, $q, $ionicPlatform) {
  var self=this;

  self.all = function() {
    return DBA.query("SELECT id, name FROM team")
      .then(function(result){
        return DBA.getAll(result);
      });
  }

   db = $cordovaSQLite.openDB({name: "medicineApp.db", location: 'default'});
   return {
     insert: function (txtmedicine, txtquenty) {
       $cordovaSQLite.execute(db, 'INSERT INTO Medicamento (MedicamentoNombre, Cantidad ) VALUES (?,?)', [txtmedicine, txtquenty])
         .then(function (result) {
           console.log("INSERT ID -> " + res.insertId);
           $scope.statusMessage = "Message saved successful, cheers!";
         }, function (error) {
           $scope.statusMessage = "Error on saving: " + error.message;
         })
     },
     crearBD: function () {
       try {
         $cordovaSQLite.execute(db, "CREATE TABLE IF NOT EXISTS Medicamento (id INTEGER PRIMARY KEY AUTOINCREMENT, MedicamentoNombre TEXT, Cantidad NUMBER)");
         $scope.consolelog = db + " - ";
       } catch (err) {
         $scope.consolelog = err + " - ";

       }
     }
   };
 }*/
