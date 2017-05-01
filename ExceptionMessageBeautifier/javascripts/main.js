angular.module('App', ['ngAnimate']);

if (!exports && !exports.format) {
    exports = exports || {};
    exports.format = function () {
        return "Oops, something went wrong with the page load - sorry about that. Please report in the github issues";
    };

}

formatException = exports.format;

function getQueryVariable(variable) {
    var query = window.location.search.substring(1);
    var vars = query.split('&');
    for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split('=');
        if (decodeURIComponent(pair[0]) == variable) {
            return decodeURIComponent(pair[1]);
        }
    }
    console.log('Query variable %s not found', variable);
}


function ExBeautifierCtrl($scope) {

    var passedEx = getQueryVariable('ex');
    $scope.exInput = passedEx;

    $scope.shouldShowExample = false;
    $scope.showExample = function () {
        $scope.shouldShowExample = !$scope.shouldShowExample;
    }
    $scope.$watch('exInput', function () {
        var input = $scope.exInput || '';

        $scope.exOutput = formatException(input);

        var url = location.origin + location.pathname;
        if (input.trim()) {
            url += "?ex=" + encodeURIComponent(input);
        }
        history.replaceState(null, '', url)
    });

}
