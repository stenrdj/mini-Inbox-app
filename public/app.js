var myapp = angular.module('inboxApp', ["ui.router","ngRoute","ngStorage","ngDialog"]);
    myapp.config(function($stateProvider,$locationProvider,$routeProvider){
         $routeProvider.
            when('/login', {
              templateUrl: '../views/login.html'
                         }).
                when('/inbox', {
                 templateUrl: '../views/inbox.html'
                         }).
                 when('/inbox/:id', {
                 templateUrl: '../views/inboxConv.html'
                         }).
             otherwise({
               redirectTo: '/login'
                  });
    }).controller('inbox', function($scope,$timeout,$http,$localStorage,$sessionStorage,$localStorage,$location,ngDialog) {
 // verify login 
  if($localStorage.login == null) 
        $location.path('/login');

      $scope.openNewM = function () {

  console.log("new message clicked");
        ngDialog.open({ template: '../views/newMessage.html', className: 'ngdialog-theme-default' });
    };
  //updating DOM after 1 seconde to get new data .
$scope.intervalFunction = function(){
    $timeout(function() {
      $http.get("/inbox/").success( function(response) {
           if(response.id != null)
             $localStorage.login=true;
           $localStorage.id=response.id;
           
      $scope.user =response; 
   });
      $scope.intervalFunction();
    }, 1000)
  };

  // Kick off the interval
  $scope.intervalFunction();
 
  }).controller('inboxConv', function($scope,$http,$localStorage,$sessionStorage,$localStorage,$location,$routeParams) {
  //verify login
  if($localStorage.login == null) 
        $location.path('/login');
      //getting data from backend.
       $http.get("/inbox/"+$routeParams.id).success( function(response) {
           if(response.id != null)
             $localStorage.login=true;
      $scope.user =response[0]; 
      $scope.userid=$localStorage.id;
 });

 
  }).controller('login', function($scope,$http,$localStorage,$sessionStorage, $location) {

      
           if($localStorage.login== true)
            $location.path('/inbox');
        
  }).controller('newMessage', function($scope,$http,$localStorage,$sessionStorage,$localStorage,$location,ngDialog,$sce) {
//showing popup for sending a new message .
$scope.added="";
  console.log("new message opend");

     $http.get("/friends/").success( function(response) {
         //  this.friends="hello";
                           $scope.friends=response;

        });
     $scope.renderHtml = function (htmlCode) {
            return $sce.trustAsHtml(htmlCode);
        };
        $scope.add=function(name){
          $scope.added+="<span class='nameclick'>"+name+"</span>";
        };
     
  });
