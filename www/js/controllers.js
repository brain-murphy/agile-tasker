var createTask;

 createTask = function (name, dueDate, workRem, importance, description) {
    return {
        id:nextTaskId++,
        name:name ? name : '',
        due_date:dueDate ? dueDate : -1,
        work_rem:workRem ? workRem : -1,
        importance:importance ? importance : -1,
        desc:description ? description : '',
        ranking:getRanking(dueDate, workRem, importance)
    };
};


var getRanking = function(due_date, work_rem, importance){
    //work remainging alsso needs to be in milliseconds
    var current_date = (new Date()).getTime();
    var ranking;
    if ((work_rem / (current_date - due_date)) >= 0.25){ //if the work remaining is 25% or more of the time left to complete task
        return ((current_date - due_date) / work_rem) * 100;
    }
    else {
        return ((importance * work_rem) / (due_date - work_rem));
    }
};



angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $rootScope, $ionicModal, $timeout) {

    $scope.updateListOrder = function(){
        for (var i = 0; i < $scope.taskList.length; i++){
            $scope.taskList.sort(function(a, b){return b.ranking - a.ranking});
        }
    };

    $scope.timePickerObject = {
        inputEpochTime: ((new Date()).getHours() * 60 * 60),  //Optional
        step: 15,  //Optional
        format: 12,  //Optional
        titleLabel: '12-hour Format',  //Optional
        setLabel: 'Set',  //Optional
        closeLabel: 'Close',  //Optional
        setButtonType: 'button-positive',  //Optional
        closeButtonType: 'button-stable',  //Optional
        callback: function (val) {    //Mandatory
            timePickerCallback(val);
        }
    };

    function timePickerCallback(val) {
        if (typeof (val) === 'undefined') {
            console.log('Time not selected');
        } else {
            var selectedTime = new Date(val * 1000);
            console.log('Selected epoch is : ', val, 'and the time is ', selectedTime.getUTCHours(), ':', selectedTime.getUTCMinutes(), 'in UTC');
  }
}

    // With the new view caching in Ionic, Controllers are only called
    // when they are recreated or on app start, instead of every page change.
    // To listen for when this page is active (for example, to refresh data),
    // listen for the $ionicView.enter event:
    //$scope.$on('$ionicView.enter', function(e) {
    //});

    $rootScope.taskList = [];
    $rootScope.taskList.push(createTask("task1", "oct11", 15, 50, "sample_task"));
    $rootScope.taskList.push(createTask("task2", "oct11", 10, 45, "samplasdfasdfasdf"));
    $rootScope.taskList.push(createTask("task3", "oct11", 5, 40, "sample_tasasdffdasfsadfasdfk"));

    $scope.updateListOrder();


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
        console.log('taskData in addTask: ', $scope.taskData);
        $scope.taskAddModal.show();
    };

    // Perform the login action when the user submits the login form
    $scope.doTaskAdd = function() {
        var isNewItem = true;
        console.log('adding task', $scope.taskData);

        //add task data to task list//
        $rootScope.taskList.forEach(function (ele, i) {
            if (ele.id === $scope.taskData.id) {
                taskList.splice(i, 1, $scope.taskData);
                isNewItem = false;
            }
        });

        if (isNewItem) {
            $rootScope.taskList.push($scope.taskData);
        }

        //reset data in add task form//
        $scope.taskData = createTask();

        $scope.closeTaskAddModal();
    };

    $scope.reorderTaskList = function () {

    };
})

.controller('TaskListCtrl', function($scope, $rootScope) {
    $scope.moveItem = function(item, fromIndex, toIndex) {
        $rootScope.taskList.splice(fromIndex, 1);
        $rootScope.taskList.splice(toIndex, 0, item);
    };
})

.controller('PlaylistCtrl', function($scope, $stateParams) {
});
