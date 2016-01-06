/* global angular */

angular.module('app.controllers.priorities', ['app.services'])

.controller('prioritiesCtrl', function($scope, MockData, CalculatePriority) {
	$scope.tasks = [];
	
	MockData.on('child_added', function (snapshot) {
		var task = parseTaskWithUidProp(snapshot);
		
		placeInArrayByPriority(task, $scope.tasks, CalculatePriority);
	});
	
	console.log(JSON.stringify($scope.tasks));
});

function parseTaskWithUidProp(snapshot) {
	var taskWithUid = snapshot.val();
	taskWithUid.uid = snapshot.key();
	return taskWithUid;
}

function placeInArrayByPriority(newTask, array, priorityFunction) {
	console.log(JSON.stringify(newTask));
	if (array.length === 0) {
		array.push(newTask);
	}
	
	var newTaskPriority = priorityFunction(newTask);
	
	for (var index = array.length - 1; index > -1; index--) {
		var currentElement = array[index];
		if (priorityFunction(currentElement) > newTaskPriority) {
			array.splice(index + 1, 0, newTask);
			return;
		}
	}
	
	var topPriorityTask = array[0];
	if (newTaskPriority > priorityFunction(topPriorityTask)) {
		array.splice(0, 0, newTask);
	}
}

