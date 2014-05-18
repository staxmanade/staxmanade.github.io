angular.module('App', ['ngAnimate']);

if (!exports && !exports.format) {
    exports = exports || {};
    exports.format = function () {
        return "Oops, something went wrong with the page load - sorry about that. Please report in the github issues";
    };

}

formatException = exports.format;


function ExBeautifierCtrl($scope) {

    $scope.shouldShowExample = false;
    $scope.showExample = function () {
        $scope.shouldShowExample = !$scope.shouldShowExample;
    }
    $scope.$watch('exInput', function () {
        $scope.exOutput = formatException($scope.exInput);
    });

}
