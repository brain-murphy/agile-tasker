var createTask = function(name, dueDate, workRem, importance, description) {
    return {
        id:nextTaskId++,
        name:name ? name : '',
        due_date:dueDate ? dueDate : -1,
        work_rem:workRem ? workRem : -1,
        importance:importance ? importance : -1,
        desc:description ? description : ''
    };
}


angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $timeout) {

<<<<<<< HEAD
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  // Form data for the login modal
  $scope.loginData = {};

  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  // Triggered in the login modal to close it
  $scope.closeLogin = function() {
    $scope.modal.hide();
  };

  // Open the login modal
  $scope.login = function() {
    $scope.modal.show();
  };

  //Hopefully this makes the time picker work!
  $scope.timePickerObject = {
  inputEpochTime: ((new Date()).getHours() * 60 * 60),  //Optional
  step: 15,  //Optional
  format: 12,  //Optional
  titleLabel: '12-hour Format',  //Optional
  setLabel: 'Set',  //Optional
  // closeLabel: 'Close',  //Optional
  setButtonType: 'button-positive',  //Optional
  // closeButtonType: 'button-stable',  //Optional
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

  // Perform the login action when the user submits the login form
  $scope.doLogin = function() {
    console.log('Doing login', $scope.loginData);

    // Simulate a login delay. Remove this and replace with your login
    // code if using a login system
    $timeout(function() {
      $scope.closeLogin();
    }, 1000);
  };
=======
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
>>>>>>> 27364bb07fc4ad60426a71e8e4dc258fbfe4f39e
})

.controller('PlaylistsCtrl', function($scope) {

})

.controller('PlaylistCtrl', function($scope, $stateParams) {
});
