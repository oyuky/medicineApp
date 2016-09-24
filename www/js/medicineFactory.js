/**
 * Created by Oyuki on 22/09/2016.
 */
angular.module("temp", ['ngCordova'])
 .factory('MedicineFactory', function($scope, $cordovaSQLite) {
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
 });
