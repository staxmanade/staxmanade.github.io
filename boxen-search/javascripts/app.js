var app = angular.module('App', ['semverSort']);

app.controller('MainCtrl', function($scope, $http) {
  var url = "https://api.github.com/orgs/boxen/repos" + "?callback=JSON_CALLBACK";
  var allData = [];
  var repos = [];

  $scope.loaded = false;
  $scope.detail = null;
  $scope.detailClicked = function(item){
    $scope.detail = item;
    ga('send', 'event', 'detailClicked', (item || item.name));
    $http.jsonp(item.tags_url + "?callback=JSON_CALLBACK")
      .success(function(data, status, headers) {
        $scope.detail.tags = data.data;
        $scope.detail.tagsLoaded = true;
        $scope.selectedTag = $scope.detail.tags[0];
      });
  };


  var processAllData = function(result){

    (result || []).filter(function(item) {
      return (item.name || '').toLowerCase().indexOf('puppet-') === 0;
    }).forEach(function(item) {
      repos.push({
        shortName: item.name.substr(7),
        name: item.name,
        full_name: item.full_name,
        description: item.description,
        url: item.url,
        html_url: item.html_url,
        tags_url: item.tags_url,
        stargazers_count: item.stargazers_count,
        watchers_count: item.watchers_count,
        homepage: item.homepage,
      });
    });
    $scope.loaded = true;
  };

    var getNext = function(url) {
      url = url.replace(/\=angular.callbacks._(.*)\&/, '=JSON_CALLBACK&');
      return $http.jsonp(url)
        .success(function(data, status, headers) {
          var meta = data.meta;

          // poor-man's detection of server error
          if(data.data.message) {
            $scope.showError = true;
            $scope.error = $scope.error || {};
            $scope.error.message = data.data.message;
            return;
          }

          data.data.forEach(function(item){
            allData.push(item);
          });

          var nextLink = (meta.Link || []).filter(function(link) {
            return (link && link[1]).rel === 'next';
          });

          if (nextLink && nextLink.length) {
            nextUrl = nextLink[0][0];
            getNext(nextUrl);
          } else {
            processAllData(allData);
          }
        }).error(function(data, status, headers, config) {
          // called asynchronously if an error occurs
          // or server returns response with an error status.
          console.log(data);
          console.log("error", arguments);
        });
    };

    getNext(url);
    $scope.repos = repos;

});
