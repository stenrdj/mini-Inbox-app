var myapp = angular.module('inboxApp', ["ui.router","ngRoute"]);
    myapp.config(function($stateProvider,$locationProvider,$routeProvider){
         $routeProvider.
            when('/login', {
              templateUrl: '../views/login.html'
                         }).
                when('/inbox', {
                 templateUrl: '../views/inbox.html'
                         }).
                when('/newMessage', {
                 templateUrl: '../views/newMessage.html'
                         }).
             otherwise({
               redirectTo: '/login'
                  });
    }).controller('inbox', function($scope,$http) {
       $http.get("/inbox").success( function(response) {
      $scope.user =response._json; 
   });
        
  });
