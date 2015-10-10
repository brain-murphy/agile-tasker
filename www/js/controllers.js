angular.module('starter.controllers', [])

$rootScope.taskList = [];

.controller('AppCtrl', function($scope, $ionicModal, $timeout) {

    // With the new view caching in Ionic, Controllers are only called
    // when they are recreated or on app start, instead of every page change.
    // To listen for when this page is active (for example, to refresh data),
    // listen for the $ionicView.enter event:
    //$scope.$on('$ionicView.enter', function(e) {
    //});

    // Form data for the login modal
    //$scope.taskData = {};

    //task that models the data in the taskAddModal//
    $scope.taskData = createTask();

    // Create the login modal that we will use later
    $ionicModal.fromTemplateUrl('templates/taskAddModal.html', {
        scope: $scope
    }).then(function(modal) {
        $scope.taskAddModal = modal;
    });

    // Triggered in the login modal to close it
    $scope.closeTaskAddModal = function() {
        $scope.taskAddModal.hide();
    };

    // Open the login modal
    $scope.addTask = function() {
        $scope.taskAddModal.show();
    };

    // Perform the login action when the user submits the login form
    $scope.doTaskAdd = function() {
        console.log('adding task', $scope.taskData);

        //add task data to task list//
        $rootScope.taskList.push($scope.taskData);

        //reset data in add task form//
        $scope.taskData = createTask();

        $scope.closeLogin();
    };
})

.controller('PlaylistsCtrl', function($scope) {

})

.controller('PlaylistCtrl', function($scope, $stateParams) {
});
