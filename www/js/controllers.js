angular.module('app.controllers', ['app.services'])
     
.controller('prioritiesCtrl', [
    function($scope) {
    }
])
   
.controller('viewTaskCtrl', function($scope) {

})
   
.controller('editTaskCtrl', ['$ionicHistory', '$scope', 'FirebaseUid',
    function($ionicHistory, $scope, FirebaseUid) {
        console.log(FirebaseUid);
        FirebaseUid().then(console.log.bind(console), console.log.bind(console));
    }
])
   
.controller('addATaskCtrl', ['$scope', '$state', '$ionicHistory',
    function($scope, $state, $ionicHistory) {
        $scope.goToEdit = function() {
            $state.go('menu.editTask');
            $ionicHistory.nextViewOptions({
                historyRoot: true
            });
        };
    }
]);
 