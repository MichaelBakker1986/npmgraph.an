module.exports = require('an').controller(navbarController);
var registryUrl = require('../config.js').autoCompleteUrl;

function navbarController($scope, $http, $routeParams, $location, $q) {
  $scope.formatPkg = function (model) {
    if (typeof  model === 'string') {
      return model;
    }
    return model && model.id;
  };

  var path = $location.path();
  if (path) {
    // TODO: why routeParams does not work here?
    var pathParts = path.match(/\/view\/[23]d\/([^\/]+)\/?/);
    if (pathParts) $scope.selectedPackage = decodeURIComponent(pathParts[1] || '');
  }

  $scope.viewPackage = function (pkg, query) {
    var path = encodeURIComponent(pkg.id)
    if ($location.path().indexOf('/view/3d/') !== -1) {
      $location.path('/view/3d/' + path);
    } else {
      $location.path('/view/2d/' + path);
    }
  };

  $scope.getPackages = function(val) {
    if (val && val[0] === '@') {
      // scoped package, cannot suggest anything
      return $q.when([{
        id: val,
        value: {
          description: ''
        }
      }]);
    }
    return $http.get(registryUrl, {
      params: {
        limit: 10,
        reduce: false,
        startkey: JSON.stringify(val)
      }
    }).then(function(res){
      var packages = [];
      angular.forEach(res.data.rows, function(pkg){
        packages.push(pkg);
      });
      return packages;
    });
  };
}
