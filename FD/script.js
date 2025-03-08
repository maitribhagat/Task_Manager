var app = angular.module("TaskApp", []);

app.controller("RegisterController", function ($scope, $http) {
    $scope.register = function () {
        if (!$scope.user || !$scope.user.username || !$scope.user.email || !$scope.user.password) {
            alert("All fields are required!");
            return;
        }

        $http.post("http://localhost:5000/api/register", $scope.user)
            .then(() => {
                alert("Registered Successfully!"); // ✅ This should show up
                window.location.href = "index.html";
            })
            .catch(error => {
                console.error("Registration failed:", error);
                alert("Error: Registration failed. Check console.");
            });
    };
});


app.controller("LoginController", function ($scope, $http) {
    $scope.login = function () {
        $http.post("http://localhost:5000/api/login", $scope.user).then((response) => {
            console.log("Response",response);
            
            if(response?.data?.success == false){
                alert(response?.data?.message);
            }
            if(response?.data?.success == true){
                localStorage.setItem("token", response.data.token);
                window.location.href = "tasks.html";

            }
        },err=>{
            console.log("Error login", err);
            
        });
    };
});


app.controller("TaskController", function ($scope, $http) {
    $http.get("http://localhost:5000/tasks", { headers: { Authorization: localStorage.getItem("token") }})
        .then(response => $scope.tasks = response.data);

    $scope.addTask = function () {
        $http.post("http://localhost:5000/tasks", $scope.newTask, { headers: { Authorization: localStorage.getItem("token") }})
            .then(() => window.location.reload());
    };

    $scope.deleteTask = function (id) {
        $http.delete(`http://localhost:5000/tasks/${id}`, { headers: { Authorization: localStorage.getItem("token") }})
            .then(() => {
                window.location.reload();
            }
        );
    };

    $scope.logout = function (id) {
        window.location.href = "index.html";
    }
});