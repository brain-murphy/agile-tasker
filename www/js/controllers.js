var createTask,
    updateListOrder,
    getRanking;

createTask = function (name, dueDate, workRem, importance, description) {
    return {
        id:nextTaskId++,
        name:name ? name : '',
        due_date:dueDate ? dueDate : new Date(),
        work_rem:workRem ? workRem : 1,
        importance:importance ? importance : 1,
        desc:description ? description : '',
        isExpanded:false
    };
};


updateListOrder = function ($rootScope) {
    console.log('updateListOrder');
    printTasks($rootScope);
    console.log('updateListOrder():before', $rootScope.taskList);
    $rootScope.taskList.sort(function(a, b) {
        return getRanking(a.due_date, a.work_rem, a.importance) - getRanking(b.due_date, b.work_rem, b.importance);
    });
    printTasks($rootScope);
};

function printTasks  ($rootScope) {
    var string = '';
    $rootScope.taskList.forEach(function (e, i) {
        string += JSON.stringify(e) + ', ';
    });
    console.log('updateListOrder():after', string);
}
getRanking = function (due_date, work_rem, importance) {
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



angular.module('starter.controllers', ['ionic-timepicker'])



.controller('AppCtrl', function($scope, $rootScope, $ionicModal, $timeout) {


    // With the new view caching in Ionic, Controllers are only called
    // when they are recreated or on app start, instead of every page change.
    // To listen for when this page is active (for example, to refresh data),
    // listen for the $ionicView.enter event:
    //$scope.$on('$ionicView.enter', function(e) {
    //});

    $rootScope.taskList = [];

    $rootScope.taskList.push(createTask("Email Alyshia", new Date().getTime() + 1000 * 60 * 60 * 23, 10, 45, "Tech talk registration for club meeting"));
    $rootScope.taskList.push(createTask("Study Physics", new Date().getTime() + 1000 * 60 * 60 * 24, 15, 50, "Chapters 16, 17, and 18"));
    $rootScope.taskList.push(createTask("Finish Ticket 44220", new Date().getTime() + 1000 * 60 * 60 * 10, 5, 40, "testing needed on IE8"));
    $rootScope.taskList.push(createTask("Ask about holiday PTO", new Date().getTime() + 1000 * 60 * 60 * 10, 5, 40, "see if we get that date off"));
    $rootScope.taskList.push(createTask("Garbage bags", new Date().getTime() + 1000 * 60 * 60 * 10, 5, 40, "45 gallon"));
    $rootScope.taskList.push(createTask("Return shirt", new Date().getTime() + 1000 * 60 * 60 * 10, 5, 40, "reciept for target"));


    // updateListOrder($rootScope);
    $scope.search_string = '';
    $scope.searchList = [];

    $scope.shouldShowReorder = false;

    $scope.doSearch = function(){
        console.log('test');
        $scope.searchList.length = 0; //reset list with each search
        for (var i = 0; i < $rootScope.taskList.length; i++){
            if ($rootScope.taskList[i].name.indexOf($scope.search_string) <= 0){
                $scope.searchList.push($rootScope.taskList[i]);
            }
        }
    }

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


    // Form data for the login modal
    //$scope.taskData = {};

    //task that models the data in the taskAddModal//
    $scope.taskData = createTask();
    var now = new Date();
    $scope.timeData = {
        hour:toString(now.getHours()),
        hourOptions : function () {
            var hours = [],
            hour = 1;
            while (hour < 13) {
                hours.push(hour++);
            }
            return hours;
        }(),
        minute:toString(now.getMinutes()),
        minuteOptions: function () {
            var minutes = [],
            minute = 0;
            while (minute < 46) {
                minutes.push(minute);
                minute += 15;
            }
            return minutes;
        }(),
        AMPM:now.getHours() > 12 ? "PM":"AM",
        AMPMOptions:['AM', 'PM']
    };

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
        var isNewItem = true,
        millis = new Date($scope.taskData.due_date.getYear(), $scope.taskData.due_date.getMonth(),
            $scope.taskData.due_date.getDay(),
             $scope.timeData.hour + $scope.timeData.AMPM === 'PM' ? 12 : 0,
              $scope.timeData.minute, 0, 0).getTime();
        $scope.taskData.due_date = millis ;

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
        $scope.shouldShowReorder = !$scope.shouldShowReorder;
    };
})

.controller('TaskListCtrl', function($scope, $rootScope) {

    $scope.moveItem = function(item, fromIndex, toIndex) {
        $rootScope.taskList.splice(fromIndex, 1);
        $rootScope.taskList.splice(toIndex, 0, item);


        // printTasks($rootScope);
        // if (toIndex === 0) {
        //     //move to the front of the list. make importance one more than the current max//
        //
        //     console.log('moveItem() to front:', $rootScope.taskList[fromIndex].importance);
        //     $rootScope.taskList[fromIndex].importance = $rootScope.taskList[toIndex].importance + 1;
        // } else if (toIndex === $rootScope.taskList.length - 1) {
        //     //move to the last place in the list. make importance one third of the current min//
        //
        //     console.log('moveItem() to back:', $rootScope.taskList[fromIndex].importance);
        //     $rootScope.taskList[fromIndex].importance = $rootScope.taskList[toIndex].importance / 3 * 2;
        // } else {
        //     //move in between two elements. make importance halfway between adjacent vals//
        //
        //     console.log('moveItem() inBetween:');
        //     $rootScope.taskList[fromIndex].importance = ($rootScope.taskList[toIndex].importance +
        //             $rootScope.taskList[toIndex + 1].importance) / 2;
        // }
        //
        // console.log('moveItem():after');
        // printTasks($rootScope);
        // //sort, now that values are updated//
        // updateListOrder($rootScope);
    };
    $scope.onTaskClicked = function (task) {
        var taskIndex = $rootScope.taskList.indexOf(task);
        $rootScope.taskList[taskIndex].isExpanded = !task.isExpanded;
    };
})

.controller('PlaylistCtrl', function($scope, $stateParms) {
});
