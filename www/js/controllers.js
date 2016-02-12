angular.module('app.controllers', [])
     
.controller('prioritiesCtrl', [
    function($scope) {
    }
])
   
.controller('viewTaskCtrl', function($scope) {

})
   
.controller('editTaskCtrl', ['$ionicHistory', '$scope',
    function($ionicHistory, $scope) {
        console.log('viewHistory', $ionicHistory.viewHistory());
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
 