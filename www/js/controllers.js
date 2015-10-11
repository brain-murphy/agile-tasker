var createTask,
    updateListOrder,
    getRanking,
    getImportanceForRanking,
    printTask,
    nextTaskId = 0;

createTask = function (name, dueDate, workRem, importance, description) {
    var task = {
        id:nextTaskId,
        name:name ? name : '',
        due_date:dueDate ? dueDate : new Date(),
        work_rem:workRem ? workRem : 1,
        importance:importance ? importance : 1,
        desc:description ? description : '',
        isExpanded:false,
        _ranking:nextTaskId++
    };
    return task;
};

function merge(left, right){
    var result  = [],
        il      = 0,
        ir      = 0;

    while (il < left.length && ir < right.length){
        if (getRanking(left[il]) < getRanking(right[ir])){
            result.push(left[il++]);
        } else {
            result.push(right[ir++]);
        }
    }

    return result.concat(left.slice(il)).concat(right.slice(ir));
}

function mergeSort(items){

    // Terminal case: 0 or 1 item arrays don't need sorting
    if (items.length < 2) {
        return items;
    }

    var middle = Math.floor(items.length / 2),
        left    = items.slice(0, middle),
        right   = items.slice(middle);

    return merge(mergeSort(left), mergeSort(right));
}

getRanking = function (task) {
    var now = (new Date()).getTime(),
        timeToDueDate = task.due_date.getTime() - now,
        work_rem = task.work_rem * 1000 * 60 * 60,
        ranking = task.importance * work_rem / (timeToDueDate - work_rem);

    if (work_rem / timeToDueDate > (0.25)) {
        ranking = ranking * 4;
    }

    return ranking;
};

getImportanceForRanking = function (task, ranking) {
    var now = (new Date()).getTime(),
        timeToDueDate = task.due_date.getTime() - now,
        work_rem = task.work_rem * 1000 * 60 * 60,
        importance = ranking * (timeToDueDate - work_rem) / work_rem;

    if (work_rem / timeToDueDate > 0.25) {
        importance = importance / 4;
    }

    return importance;
};

printTask = function (task) {
    console.log(task.name + ':', getRanking(task));
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

    $rootScope.taskList.push(createTask("Email Alyshia", new Date(new Date().getTime() + 1000 * 60 * 60 * 23), 10, 45, "Tech talk registration for club meeting"));
    $rootScope.taskList.push(createTask("Study Physics", new Date(new Date().getTime() + 1000 * 60 * 60 * 24), 15, 50, "Chapters 16, 17, and 18"));
    $rootScope.taskList.push(createTask("Finish Ticket 44220", new Date(new Date().getTime() + 1000 * 60 * 60 * 10), 5, 60, "testing needed on IE8"));
    $rootScope.taskList.push(createTask("Ask about holiday PTO", new Date(new Date().getTime() + 1000 * 60 * 60 * 10), 1, 30, "see if we get that date off"));
    $rootScope.taskList.push(createTask("Garbage bags", new Date(new Date().getTime() + 1000 * 60 * 60 * 10), 2, 30, "45 gallon"));
    $rootScope.taskList.push(createTask("Return shirt", new Date(new Date().getTime() + 1000 * 60 * 60 * 10), 1, 50, "reciept for target"));

    $scope.shouldShowReorder = false;

    //$rootScope.taskList = mergeSort($rootScope.taskList);

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
            updateListOrder();
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



    $scope.getColor = function (task) {
        var ranking = getRanking(task);


    };

    $scope.moveItem = function(item, fromIndex, toIndex) {
        $rootScope.taskList.splice(fromIndex, 1);
        $rootScope.taskList.splice(toIndex, 0, item);
        // console.log('moveItem');
        // var toTask = $rootScope.taskList[toIndex];
        //
        // $rootScope.taskList.forEach(function (e, i) {
        //     printTask(e);
        // });
        //
        // if (toIndex === 0) {
        //     $rootScope.taskList[fromIndex].importance = getImportanceForRanking(toTask, getRanking(toTask)) + 1;
        // } else if (toIndex === $rootScope.taskList.length - 1) {
        //     $rootScope.taskList[fromIndex].importance = getImportanceForRanking(toTask, getRanking(toTask)) * 2 / 3;
        // } else {
        //     $rootScope.taskList[fromIndex].importance = (getImportanceForRanking(toTask, getRanking(toTask)) +
        //             getImportanceForRanking($rootScope.taskList[toIndex + 1], getRanking($rootScope.taskList[toIndex + 1]))) / 2;
        // }
        //
        // $rootScope.taskList.forEach(function (e, i) {
        //     $rootScope.taskList[i]._ranking = getRanking(e);
        // });
        // console.log("after");
        // $rootScope.taskList.forEach(function (e, i) {
        //     printTask(e);
        // });


    };
    $scope.onTaskClicked = function (task) {
        var taskIndex = $rootScope.taskList.indexOf(task);
        $rootScope.taskList[taskIndex].isExpanded = !task.isExpanded;
    };
})

.controller('PlaylistCtrl', function($scope, $stateParams) {
})

.controller('SearchCtrl', function($scope, $rootScope, $stateParams){
    $scope.search_string = "";
    $scope.searchList = [];

    console.log("startup");
    $scope.doSearch = function() {
        console.log($scope.search_string);
        $scope.searchList.length = 0; //reset list with each search
        for (var i = 0; i < $rootScope.taskList.length; i++){
            if ($rootScope.taskList[i].name.indexOf($scope.search_string) >= 0){
                $scope.searchList.push($rootScope.taskList[i]);
                console.log($rootScope.taskList[i].name.indexOf($scope.search_string));
            }
        }
        console.log($scope.searchList.length);
    };
});
