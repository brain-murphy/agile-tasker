angular.module('app.routes', [])

.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider
    
      
    .state('menu', {
      url: '/side-menu21',
      abstract:true,
      templateUrl: 'templates/menu.html'
    })
      
    
      
        
    .state('menu.priorities', {
      url: '/priorities',
      views: {
        'side-menu21': {
          templateUrl: 'templates/priorities.html',
          controller: 'prioritiesCtrl'
        }
      }
    })
        
      
    
      
        
    .state('menu.viewTask', {
      url: '/priorities/:chatId',
      views: {
          'side-menu21': {
            templateUrl: 'templates/viewTask.html',
            controller: 'viewTaskCtrl'
          }
      }
    })
        
      
    
      
        
    .state('menu.editTask', {
      url: '/addTask/:chatId',
      views: {
          'side-menu21': {
            templateUrl: 'templates/editTask.html',
            controller: 'editTaskCtrl'
          }
      }
    })
        
      
    
      
        
    .state('menu.addATask', {
      url: '/addTask',
      views: {
        'side-menu21': {
          templateUrl: 'templates/addATask.html',
          controller: 'addATaskCtrl'
        }
      }
    })
        
      
    ;

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/side-menu21/priorities');

});