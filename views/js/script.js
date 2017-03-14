

angular.module("SomeApp", [])
  .controller("SomeAppCtrl", function($scope, $http) {
  
/*  $scope.logged = false;*/
  $scope.loginWindow = false;
  $scope.registerWindow = false;
  $scope.activeUser;
  
  $scope.userInfo = {
    userLogin: "",
    userPass: "",
    confUserPass: ""
  }
  
  let clearUserInfo = function() {
    $scope.userInfo.userLogin = "";
    $scope.userInfo.userPass = "";
    $scope.userInfo.confUserPass = "";
  }
  
  $scope.loginWarning = "";
  $scope.registerWarning = "";
  $scope.logWarning = false;

  $scope.regWarning = {
    passConfWarning: false,
    newUserCreated: false
  };

/*==========Page Loading==========*/
  
if (window.localStorage.RESTfulToken) {
  $http({
    method: "GET",
    url: "api/memberinfo",
    headers: {
      "authorization": window.localStorage.RESTfulToken
    }
  }).then(function(res){
      if (res.data.success) {
        $scope.activeUser = res.data.user;
        $scope.logged = true;
        console.log(res);
      }
  }),
    function(res){
      console.log(res);
    }
} else {
  $scope.logged = false;
};
  
/*===========Log Off===========*/
  
$scope.logOff = function() {
  $scope.logged = false;
  $scope.loginWindow = true;
  $scope.activeUser = "";
  window.localStorage.RESTfulToken = "";
}

if ($scope.logged == false) {

  $scope.loginWindow = true;

  $scope.activateLoginWindow = function () {
    $scope.loginWindow = true;
    $scope.registerWindow = false;
  };

  $scope.activateRegisterWindow = function () {
    $scope.loginWindow = false;
    $scope.registerWindow = true;
  }

  $scope.login = function () {
    $http({
      method: "POST",
      url: "/api/authenticate",
      data: {
        'name': $scope.userInfo.userLogin,
        'password': $scope.userInfo.userPass
      }
    }).then(function(res) {
      if(res.data.success){
        console.log(res);
        setTimeout(2000);
        window.localStorage.RESTfulToken = res.data.token;
        $scope.activeUser = $scope.userInfo.userLogin;
        $scope.logged = true;
        $scope.loginWindow = false;
        clearUserInfo();
      } else {
        $scope.loginWarning = res.data.msg;
        $scope.logWarning = false;
        console.log(res);
      }
    }),
    function(res) {
      console.log("Login error: " + res);
    }
  }
  
  $scope.registration = function() {
    $scope.regWarning.passConfWarning = false;
    
    if ($scope.userInfo.userPass == $scope.userInfo.confUserPass) {
      console.log("Bingo");
      $http({
        method: "POST",
        url: "/api/signup",
        data: {
          'name': $scope.userInfo.userLogin,
          'password': $scope.userInfo.userPass
        }
      }).then(function(res) {
        if(res.data.success) {
          $scope.regWarning.newUserCreated = true;
          $scope.registerWarning = res.data.msg;
          console.log(res);
        } else {
          $scope.regWarning.newUserCreated = false;
          $scope.registerWarning = res.data.msg;
          console.log(res);
        }
      }),
      function(res) {
        console.log("Registration error: " + res);
      } 
    } else {
        $scope.regWarning.passConfWarning = true;
    }
  }
/*
  $scope.logOff = function () {
    $scope.logged = false;
    $scope.loginWindow = true;
  }

  $scope.registration = function () {
    $scope.regWarning.nameWarning = false;
    $scope.regWarning.passConfWarning = false;
    $scope.regWarning.passWarning = false;
    $scope.regWarning.newUserCreated = false;
    let isLoginMatch = false;

    $scope.users.some(function (el) {
      console.log(el);
      console.log($scope.userInfo.userLogin);
      if (el.login.toLowerCase() == $scope.userInfo.userLogin.toLowerCase()) {
        $scope.regWarning.nameWarning = true;
        console.log("Logins is matching");
        isLoginMatch = true;
        return true;
      };
    });

    if (!isLoginMatch) {
      if ($scope.userInfo.userPass.length < 3) {
        $scope.regWarning.passWarning = true;
      } else {
        $scope.regWarning.passWarning = false;
        if ($scope.userInfo.userPass == $scope.userInfo.confUserPass) {
          $scope.users.push({
            login: $scope.userInfo.userLogin,
            pass: $scope.userInfo.userPass
          });
          $scope.regWarning.newUserCreated = true;
          console.log($scope.users);
          $scope.clearUserInfo();
        } else {
          $scope.regWarning.passConfWarning = true;
        }
      }
    }
  }*/
}
});
