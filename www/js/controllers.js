var createTask = function(name, dueDate, workRem, importance, description) {
    return {
        id:nextTaskId++,
        name:name ? name : '',
        due_date:dueDate ? dueDate : -1,
        work_rem:workRem ? workRem : -1,
        importance:importance ? importance : -1,
        desc:description ? description : ''
        ranking = getRanking(due_date, work_rem, importance)
    };
}

var updateListOrder(){
    for (var i = 0; i < taskList.length; i++){
        taskList.sort(function(a, b){return b.ranking - a.ranking});
    }
};

var getRanking = function(due_date, work_rem, importance){
    //work remainging alsso needs to be in milliseconds
    var current_date = (new Date()).getTime();
    var ranking;
    if ((work_rem / (current_date - due_date)) >= 0.25){ //if the work remaining is 25% or more of the time left to complete task
        return ((current_date - due_date) / work_rem) * 100);
    }
    else {
        return ((importance * work_rem) / (due_date - work_rem));
    }
};



angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $timeout) {

    // With the new view caching in Ionic, Controllers are only called
    // when they are recreated or on app start, instead of every page change.
    // To listen for when this page is active (for example, to refresh data),
    // listen for the $ionicView.enter event:
    //$scope.$on('$ionicView.enter', function(e) {
    //});

    $scope.taskList = [];
    $scope.taskList.push(createTask("task1", "oct11", 15, 50, "sample_task"));
    $scope.taskList.push(createTask("task2", "oct11", 10, 45, "samplasdfasdfasdf"));
    $scope.taskList.push(createTask("task3", "oct11", 5, 40, "sample_tasasdffdasfsadfasdfk"));

    updateListOrder();


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
        $scope.taskList.push($scope.taskData);

        //reset data in add task form//
        $scope.taskData = createTask();

        $scope.closeTaskAddModal();
    };
})

.controller('PlaylistsCtrl', function($scope) {

})

.controller('PlaylistCtrl', function($scope, $stateParams) {
});
